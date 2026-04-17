import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';


export class RegisterDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @Transform(({ value }) => value.trim())
  readonly firstName!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @Transform(({ value }) => value.trim())
  readonly lastName!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  readonly username!: string;

  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  readonly email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  readonly password!: string;
}