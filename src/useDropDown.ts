import { useCallback, useEffect, useRef, useState } from 'react';
import { type DropdownOption } from './Dropdown.types';

export function useDropdownSearch<T>(
  options: DropdownOption<T>[],
  searchFn?: (q: string, o: DropdownOption<T>[]) => DropdownOption<T>[] | Promise<DropdownOption<T>[]>,
  debounceMs = 200,
) {
  const [search, setSearch] = useState('');
  const [displayedOptions, setDisplayedOptions] = useState(options);
  const [loading, setLoading] = useState(false);

  const timeoutRef = useRef<number | null>(null);
  const searchIdRef = useRef(0);

  useEffect(() => setDisplayedOptions(options), [options]);

  const performSearch = useCallback(
    (query: string) => {
      if (!searchFn) {
        const q = query.trim().toLowerCase();
        setDisplayedOptions(q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options);
        setLoading(false);
        return;
      }

      const id = ++searchIdRef.current;
      const result = searchFn(query, options);

      if (result instanceof Promise) {
        setLoading(true);
        result
          .finally(() => {
            if (id === searchIdRef.current) setLoading(false);
          })
          .then((r) => {
            if (id === searchIdRef.current) setDisplayedOptions(r);
          });
      } else {
        setDisplayedOptions(result);
      }
    },
    [options, searchFn],
  );

  const onSearchChange = (value: string) => {
    setSearch(value);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (!value) {
      setDisplayedOptions(options);
      setLoading(false);
      return;
    }

    timeoutRef.current = window.setTimeout(() => performSearch(value), debounceMs);
  };

  return { search, displayedOptions, loading, onSearchChange, setSearch };
}
