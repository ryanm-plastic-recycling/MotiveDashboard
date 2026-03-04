export type DashboardFilters = {
  start: string;
  end: string;
  search?: string;
  carrierIds?: string[];
  customerIds?: string[];
  statuses?: string[];
  modes?: string[];
  bbox?: string;
  mapBoundsOnly?: boolean;
};
