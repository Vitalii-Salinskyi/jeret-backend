import { IsJWT, IsNotEmpty } from "class-validator";

import { CreateSessionDto } from "src/sessions/dtos/create-session.dto";

export class RefreshTokensDto extends CreateSessionDto {
  @IsNotEmpty()
  @IsJWT()
  refresh_token: string;
}
