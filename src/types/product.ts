export interface Product {
  id: string;
  productName: string;
  quantity: string;
  price: number;
}

export interface SearchState {
  query: string;
  currentPage: number;
  sortBy: keyof Product;
  sortOrder: 'asc' | 'desc';
}

export interface SearchResponse {
  data: Product[];
  error?: string;
}