export interface Timestamp {
  createdAt: number;
  updatedAt?: number;
  publishedAt?: number;
  deletedAt?: number;
}

export interface PaginatedData<T> {
  skip: number;
  limit: number;
  total: number;
  data: T[];
}
