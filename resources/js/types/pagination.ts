export interface Paginated<T> {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  current_page_url: string;
  first_page_url: string;
  last_page_url: string;
  next_page_url: string | null;
  prev_page_url: string | null;
  path: string;
  from: number;
  to: number;
  data: T[];
}
