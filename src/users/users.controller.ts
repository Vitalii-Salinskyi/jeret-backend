import { Controller, Get, Req, UseGuards } from "@nestjs/common";

import { UsersService } from "./users.service";
import { AuthGuard } from "src/auth/auth.guard";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get()
  getUsers(@Req() request: Request) {
    const user = request["user"];
    console.log(user);
    return "I'm protected user";
  }
}
