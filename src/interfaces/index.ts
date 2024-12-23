import { HttpStatus } from "@nestjs/common";

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CountResult {
  total: string;
}

export interface DatabaseErrorResponse {
  statusCode: HttpStatus;
  error: string;
  message: string;
  code: string;
  constraints?: string;
  column?: string;
  detail?: string;
}
