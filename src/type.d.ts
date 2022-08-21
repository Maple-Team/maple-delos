interface BaseList<T> {
  pagination: {
    total: number;
    current: number;
    pageSize: number;
  };
  records: T[];
}
