import { CreateSessionDto } from "src/sessions/dtos/create-session.dto";
import { LoginDto } from "./login.dto";

export class LoginRequestDto {
  loginDto: LoginDto;
  createSessionDto: CreateSessionDto;
}
