export interface IDashboardInfo {
  total: {
    open: number;
    closed: number;
    cancelled: number;
  };
  my: {
    open: number;
    closed: number;
    cancelled: number;
  };
}
