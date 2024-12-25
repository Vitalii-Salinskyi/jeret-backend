import { HttpException, HttpStatus } from "@nestjs/common";

import { DatabaseError } from "pg";

import { DatabaseErrorResponse } from "src/interfaces";

export class DatabaseException extends HttpException {
  private responseBody: DatabaseErrorResponse;

  constructor(error: DatabaseError, message?: string) {
    const response = DatabaseException.createResponse(error, message);
    super(response, response.statusCode);
    this.responseBody = response;
  }

  private static createResponse(error: DatabaseError, message?: string): DatabaseErrorResponse {
    switch (error.code) {
      case "23514":
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          error: "Check Violation",
          message: message || "Check constraint violation",
          code: error.code,
          constraints: error?.constraint,
        };
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
      case "42601":
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          error: "Syntax Error",
          message: message || "SQL syntax error in the query",
          code: error.code,
          detail: error.detail,
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

  setMessage(message: string) {
    this.responseBody.message = message;
  }

  setStatusCode(code: HttpStatus) {
    this.responseBody.statusCode = code;
  }

  getResponse(): DatabaseErrorResponse {
    return this.responseBody;
  }
}
