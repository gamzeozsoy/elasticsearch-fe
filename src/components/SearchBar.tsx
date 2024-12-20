import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  query: string;
  isLoading: boolean;
  onChange: (value: string) => void;
}

export function SearchBar({ query, isLoading, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search products..."
          className="w-full px-4 py-3 pl-12 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          {isLoading ? (
            <div className="w-5 h-5 border-t-2 border-blue-500 border-solid rounded-full animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>
    </div>
  );
}