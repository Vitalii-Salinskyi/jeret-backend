import { Module, OnModuleInit, Logger } from "@nestjs/common";

import { DatabaseMigrationService } from "./database-migration.service";
import { DatabaseService } from "./database.service";

@Module({
  providers: [DatabaseService, DatabaseMigrationService],
  exports: [DatabaseService],
})
export class DatabaseModule implements OnModuleInit {
  private readonly logger = new Logger(DatabaseModule.name);

  constructor(private readonly migrationService: DatabaseMigrationService) {}

  async onModuleInit() {
    if (process.argv.includes("--migrate")) {
      this.logger.debug("Migration start ===============================================================");
      try {
        await this.migrationService.migrate();
        this.logger.log("Database migrations completed successfully");
      } catch (error) {
        this.logger.error("Failed to run migration due to:");
        this.logger.error(error.message);
      } finally {
        this.logger.debug("Exit ==========================================================================");
        process.exit(0);
      }
    }
  }
}
