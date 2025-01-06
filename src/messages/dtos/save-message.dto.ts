import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

import { IFileDto } from "src/interfaces/chats";

export class SaveMessageDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsDateString()
  created_at: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsNumber()
  sender_id: number;

  @IsNumber()
  @IsNotEmpty()
  chat_id: number;

  @IsOptional()
  @IsBoolean()
  seen?: boolean;

  @IsOptional()
  @IsArray()
  files?: IFileDto[];
}
