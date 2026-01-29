let dropdownIdCounter = 0;

export type OpenListener = (id: number) => void;
const listeners = new Set<OpenListener>();

export const createDropdownId = (): number => ++dropdownIdCounter;

export const subscribeToOpen = (listener: OpenListener): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const notifyOpened = (id: number): void => {
  listeners.forEach((listener) => listener(id));
};
