import React from 'react';
import StatusBadge from '../ui/StatusBadge';

const ApprovalChain = ({ reviewers }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200">
        <h3 className="text-body-large font-sans font-bold text-gray-900">Approval Chain</h3>
      </div>
      <div className="p-5 space-y-3">
        {reviewers.map((reviewer) => (
          <div key={reviewer.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-sans text-gray-600 font-bold">
                {reviewer.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="text-body font-sans font-semibold text-gray-900">{reviewer.name}</p>
                <p className="text-caption font-sans text-gray-500">{reviewer.role}</p>
              </div>
            </div>
            <StatusBadge status={reviewer.status} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApprovalChain;
