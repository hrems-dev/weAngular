
export interface PaginationModel<T> {
  content: T;
  pageable: {
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
    sort?: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
  sort?: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
}
