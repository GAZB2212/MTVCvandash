import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface KeyboardState {
  isOpen: boolean;
  activeId: string | null;
  value: string;
  openKeyboard: (id: string, initial: string, onChange: (v: string) => void, onDone?: () => void) => void;
  closeKeyboard: () => void;
  pushKey: (key: string) => void;
  backspace: () => void;
}

const Ctx = createContext<KeyboardState>({
  isOpen: false, activeId: null, value: '',
  openKeyboard: () => {}, closeKeyboard: () => {}, pushKey: () => {}, backspace: () => {},
});

export function KeyboardProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen]     = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [value, setValue]       = useState('');
  const [cb, setCb]             = useState<{ onChange: (v: string) => void; onDone?: () => void } | null>(null);

  const openKeyboard = useCallback((id: string, initial: string, onChange: (v: string) => void, onDone?: () => void) => {
    setActiveId(id);
    setValue(initial);
    setCb({ onChange, onDone });
    setIsOpen(true);
  }, []);

  const closeKeyboard = useCallback(() => {
    setIsOpen(false);
    setActiveId(null);
    setCb(null);
  }, []);

  const pushKey = useCallback((key: string) => {
    setValue(prev => {
      const next = prev + key;
      cb?.onChange(next);
      return next;
    });
  }, [cb]);

  const backspace = useCallback(() => {
    setValue(prev => {
      const next = prev.slice(0, -1);
      cb?.onChange(next);
      return next;
    });
  }, [cb]);

  return (
    <Ctx.Provider value={{ isOpen, activeId, value, openKeyboard, closeKeyboard, pushKey, backspace }}>
      {children}
    </Ctx.Provider>
  );
}

export const useKeyboard = () => useContext(Ctx);
