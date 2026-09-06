export interface IPaginationResponse<T> {
  total: number;
  limit: number;
  offset: number;
  results: T[];
}

export interface IPaginationParams {
  limit?: number;
  offset?: number;
}
