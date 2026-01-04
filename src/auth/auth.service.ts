import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyRegisterDto } from './dto/verify-register.dto';
import { User } from './schema/user.schema';
import { VerificationCode } from './schema/verification.schema';
@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private mailerService: MailerService,
        @InjectModel('User') private userModel: Model<User>,
        @InjectModel('VerificationCode') private verificationModel: Model<VerificationCode>,
    ) {}


    async register(register: RegisterDto): Promise<RegisterResponseDto> {
        const existingUser = await this.userModel.findOne({
            $or: [{ username: register.username }, { email: register.email }],
        });
        if (existingUser) {
            throw new BadRequestException('Username hoặc email đã được sử dụng.');
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await this.verificationModel.findOneAndUpdate(
            { email: register.email },
            {
                email: register.email,
                code,
                expiresAt,
                used: false,
            },
            { upsert: true, new: true },
        );

        try {
            await this.mailerService.sendMail({
                to: register.email,
                subject: 'Mã xác nhận đăng ký Pet Shop',
                text: `Mã xác nhận của bạn là ${code}. Mã hết hạn sau 10 phút.`,
            });
        } catch (error) {
            console.error('Mail send error:', error);
            throw new InternalServerErrorException('Không gửi được email xác nhận');
        }

        return {
            success: true,
            message: 'Đã gửi mã xác nhận tới email',
        };
    }

    async verifyRegister(data: VerifyRegisterDto): Promise<RegisterResponseDto> {
        const existingUser = await this.userModel.findOne({
            $or: [{ username: data.username }, { email: data.email }],
        });
        if (existingUser) {
            throw new BadRequestException('Username hoặc email đã được sử dụng.');
        }

        const verification = await this.verificationModel.findOne({
            email: data.email,
            code: data.code,
            used: false,
            expiresAt: { $gt: new Date() },
        });

        if (!verification) {
            throw new BadRequestException('Mã xác nhận không hợp lệ hoặc đã hết hạn');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const newUser = new this.userModel({
            username: data.username,
            password: hashedPassword,
            email: data.email,
        });
        await newUser.save();

        verification.used = true;
        verification.userId = String(newUser._id);
        await verification.save();

        return {
            success: true,
            message: 'Xác nhận thành công, tài khoản đã được tạo',
        };
    }

    async testEmail(): Promise<{ success: boolean; message: string }> {
        try {
            await this.mailerService.sendMail({
                to: 'boy19052005@gmail.com',
                subject: 'Test Email - Pet Shop',
                text: 'Đây là email test từ Pet Shop Backend',
            });
            return { success: true, message: 'Email sent successfully' };
        } catch (error) {
            console.error('Test email error:', error);
            return { success: false, message: `Error: ${error.message}` };
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
