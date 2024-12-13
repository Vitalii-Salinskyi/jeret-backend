import { Injectable, OnModuleDestroy, Logger } from "@nestjs/common";

import { Pool, PoolClient, QueryResult } from "pg";

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private readonly pool: Pool;

  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT || "5432"),
      max: 12,
    });
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  private async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }

  async query<T>(sql: string, params?: any[]): Promise<QueryResult<T>> {
    const client = await this.getClient();
    try {
      return await client.query(sql, params);
    } catch (error) {
      this.logger.error("Database Query Error:", {
        sql,
        params,
        message: error.message,
        code: error.code,
      });

      throw new Error(`Database query failed: ${error.message}`);
    } finally {
      client.release();
    }
  }

  async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.getClient();

    try {
      await client.query("BEGIN");

      const result = await callback(client);

      await client.query("COMMIT");

      return result;
    } catch (error) {
      await client.query("ROLLBACK");

      throw error;
    } finally {
      client.release();
    }
  }

  constructUpdateObject<T>(object: T) {
    const fieldsToUpdate: (keyof T)[] = Object.keys(object) as (keyof T)[];

    const updatedParts: string[] = [];
    const updatedValues: any[] = [];
    let paramCounter = 1;

    fieldsToUpdate.forEach((field) => {
      if (object[field] !== undefined && object[field] !== null) {
        updatedParts.push(`${field as string} = $${paramCounter}`);
        updatedValues.push(object[field]);
        paramCounter++;
      }
    });

    return {
      isEmpty: !updatedParts.length,
      updatedParts,
      updatedValues,
    };
  }
}
