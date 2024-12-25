import { IsInt, IsNotEmpty, IsPositive } from "class-validator";

export class FollowUserDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  following_id: number;
}
