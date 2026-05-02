import { Transform } from "class-transformer";
import {
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsBoolean,
  IsEnum,
} from "class-validator";

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(300)
  @Transform(({ value }) => value.trim())
  readonly content!: string;
}

export class UpdateNoteDto {
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  @Transform(({ value }) => value.trim())
  readonly content!: string;

  @IsBoolean()
  readonly isHidden?: boolean;
}

export class NoteAccessDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  readonly userId!: string;

  @IsNotEmpty()
  @IsEnum(['VIEW', 'EDIT', 'FULL'])
  readonly permission?: string;
}

