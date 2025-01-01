import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateInboxMessageDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsNumber()
  sender_id: number;

  @IsNotEmpty()
  @IsNumber()
  receiver_id: number;

  @IsNotEmpty()
  @IsNumber()
  chat_id: number;

  @IsNotEmpty()
  @IsBoolean()
  seen: boolean;
}
