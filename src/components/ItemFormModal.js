import React, { useState, useEffect, useRef } from 'react';

const ItemFormModal = ({ isOpen, onClose, onSubmit, initialData = {}, title }) => {
  const [name, setName] = useState(initialData.name || '');
  const [hasQuantity, setHasQuantity] = useState(!!initialData.quantity);
  const [quantity, setQuantity] = useState(initialData.quantity || '');
  const [hasPrice, setHasPrice] = useState(!!initialData.price);
  const [price, setPrice] = useState(initialData.price || '');
  const [hasNotes, setHasNotes] = useState(!!initialData.notes);
  const [notes, setNotes] = useState(initialData.notes || '');
  const [hasCategory, setHasCategory] = useState(!!initialData.category);
  const [category, setCategory] = useState(initialData.category || '');
  const [addedBy, setAddedBy] = useState(initialData.addedBy || '');
  const [date, setDate] = useState(initialData.date || new Date().toISOString().split('T')[0]);
  const [customFields, setCustomFields] = useState(initialData.customFields || {});
  const [newCustomKey, setNewCustomKey] = useState('');
  const [newCustomValue, setNewCustomValue] = useState('');
  const [errors, setErrors] = useState({});

  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (hasQuantity && (isNaN(quantity) || quantity <= 0)) newErrors.quantity = 'Quantity must be positive number';
    if (hasPrice && (isNaN(price) || price <= 0)) newErrors.price = 'Price must be positive number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const item = {
      id: initialData.id,
      name: name.trim(),
      date: date,
      ...(addedBy && { addedBy: addedBy.trim() }),
      ...(hasQuantity && { quantity: Number(quantity) }),
      ...(hasPrice && { price: Number(price) }),
      ...(hasQuantity && hasPrice && { total: Number(quantity) * Number(price) }),
      ...(hasNotes && { notes: notes.trim() }),
      ...(hasCategory && { category: category.trim() }),
      customFields,
    };
    onSubmit(item);
  };

  const addCustomField = () => {
    if (newCustomKey.trim() && newCustomValue.trim()) {
      setCustomFields({ ...customFields, [newCustomKey.trim()]: newCustomValue.trim() });
      setNewCustomKey('');
      setNewCustomValue('');
    }
  };

  const removeCustomField = (key) => {
    const { [key]: _, ...rest } = customFields;
    setCustomFields(rest);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100"
        onClick={e => e.stopPropagation()}
        tabIndex={-1}
        aria-modal="true"
        role="dialog"
        aria-labelledby="modal-title"
      >
        <h2 id="modal-title" className="text-lg font-bold mb-4">{title}</h2>
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label className="block mb-1">Name *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700"
              aria-required="true"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* Added By */}
          <div className="mb-4">
            <label className="block mb-1">Added By</label>
            <input
              type="text"
              value={addedBy}
              onChange={e => setAddedBy(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700"
            />
          </div>

          {/* Toggles and Fields */}
          <div className="mb-4">
            <label className="flex items-center">
              <input type="checkbox" checked={hasQuantity} onChange={e => setHasQuantity(e.target.checked)} className="mr-2" />
              Include Quantity
            </label>
            {hasQuantity && (
              <input
                type="number"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 mt-2 bg-white dark:bg-gray-700"
                min="1"
              />
            )}
            {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input type="checkbox" checked={hasPrice} onChange={e => setHasPrice(e.target.checked)} className="mr-2" />
              Include Price
            </label>
            {hasPrice && (
              <input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 mt-2 bg-white dark:bg-gray-700"
                min="0.01"
                step="0.01"
              />
            )}
            {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
          </div>

          {hasQuantity && hasPrice && (
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">Total will be auto-calculated as Quantity × Price.</p>
          )}

          <div className="mb-4">
            <label className="flex items-center">
              <input type="checkbox" checked={hasNotes} onChange={e => setHasNotes(e.target.checked)} className="mr-2" />
              Include Notes
            </label>
            {hasNotes && (
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 mt-2 bg-white dark:bg-gray-700"
              />
            )}
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input type="checkbox" checked={hasCategory} onChange={e => setHasCategory(e.target.checked)} className="mr-2" />
              Include Category
            </label>
            {hasCategory && (
              <input
                type="text"
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 mt-2 bg-white dark:bg-gray-700"
              />
            )}
          </div>

          {/* Custom Fields */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Custom Fields</h3>
            {Object.entries(customFields).map(([key, value]) => (
              <div key={key} className="flex items-center mb-2">
                <span className="flex-grow">{key}: {value}</span>
                <button type="button" onClick={() => removeCustomField(key)} className="text-red-500 hover:text-red-700 ml-2">
                  Remove
                </button>
              </div>
            ))}
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Key"
                value={newCustomKey}
                onChange={e => setNewCustomKey(e.target.value)}
                className="flex-grow border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700"
              />
              <input
                type="text"
                placeholder="Value"
                value={newCustomValue}
                onChange={e => setNewCustomValue(e.target.value)}
                className="flex-grow border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700"
              />
              <button type="button" onClick={addCustomField} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition">
                Add
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemFormModal;