import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { EmailService } from './email.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly emailService: EmailService,
  ) {}

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
}
