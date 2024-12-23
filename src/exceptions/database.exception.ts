import { HttpException, HttpStatus } from "@nestjs/common";

import { DatabaseError } from "pg";

export class DatabaseException extends HttpException {
  constructor(error: DatabaseError, message?: string) {
    const response = DatabaseException.createResponse(error, message);
    super(response, response.statusCode);
  }

  private static createResponse(error: DatabaseError, message?: string) {
    switch (error.code) {
      case "23505":
        return {
          statusCode: HttpStatus.CONFLICT,
          error: "Conflict",
          message: message || "Resource already exists",
          code: error.code,
          constraints: error?.constraint,
        };
      case "23503":
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          error: "Foreign Key Violation",
          message: message || "Referenced resource does not exist",
          code: error.code,
          constraints: error?.constraint,
        };
      case "23502":
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          error: "Not Null Violation",
          message: message || "Required field is missing",
          code: error.code,
          column: error.column,
          constraints: error?.constraint,
        };
      case "22P02":
        return {
          statusCode: HttpStatus.BAD_GATEWAY,
          error: "Invalid input",
          message: message || "Invalid input syntax",
          code: error.code,
        };
      case "42703":
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          error: "Column Error",
          message: message || "Column does not exist",
          code: error.code,
          detail: error.detail,
        };
      default:
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          error: "Database Error",
          message: "An unexpected database error occurred",
          code: error.code,
        };
    }
  }
}
