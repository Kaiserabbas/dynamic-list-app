// src/App.js
import React, { useReducer, useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ItemList from './components/ItemList';
import ItemFormModal from './components/ItemFormModal';
import ConfirmationModal from './components/ConfirmationModal';
import useLocalStorage from './hooks/useLocalStorage';

// Reducer for managing list items
const itemsReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      return [...state, action.payload];
    case 'EDIT_ITEM':
      return state.map(item => item.id === action.payload.id ? action.payload : item);
    case 'DELETE_ITEM':
      return state.filter(item => item.id !== action.payload);
    default:
      return state;
  }
};

function App() {
  // Persist items in localStorage
  const [items, dispatch] = useReducer(itemsReducer, [], () => {
    const stored = localStorage.getItem('items');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
  }, [items]);

  // Migrate old items to include createdAt and createdBy
  useEffect(() => {
    const migrated = items.map(item => ({
      ...item,
      createdAt: item.createdAt || new Date().toISOString(),
      createdBy: item.createdBy || 'Unknown',
    }));
    if (JSON.stringify(migrated) !== JSON.stringify(items)) {
      // Update localStorage directly; reload or dispatch if needed
      localStorage.setItem('items', JSON.stringify(migrated));
      // For immediate reflection, dispatch a batch update (optional)
      migrated.forEach(updatedItem => {
        dispatch({ type: 'EDIT_ITEM', payload: updatedItem });
      });
    }
  }, []); // Run once on mount

  // Dark mode persistence
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // {type: 'delete'|'save', payload: id|item}
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');

  // Handle add item
  const handleAdd = (newItem) => {
    setConfirmAction({ type: 'save', payload: { ...newItem, id: Date.now() } });
    setIsConfirmModalOpen(true);
  };

  // Handle edit item
  const handleEdit = (updatedItem) => {
    setConfirmAction({ type: 'save', payload: updatedItem });
    setIsConfirmModalOpen(true);
  };

  // Handle delete
  const handleDelete = (id) => {
    setConfirmAction({ type: 'delete', payload: id });
    setIsConfirmModalOpen(true);
  };

  // Confirm action handler
  const handleConfirm = () => {
    if (confirmAction.type === 'delete') {
      dispatch({ type: 'DELETE_ITEM', payload: confirmAction.payload });
    } else if (confirmAction.type === 'save') {
      if (editingItem) {
        dispatch({ type: 'EDIT_ITEM', payload: confirmAction.payload });
        setIsEditModalOpen(false);
        setEditingItem(null);
      } else {
        dispatch({ type: 'ADD_ITEM', payload: confirmAction.payload });
        setIsAddModalOpen(false);
      }
    }
    setIsConfirmModalOpen(false);
    setConfirmAction(null);
  };

  // Open edit modal
  const openEditModal = (item) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  // Filter items
  const filteredItems = items
    .filter(item => {
      const searchLower = search.toLowerCase();
      return (
        item.name.toLowerCase().includes(searchLower) ||
        (item.quantity && String(item.quantity).includes(searchLower)) ||
        (item.price && String(item.price).includes(searchLower)) ||
        (item.notes && item.notes.toLowerCase().includes(searchLower)) ||
        (item.category && item.category.toLowerCase().includes(searchLower)) ||
        (item.createdBy && item.createdBy.toLowerCase().includes(searchLower)) ||
        Object.values(item.customFields || {}).some(val => String(val).toLowerCase().includes(searchLower))
      );
    });

  // Collect unique custom keys for dynamic columns
  const customKeys = [...new Set(items.flatMap(item => Object.keys(item.customFields || {})))];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        setIsAddModalOpen={setIsAddModalOpen}
      />
      <main className="flex-grow container mx-auto p-4">
        <ItemList
          items={filteredItems}
          customKeys={customKeys}
          onEdit={openEditModal}
          onDelete={handleDelete}
          search={search}
          setSearch={setSearch}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortDir={sortDir}
          setSortDir={setSortDir}
        />
      </main>
      <Footer />

      {/* Modals */}
      {isAddModalOpen && (
        <ItemFormModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAdd}
          title="Add New Item"
        />
      )}
      {isEditModalOpen && (
        <ItemFormModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingItem(null);
          }}
          onSubmit={handleEdit}
          initialData={editingItem}
          title="Edit Item"
        />
      )}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirm}
        message={confirmAction?.type === 'delete' ? 'Are you sure you want to delete this item?' : 'Are you sure you want to save changes?'}
      />
    </div>
  );
}

export default App;