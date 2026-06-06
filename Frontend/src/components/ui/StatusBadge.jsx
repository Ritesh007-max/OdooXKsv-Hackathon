import React from 'react';

const StatusBadge = ({ status, className = '' }) => {
  const getBadgeClass = (statusString) => {
    switch (statusString.toLowerCase()) {
      case 'approved':
      case 'active':
        return 'dd-chip-status-debug glow-cyan text-green-700 bg-green-50 border-green-200'; // Or use default from index.css if defined
      case 'pending':
      case 'submitted':
      case 'pending_approval':
        return 'dd-chip-status-warning glow-amber';
      case 'rejected':
      case 'blocked':
        return 'dd-chip-status-critical glow-red';
      case 'draft':
      case 'closed':
      default:
        return 'dd-chip-status-info';
    }
  };

  const getDotColor = (statusString) => {
    switch (statusString.toLowerCase()) {
      case 'approved':
      case 'active':
        return 'bg-green-500';
      case 'pending':
      case 'submitted':
      case 'pending_approval':
        return 'bg-amber-500';
      case 'rejected':
      case 'blocked':
        return 'bg-red-500';
      case 'draft':
      case 'closed':
      default:
        return 'bg-gray-400';
    }
  };

  const displayStatus = status.replace('_', ' ').toUpperCase();

  return (
    <div className={`dd-chip-status ${getBadgeClass(status)} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${getDotColor(status)}`}></span>
      <span>{displayStatus}</span>
    </div>
  );
};

export default StatusBadge;
