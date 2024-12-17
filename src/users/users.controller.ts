import { Body, Controller, Get, HttpCode, ParseIntPipe, Patch, Query, Req, UseGuards } from "@nestjs/common";

import { AuthGuard } from "src/auth/auth.guard";

import { UsersService } from "./users.service";

import { UpdateUserDto } from "./dtos/upadte-user.dto";

import { JobRolesEnum, UserSortType } from "src/interfaces/users";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get("me")
  async getUsers(@Req() request: Request) {
    const user = request["user"];
    return await this.usersService.getUserProfile(user.id);
  }

  @UseGuards(AuthGuard)
  @Get()
  async filterUsers(
    @Query("category") category?: JobRolesEnum,
    @Query("sortBy") sortBy?: UserSortType,
    @Query("input") input?: string,
    @Query("page", ParseIntPipe) page?: number,
    @Query("limit", ParseIntPipe) limit?: number,
  ) {
    return await this.usersService.filterUsers(category, sortBy, input, { page, limit });
  }

  @UseGuards(AuthGuard)
  @Patch()
  @HttpCode(204)
  async updateUser(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    const user = req["user"];
    return await this.usersService.updateUser(updateUserDto, user.id);
  }
}
