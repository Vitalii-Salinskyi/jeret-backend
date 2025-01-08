import { IsNotEmpty, IsNumber } from "class-validator";

export class MemberDto {
  @IsNotEmpty()
  @IsNumber()
  member_id: number;

  @IsNotEmpty()
  @IsNumber()
  project_id: number;
}
