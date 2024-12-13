import { Body, Controller, Get, HttpCode, Patch, Req, UseGuards } from "@nestjs/common";

import { AuthGuard } from "src/auth/auth.guard";

import { UsersService } from "./users.service";

import { UpdateUserDto } from "./dtos/upadte-user.dto";

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

  @UseGuards(AuthGuard)
  @Patch()
  @HttpCode(204)
  async updateUser(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    const user = req["user"];
    return await this.usersService.updateUser(updateUserDto, user.id);
  }
}
