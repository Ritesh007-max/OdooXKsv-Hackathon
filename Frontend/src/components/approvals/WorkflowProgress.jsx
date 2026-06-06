import React from 'react';

const WorkflowProgress = ({ currentStage }) => {
  const stages = ['Submitted', 'Review', 'Approved', 'Generate PO'];

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-6">
      <div className="px-5 py-4 border-b border-gray-200">
        <h3 className="text-body-large font-sans font-bold text-gray-900">Workflow Progress</h3>
      </div>
      <div className="p-8">
        <div className="flex items-center justify-between relative max-w-3xl mx-auto">
          <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -z-10 -translate-y-1/2 rounded-full"></div>
          <div 
            className="absolute left-0 top-1/2 h-1 bg-green-500 -z-10 -translate-y-1/2 transition-all duration-500 ease-in-out rounded-full" 
            style={{ width: `${(currentStage / (stages.length - 1)) * 100}%` }}
          ></div>
          
          {stages.map((stage, index) => {
            const isCompleted = index <= currentStage;
            const isActive = index === currentStage;
            
            return (
              <div key={stage} className="flex flex-col items-center gap-2 bg-white px-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-sans font-bold transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-green-500 text-white' 
                    : 'bg-white border-2 border-gray-300 text-gray-500'
                } ${isActive ? 'ring-4 ring-green-100' : ''}`}>
                  {isCompleted ? '✓' : index + 1}
                </div>
                <span className={`text-caption font-sans ${isActive ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>
                  {stage}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WorkflowProgress;
