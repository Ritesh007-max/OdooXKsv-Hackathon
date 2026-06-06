import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ActivityContext = createContext();

const STORAGE_KEY = 'vendorBridge_activityLogs';

export function ActivityProvider({ children }) {
  const [activities, setActivities] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage whenever activities change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities.slice(0, 200)));
  }, [activities]);

  const addActivity = useCallback((type, message, status = 'info') => {
    const entry = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type,
      message,
      status,
      timestamp: new Date().toISOString(),
    };
    setActivities(prev => [entry, ...prev]);
  }, []);

  const clearActivities = useCallback(() => {
    setActivities([]);
  }, []);

  return (
    <ActivityContext.Provider value={{ activities, addActivity, clearActivities }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const ctx = useContext(ActivityContext);
  if (!ctx) throw new Error('useActivity must be used within ActivityProvider');
  return ctx;
}
