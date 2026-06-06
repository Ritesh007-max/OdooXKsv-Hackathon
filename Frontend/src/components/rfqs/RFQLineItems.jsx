import React from 'react';
import Button from '../ui/Button';

const RFQLineItems = ({ items, setItems }) => {
  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), item: '', qty: '', unit: '' }]);
  };

  const handleUpdateItem = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="block text-caption font-sans font-semibold text-gray-700">Line items</label>
      
      <div className="bg-white border border-gray-300 rounded-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-2 text-caption font-sans font-semibold text-gray-500 w-1/2">item</th>
              <th className="px-4 py-2 text-caption font-sans font-semibold text-gray-500 w-1/4">qty</th>
              <th className="px-4 py-2 text-caption font-sans font-semibold text-gray-500 w-1/4">Unit</th>
              <th className="px-2 py-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.id} className={idx < items.length - 1 ? "border-b border-gray-100" : ""}>
                <td className="p-2">
                  <input 
                    type="text" 
                    value={item.item} 
                    onChange={e => handleUpdateItem(item.id, 'item', e.target.value)}
                    placeholder="e.g. Ergonomic chair"
                    className="w-full bg-transparent border-none focus:outline-none text-body font-sans text-gray-900 placeholder-gray-400"
                  />
                </td>
                <td className="p-2">
                  <input 
                    type="number" 
                    value={item.qty} 
                    onChange={e => handleUpdateItem(item.id, 'qty', e.target.value)}
                    placeholder="25"
                    className="w-full bg-transparent border-none focus:outline-none text-body font-mono text-gray-900 placeholder-gray-400"
                  />
                </td>
                <td className="p-2">
                  <input 
                    type="text" 
                    value={item.unit} 
                    onChange={e => handleUpdateItem(item.id, 'unit', e.target.value)}
                    placeholder="NOS"
                    className="w-full bg-transparent border-none focus:outline-none text-body font-sans text-gray-900 placeholder-gray-400 uppercase"
                  />
                </td>
                <td className="p-2 text-center">
                  <button onClick={() => handleRemoveItem(item.id)} className="text-gray-400 hover:text-red-500 font-bold">×</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-caption text-gray-500 font-sans">No items added.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div>
        <Button variant="secondary" size="small" onClick={handleAddItem} className="border-gray-300">
          + add line item
        </Button>
      </div>
    </div>
  );
};

export default RFQLineItems;
