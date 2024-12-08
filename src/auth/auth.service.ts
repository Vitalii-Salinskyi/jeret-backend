import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class AuthService {
  constructor(private readonly dbService: DatabaseService) {}
}
