import { useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch { return initialValue; }
  });
  const setValue = (value: T | ((prev: T) => T)) => {
    const newValue = value instanceof Function ? value(stored) : value;
    setStored(newValue);
    window.localStorage.setItem(key, JSON.stringify(newValue));
  };
  return [stored, setValue];
}
