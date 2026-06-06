import React from 'react';

const RFQForm = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-caption font-sans font-semibold text-gray-700 mb-1">RFQ's title*</label>
        <input 
          type="text" 
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Office Furniture procurement Q2"
          className="w-full bg-white border border-gray-300 rounded-md p-2 text-body font-sans focus:outline-none focus:border-gray-500"
        />
      </div>

      <div>
        <label className="block text-caption font-sans font-semibold text-gray-700 mb-1">Category</label>
        <input 
          type="text" 
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="e.g. Furniture"
          className="w-full bg-white border border-gray-300 rounded-md p-2 text-body font-sans focus:outline-none focus:border-gray-500"
        />
      </div>

      <div>
        <label className="block text-caption font-sans font-semibold text-gray-700 mb-1">Deadline*</label>
        <input 
          type="date" 
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          className="w-full bg-white border border-gray-300 rounded-md p-2 text-body font-sans focus:outline-none focus:border-gray-500"
        />
      </div>

      <div>
        <label className="block text-caption font-sans font-semibold text-gray-700 mb-1">Description</label>
        <textarea 
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="e.g. Ergonomic chairs and standing desks for 3rd floor"
          rows={4}
          className="w-full bg-white border border-gray-300 rounded-md p-2 text-body font-sans focus:outline-none focus:border-gray-500 resize-none"
        />
      </div>
    </div>
  );
};

export default RFQForm;
