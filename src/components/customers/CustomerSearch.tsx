import { Search } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { setSearchQuery } from '@/store/slices/customersSlice';

export function CustomerSearch() {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.customers.searchQuery);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <input
        type="text"
        placeholder="Search customers by name, email, or ID..."
        value={searchQuery}
        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      />
    </div>
  );
}