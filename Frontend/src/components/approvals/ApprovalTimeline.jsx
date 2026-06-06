import React from 'react';

const ApprovalTimeline = ({ events }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mt-6">
      <div className="px-5 py-4 border-b border-gray-200">
        <h3 className="text-body-large font-sans font-bold text-gray-900">Activity Timeline</h3>
      </div>
      <div className="p-5 space-y-4">
        {events.map((event, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white ring-2 ring-blue-100 z-10" />
              {index < events.length - 1 && <div className="w-[2px] h-full bg-gray-200 mt-1 -mb-4" />}
            </div>
            <div className="flex-1 pb-4">
              <p className="text-body font-sans text-gray-900 font-medium">{event.event}</p>
              <p className="text-caption font-sans text-gray-500 mt-0.5">{event.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApprovalTimeline;
