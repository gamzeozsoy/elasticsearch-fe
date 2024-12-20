import React, { useCallback, useEffect, useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { ProductList } from './components/ProductList';
import { useDebounce } from './hooks/useDebounce';
import type { Product, SearchState, SearchResponse } from './types/product';

const ITEMS_PER_PAGE = 10;
const API_URL = 'http://localhost:8080/apis/products';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    currentPage: 1,
    sortBy: 'productName',
    sortOrder: 'asc',
  });

  const debouncedQuery = useDebounce(searchState.query, 300);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data: Product[] = await response.json();
      
      // Filter based on search query
      let filteredProducts = data;
      if (debouncedQuery) {
        filteredProducts = data.filter(product => 
          product.productName.toLowerCase().includes(debouncedQuery.toLowerCase())
        );
      }

      // Sort products
      filteredProducts.sort((a, b) => {
        const aValue = a[searchState.sortBy];
        const bValue = b[searchState.sortBy];
        const modifier = searchState.sortOrder === 'asc' ? 1 : -1;
        
        return aValue > bValue ? modifier : -modifier;
      });

      setProducts(filteredProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedQuery, searchState.sortBy, searchState.sortOrder]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (query: string) => {
    setSearchState(prev => ({ ...prev, query, currentPage: 1 }));
  };

  const handlePageChange = (page: number) => {
    setSearchState(prev => ({ ...prev, currentPage: page }));
  };

  const handleSort = (field: keyof Product) => {
    setSearchState(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  const paginatedProducts = products.slice(
    (searchState.currentPage - 1) * ITEMS_PER_PAGE,
    searchState.currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Product Search
        </h1>

        <SearchBar
          query={searchState.query}
          isLoading={isLoading}
          onChange={handleSearch}
        />

        {error ? (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        ) : (
          <ProductList
            products={paginatedProducts}
            searchState={searchState}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onSortChange={handleSort}
          />
        )}
      </div>
    </div>
  );
}

export default App;