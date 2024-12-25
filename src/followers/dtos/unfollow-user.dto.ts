import { IsInt, IsNotEmpty, IsPositive } from "class-validator";

export class UnfollowUserDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  following_id: number;
}
