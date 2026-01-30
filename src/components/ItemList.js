import React from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const ItemList = ({ items, customKeys, onEdit, onDelete, search, setSearch, sortBy, setSortBy, sortDir, setSortDir }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg font-semibold">No items yet.</p>
        <p className="text-gray-500 dark:text-gray-400">Add your first item to get started!</p>
      </div>
    );
  }

  // Check which optional columns to show
  const hasQuantity = items.some(item => item.quantity !== undefined);
  const hasPrice = items.some(item => item.price !== undefined);
  const hasTotal = items.some(item => item.total !== undefined);
  const hasNotes = items.some(item => item.notes !== undefined);
  const hasCategory = items.some(item => item.category !== undefined);
  const hasAddedBy = items.some(item => item.addedBy !== undefined);

  const toggleSort = (key) => {
    if (sortBy === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDir('asc');
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 w-full md:w-1/3 bg-white dark:bg-gray-800"
        />
        <div className="flex space-x-2">
          <button onClick={() => toggleSort('name')} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition">
            Sort by Name {sortBy === 'name' && (sortDir === 'asc' ? '↑' : '↓')}
          </button>
          <button onClick={() => toggleSort('price')} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition">
            Sort by Price {sortBy === 'price' && (sortDir === 'asc' ? '↑' : '↓')}
          </button>
          <button onClick={() => toggleSort('total')} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition">
            Sort by Total {sortBy === 'total' && (sortDir === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              {hasQuantity && <th className="px-4 py-2 text-left">Quantity</th>}
              {hasPrice && <th className="px-4 py-2 text-left">Price</th>}
              {hasTotal && <th className="px-4 py-2 text-left">Total</th>}
              {hasNotes && <th className="px-4 py-2 text-left">Notes</th>}
              {hasCategory && <th className="px-4 py-2 text-left">Category</th>}
              {customKeys.map(key => (
                <th key={key} className="px-4 py-2 text-left capitalize">{key}</th>
              ))}
              {hasAddedBy && <th className="px-4 py-2 text-left">Added By</th>}
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition">
                <td className="px-4 py-2">{item.name}</td>
                {hasQuantity && <td className="px-4 py-2">{item.quantity ?? '-'}</td>}
                {hasPrice && <td className="px-4 py-2">{item.price ?? '-'}</td>}
                {hasTotal && <td className="px-4 py-2">{item.total ?? '-'}</td>}
                {hasNotes && <td className="px-4 py-2">{item.notes ?? '-'}</td>}
                {hasCategory && <td className="px-4 py-2">{item.category ?? '-'}</td>}
                {customKeys.map(key => (
                  <td key={key} className="px-4 py-2">{item.customFields?.[key] ?? '-'}</td>
                ))}
                {hasAddedBy && <td className="px-4 py-2">{item.addedBy ?? '-'}</td>}
                <td className="px-4 py-2 text-right flex justify-end space-x-2">
                  <button onClick={() => onEdit(item)} className="text-blue-500 hover:text-blue-700 transition" aria-label="Edit">
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button onClick={() => onDelete(item.id)} className="text-red-500 hover:text-red-700 transition" aria-label="Delete">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemList;