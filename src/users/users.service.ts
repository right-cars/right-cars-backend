import {
  Injectable,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from './email.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { unlink } from 'node:fs/promises';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private cloudinary: CloudinaryService,
  ) {}

  async findAll() {
    return this.userModel.find().exec();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async findById(id: string) {
    return this.userModel.findById(id).select('-password');
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { email, mobileNumber, password } = createUserDto;

    const existingUser = await this.userModel.findOne({
      $or: [{ email }, { mobileNumber }],
    });

    if (existingUser) {
      throw new ConflictException(
        'User with email or mobile number already exists',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = randomBytes(32).toString('hex');

    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      emailConfirmationToken: token,
      isEmailConfirmed: false,
    });

    const user = await createdUser.save();
    try {
      await this.emailService.sendConfirmationEmail(user.email, token);
      return user;
    } catch {
      throw new InternalServerErrorException('Something wrong with email send');
    }
  }

  async resendConfirmationEmail(email: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email is already confirmed');
    }

    try {
      await this.emailService.sendConfirmationEmail(
        user.email,
        user.emailConfirmationToken,
      );

      return { message: 'Confirmation email resent' };
    } catch {
      throw new InternalServerErrorException('Something wrong with email send');
    }
  }

  async confirmEmail(token: string): Promise<string> {
    const user = await this.userModel.findOne({
      emailConfirmationToken: token,
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired token');
    }

    user.isEmailConfirmed = true;
    user.emailConfirmationToken = null;
    await user.save();

    return 'Email confirmed successfully!';
  }

  
  async updateById(body, id) {
    const user = await this.findById(id);
    for(const key in body) {
      user[key] = body[key];
    }
    await user.save();

    return user;
  }

  async updateUser(body, email) {
    const user = await this.findByEmail(email);
    for(const key in body) {
      user[key] = body[key];
    }
    await user.save();
    await this.checkAndUpdateStatus(user);

    return user;
  }

  async deleteDocument(id, documentName) {
    const user = await this.findById(id);
    user[documentName] = "";
    await this.checkAndUpdateStatus(user);

    return user;
  }

  async verifyDocument(id, documentName) {
    const user = await this.findById(id);
    user.verifyDocuments.push(documentName);
    if(user.verifyDocuments.includes("idOrDriverLicence") && user.verifyDocuments.includes("proofOfPhysicalAddress")){
      user.status = "verified";
    }
    await user.save();

    return user;
  }

  async checkAndUpdateStatus(user) {
    const {isEmailConfirmed, emailConfirmationToken, resetToken, resetTokenExpires, deposit, ...other} = user._doc;
    const unverified = Object.values(other).some(item => item === "");
    if(unverified) {
      user.status = "unverified";
    } 
    else {
      user.status = "inProgress";
    }
    await user.save();
    return true;
  }

  async updateUserDoc(files, email) {
    const user = await this.findByEmail(email);

    if (files.idOrDriverLicence) {
      const idOrDriverLicence = await this.cloudinary.uploadDoc(files.idOrDriverLicence[0]);
      await unlink(files.idOrDriverLicence[0].path);
      user.idOrDriverLicence = idOrDriverLicence;
    }

    if (files.proofOfPhysicalAddress) {
      const proofOfPhysicalAddress = await this.cloudinary.uploadDoc(files.proofOfPhysicalAddress[0]);
      await unlink(files.proofOfPhysicalAddress[0].path);
      user.proofOfPhysicalAddress = proofOfPhysicalAddress;
    }

    await user.save();
    await this.checkAndUpdateStatus(user);

    return user;
  }

  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');
  
    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); 
  
    user.resetToken = token;
    user.resetTokenExpires = expires;
    await user.save();
  
    await this.emailService.sendPasswordResetEmail(user.email, token);
  
    return { message: 'Reset link sent' };
  }
  
  async resetPassword(token: string, newPassword: string) {
    const user = await this.userModel.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: new Date() },
    });
    if (!user) throw new BadRequestException('Token invalid or expired');
  
    user.password = await await bcrypt.hash(newPassword, 10); 
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();
  
    return { message: 'Password updated successfully' };
  }

  async generateJwt(user: User) {
    const payload = { email: user.email };

    return this.jwtService.sign(payload);
  }

  async login(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user || !user.isEmailConfirmed) {
      throw new UnauthorizedException('User not found or email not confirmed');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      throw new UnauthorizedException('Invalid credentials');

    return this.generateJwt(user);
    // const token = this.jwtService.sign({ sub: user._id });
    // return token;
  }

  async getUserFromEmail(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      return this.findByEmail(payload.email);
    } catch {
      return null;
    }
  }
}
