import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserSchema } from './schema/user.schema';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports:[
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
              secret: config.get<string>('auth.secret'),
              signOptions: {
                  expiresIn: config.get<string>('auth.expires'),
              },
            }),
    
    }),
    MongooseModule.forFeature([
              { name: 'User', schema: UserSchema },
            ]),
    
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
