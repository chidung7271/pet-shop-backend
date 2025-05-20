import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from './schema/user.schema';
@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService,
        @InjectModel('User') private userModel: Model<User>,
    ) {}


    async register(register: RegisterDto): Promise<RegisterResponseDto> {
        const existingUser = await this.userModel.findOne({
            $or: [{ username: register.username }, { email: register.email }],
        });
        if (existingUser) {
            throw new BadRequestException('Username hoặc email đã được sử dụng.');
        }
        const hashedPassword = await bcrypt.hash(register.password, 10);
        const newUser = new this.userModel({ username: register.username, password: hashedPassword, email: register.email });
        await newUser.save();
        return {
            message : "User registered successfully",
        }
    }

    async validateUser(username: string, password: string): Promise<any> {
        const user  = await this.userModel.findOne({ username });
        if (user) {
            const isMatch = await bcrypt.compare(password,user.password);
            if (isMatch) {
                return user;
            }
        }
        return null;

    }

    async login(data: LoginDto): Promise<LoginResponseDto> {
        const user = await this.validateUser(data.username, data.password);
        if (!user) {
            return {
                success : false,
                message : "Invalid username or password",
            }
        }
        const payload = { username: user.username, sub: user._id };
        const accessToken = this.jwtService.sign(payload);
        return {
            success : true,
            accessToken : accessToken,
            message : "Login successful",
        }

    }
}
