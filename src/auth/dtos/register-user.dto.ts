import { Transform } from "class-transformer";
import { IsEmail, IsOptional, IsString, IsUrl, Length } from "class-validator";

export class RegisterUserDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  @Length(1)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsUrl()
  profile_picture?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  @Length(6)
  password?: string;

  @IsOptional()
  @IsString()
  google_id?: string;
}
