import { Transform } from "class-transformer";
import { IsEmail, IsString, Length } from "class-validator";

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @Length(6)
  password: string;
}
