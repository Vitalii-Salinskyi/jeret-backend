import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";

import { AuthGuard } from "src/auth/auth.guard";

import { FollowersService } from "./followers.service";

import { FollowUserDto } from "./dtos/follow-user.dto";
import { UnfollowUserDto } from "./dtos/unfollow-user.dto";

import { followType } from "src/interfaces/users";

@Controller("followers")
export class FollowersController {
  constructor(private readonly followersService: FollowersService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getBulkFollowers(@Req() req: Request, @Query("userIds") userIds: string) {
    try {
      const user = req["user"];

      if (!userIds) {
        throw new BadRequestException(
          "The 'userIds' query parameter is required. Please provide a comma-separated list of user IDs.",
        );
      }

      const targetUserIds = userIds.split(",").map(Number);

      return await this.followersService.getBulkFollowStatus(user.id, targetUserIds);
    } catch (error) {
      throw error;
    }
  }

  @Get(":userId")
  async getFollowers(
    @Param("userId", ParseIntPipe) userId: number,
    @Query("type") type: followType = "followers",
    @Query("limit", new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page?: number,
  ) {
    return await this.followersService.getFollows(userId, type, { page, limit });
  }

  @UseGuards(AuthGuard)
  @Post("follow")
  async followUser(@Req() req: Request, @Body() followUserDto: FollowUserDto) {
    const user = req["user"];
    return await this.followersService.followUser(user.id, followUserDto.following_id);
  }

  @UseGuards(AuthGuard)
  @Delete("unfollow")
  async unfollowUser(@Req() req: Request, @Body() followUserDto: UnfollowUserDto) {
    const user = req["user"];
    return await this.followersService.unfollowUser(user.id, followUserDto.following_id);
  }
}
