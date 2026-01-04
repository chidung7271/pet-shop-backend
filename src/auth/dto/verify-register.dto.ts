import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyRegisterDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(4, 10)
  code: string;
}
