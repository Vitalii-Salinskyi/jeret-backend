import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

import { TokenService } from "./token.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException("Access token is missing. Please provide a valid token.");

    try {
      const payload = await this.tokenService.verifyToken(token);

      const isTokenExpired = this.isTokenExpired(payload.exp);

      if (isTokenExpired) throw new UnauthorizedException("Token has expired");

      request["user"] = payload;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException(error.message);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers["authorization"]?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }

  private isTokenExpired(exp: number): boolean {
    const currentTime = Math.floor(Date.now() / 1000);
    return exp < currentTime;
  }
}
