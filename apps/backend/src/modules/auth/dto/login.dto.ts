import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  readonly email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(128)
  readonly password!: string;
}

export class LoginResponseDto {
  accessToken!: string;
  refreshToken!: string;
  sessionId!: string;
}