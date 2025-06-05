import {
  Injectable,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from './email.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

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
    await this.emailService.sendConfirmationEmail(user.email, token);
    return user;
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

  async login(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user || !user.isEmailConfirmed) {
      throw new UnauthorizedException('User not found or email not confirmed');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ sub: user._id });
    return token;
  }

  async getUserFromToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      return this.findById(payload.sub);
    } catch {
      return null;
    }
  }
}
