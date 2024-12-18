import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  ParseIntPipe,
  Patch,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";

import { AuthGuard } from "src/auth/auth.guard";

import { UsersService } from "./users.service";

import { UpdateUserDto } from "./dtos/upadte-user.dto";

import { IUser, JobRolesEnum, UserSortType } from "src/interfaces/users";

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
    @Req() req: Request,
    @Query("category") category?: JobRolesEnum,
    @Query("sortBy") sortBy?: UserSortType,
    @Query("input") input?: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit?: number,
  ) {
    const user: IUser = req["user"];
    return await this.usersService.filterUsers(user.id, category, sortBy, input, { page, limit });
  }

  @UseGuards(AuthGuard)
  @Get("recent")
  async getRecentUsers(
    @Req() req: Request,
    @Query("limit", new DefaultValuePipe(8), ParseIntPipe) limit?: number,
  ) {
    const user: IUser = req["user"];
    return await this.usersService.getRecentUser(user.id, limit);
  }

  @UseGuards(AuthGuard)
  @Patch()
  @HttpCode(204)
  async updateUser(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    const user = req["user"];
    return await this.usersService.updateUser(updateUserDto, user.id);
  }
}
