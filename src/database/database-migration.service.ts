import { Injectable, Logger } from "@nestjs/common";

import { readFileSync } from "fs";
import { join } from "path";

import { DatabaseService } from "./database.service";

@Injectable()
export class DatabaseMigrationService {
  private readonly logger = new Logger(DatabaseMigrationService.name);

  constructor(private readonly dbService: DatabaseService) {}

  async migrate() {
    try {
      const migrationFilePath = join(process.cwd(), "migrations", "V5__trigger_rating_update.sql");

      const migrationSQL = readFileSync(migrationFilePath, "utf-8");

      await this.dbService.query(migrationSQL);
    } catch (error) {
      throw new Error(error);
    }
  }
}
