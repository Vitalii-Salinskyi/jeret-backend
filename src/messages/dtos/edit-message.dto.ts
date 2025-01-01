import { IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class EditMessageDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsDateString()
  edited_at: Date;

  @IsNotEmpty()
  @IsString()
  message: string;
}
