import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { readFileSync } from "fs";
import { join } from "path";

import { DatabaseService } from "./database.service";

@Injectable()
export class DatabaseMigrationService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly configService: ConfigService,
  ) {}

  async migrate() {
    try {
      const migrationFile = this.configService.get<string>("MIGRATION_FILENAME");

      if (!migrationFile) {
        throw new InternalServerErrorException("Migration version filename is not configured");
      }

      const migrationFilePath = join(process.cwd(), "migrations", migrationFile);

      const migrationSQL = readFileSync(migrationFilePath, "utf-8");

      await this.dbService.query(migrationSQL);
    } catch (error) {
      throw error;
    }
  }
}
