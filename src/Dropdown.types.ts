import type { ReactNode } from 'react';

export interface DropdownOption<T = unknown> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface DropdownProps<T = unknown> {
  options: DropdownOption<T>[];
  value?: T | null;
  defaultValue?: T | null;
  onChange?: (value: T | null, option: DropdownOption<T> | null) => void;
  placeholder?: string;
  disabled?: boolean;

  renderOption?: (option: DropdownOption<T>, isSelected: boolean) => ReactNode;
  renderValue?: (option: DropdownOption<T> | null) => ReactNode;

  searchable?: boolean;
  searchPlaceholder?: string;
  searchFn?: (query: string, options: DropdownOption<T>[]) => DropdownOption<T>[] | Promise<DropdownOption<T>[]>;
  debounceMs?: number;
  noResultsText?: string;

  className?: string;
}
