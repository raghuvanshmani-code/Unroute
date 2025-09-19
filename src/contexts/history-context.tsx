'use client';

import type { UrgeType } from '@/lib/constants';
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface HistoryEntry {
  urgeType: UrgeType | 'other';
  intensity: number;
  outcome: 'resisted' | 'acted';
  date: Date;
}

interface HistoryContextType {
  history: HistoryEntry[];
  addHistoryEntry: (entry: Omit<HistoryEntry, 'id'>) => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(
  undefined
);

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const addHistoryEntry = (entry: Omit<HistoryEntry, 'id'>) => {
    setHistory(prevHistory => [entry, ...prevHistory]);
  };

  const value = { history, addHistoryEntry };

  return (
    <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}
