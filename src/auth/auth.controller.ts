import { Body, Controller, Post } from "@nestjs/common";

import { AuthService } from "./auth.service";

import { RegisterUserDto } from "src/auth/dtos/register-user.dto";
import { LoginRequestDto } from "./dtos/login-request.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async registerUser(@Body() registerUserDto: RegisterUserDto) {
    return await this.authService.registerUser(registerUserDto);
  }

  @Post("login")
  async login(@Body() body: LoginRequestDto) {
    const { loginDto, createSessionDto } = body;
    return await this.authService.login(loginDto, createSessionDto);
  }
}
