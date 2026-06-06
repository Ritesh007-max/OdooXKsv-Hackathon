import React, { useRef } from 'react';

const RFQAttachments = ({ attachments, setAttachments }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB'
      }));
      setAttachments([...attachments, ...newFiles]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).map(file => ({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB'
      }));
      setAttachments([...attachments, ...newFiles]);
    }
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="block text-caption font-sans font-semibold text-gray-700">Attachments</label>
      
      <div 
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-400 rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <span className="text-body font-sans text-gray-500">Drag & drop files or click to upload</span>
        <input 
          type="file" 
          multiple 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
        />
      </div>

      {attachments.length > 0 && (
        <div className="flex flex-col gap-2 mt-2">
          {attachments.map((file, idx) => (
            <div key={idx} className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
              <span className="text-caption font-sans text-gray-700 truncate max-w-[80%]">{file.name} ({file.size})</span>
              <button onClick={() => removeAttachment(idx)} className="text-gray-400 hover:text-red-500 font-bold px-2">×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RFQAttachments;
