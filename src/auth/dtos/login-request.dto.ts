import { IsNotEmpty, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { CreateSessionDto } from "src/sessions/dtos/create-session.dto";
import { LoginDto } from "./login.dto";

export class LoginRequestDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LoginDto)
  loginDto: LoginDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateSessionDto)
  createSessionDto: CreateSessionDto;
}
