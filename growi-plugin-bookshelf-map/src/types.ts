export interface GrowiPage {
  id: string;
  path: string;
  title?: string;
  body?: string;
  createdAt?: string;
  updatedAt?: string;
  revision?: { body?: string };
  descendantCount?: number;
}

export interface PagesListResponse {
  pages: GrowiPage[];
  totalCount?: number;
}
