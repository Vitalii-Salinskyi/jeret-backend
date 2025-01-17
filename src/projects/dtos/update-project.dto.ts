import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateProjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  project_id: number;
}
