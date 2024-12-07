import { Module, OnModuleInit } from "@nestjs/common";

import { DatabaseService } from "./database.service";
import { DatabaseMigrationService } from "./database-migration.service";

@Module({
  providers: [DatabaseService, DatabaseMigrationService],
  exports: [DatabaseService],
})
export class DatabaseModule implements OnModuleInit {
  constructor(private readonly migrationService: DatabaseMigrationService) {}

  async onModuleInit() {
    await this.migrationService.migrate();
  }
}
