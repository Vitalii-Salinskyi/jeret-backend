import { IsNotEmpty, IsString } from "class-validator";

import { CreateSessionDto } from "src/sessions/dtos/create-session.dto";

export class RefreshTokensDto extends CreateSessionDto {
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}
