import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { IUser } from "src/interfaces/users";

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateAccessToken(user: IUser) {
    const payload = {
      id: user.id,
      email: user.email,
      picture: user.profile_picture,
      name: user.name,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_SECRET"),
      expiresIn: "10d",
    });
  }

  generateRefreshToken(user: IUser, sessionId: number) {
    const payload = {
      id: user.id,
      email: user.email,
      session_id: sessionId,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_SECRET"),
      expiresIn: "30d",
    });
  }

  async verifyToken(token: string) {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>("JWT_SECRET"),
    });

    return payload;
  }
}
