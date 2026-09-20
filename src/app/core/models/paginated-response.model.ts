// core/models/paginated-response.model.ts
export interface PaginatedResponse<T> {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  pageCount: number;
  records: T[];
}