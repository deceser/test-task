import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { DropdownProps, DropdownOption } from './Dropdown.types';
import { createDropdownId, subscribeToOpen, notifyOpened } from './dropdownBus';
import { useDropdownSearch } from './useDropDown';
import './Dropdown.css';

export function Dropdown<T = unknown>({
  options,
  value,
  defaultValue = null,
  onChange,
  placeholder = 'Select...',
  disabled = false,
  renderOption,
  renderValue,
  searchable = true,
  searchPlaceholder = 'Search...',
  searchFn,
  debounceMs = 200,
  noResultsText = 'No options',
  className = '',
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<T | null>(defaultValue);

  const idRef = useRef(createDropdownId());
  const rootRef = useRef<HTMLDivElement | null>(null);

  const isControlled = value !== undefined;
  const selectedValue = isControlled ? (value ?? null) : internalValue;

  const { search, displayedOptions, loading, onSearchChange, setSearch } = useDropdownSearch(
    options,
    searchFn,
    debounceMs,
  );

  const selectedOption = useMemo(
    () => (selectedValue == null ? null : (options.find((o) => Object.is(o.value, selectedValue)) ?? null)),
    [options, selectedValue],
  );

  useEffect(() => {
    const unsubscribe = subscribeToOpen((openId) => {
      if (openId !== idRef.current) setIsOpen(false);
    });
    return unsubscribe;
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setSearch('');
  }, [setSearch]);

  const open = useCallback(() => {
    if (disabled) return;
    setIsOpen(true);
    notifyOpened(idRef.current);
  }, [disabled]);

  const toggleOpen = useCallback(() => {
    if (disabled) return;
    setIsOpen((prev) => {
      const next = !prev;
      if (next) notifyOpened(idRef.current);
      if (!next) setSearch('');
      return next;
    });
  }, [disabled, setSearch]);

  const handleBlur: React.FocusEventHandler<HTMLDivElement> = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) close();
  };

  const handleControlClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    toggleOpen();
  };

  const handleOptionClick = (option: DropdownOption<T>) => {
    if (option.disabled) return;
    const valueToSet = option.value;
    if (!isControlled) setInternalValue(valueToSet);
    onChange?.(valueToSet, option);
    close();
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleOpen();
    } else if (event.key === 'Escape') {
      close();
    }
  };

  const rootClassName = ['dropdown', className, disabled ? 'dropdown--disabled' : ''].filter(Boolean).join(' ');

  return (
    <div
      ref={rootRef}
      tabIndex={disabled ? -1 : 0}
      className={rootClassName}
      onBlur={handleBlur}
      onFocus={() => {
        if (!isOpen && !disabled) open();
      }}
      onKeyDown={handleKeyDown}>
      <div
        className={[
          'dropdown__control',
          isOpen ? 'dropdown__control--open' : '',
          disabled ? 'dropdown__control--disabled' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onMouseDown={handleControlClick}>
        {selectedOption ? (
          <div className="dropdown__value">{renderValue ? renderValue(selectedOption) : selectedOption.label}</div>
        ) : (
          <div className="dropdown__placeholder">{placeholder}</div>
        )}
        <span className={['dropdown__arrow', isOpen ? 'dropdown__arrow--open' : ''].filter(Boolean).join(' ')}>▾</span>
      </div>

      {isOpen && (
        <div className="dropdown__menu">
          {searchable && (
            <div className="dropdown__search">
              <input
                className="dropdown__search-input"
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                autoFocus
              />
            </div>
          )}

          {loading && <div className="dropdown__loading">Loading...</div>}

          {!loading && (
            <ul className="dropdown__list">
              {displayedOptions.length === 0 ? (
                <li className="dropdown__empty">{noResultsText}</li>
              ) : (
                displayedOptions.map((option) => {
                  const isSelected = selectedOption != null && Object.is(option.value, selectedOption.value);
                  return (
                    <li
                      key={String(option.value)}
                      className={[
                        'dropdown__option',
                        isSelected ? 'dropdown__option--selected' : '',
                        option.disabled ? 'dropdown__option--disabled' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleOptionClick(option);
                      }}>
                      {renderOption ? renderOption(option, isSelected) : option.label}
                    </li>
                  );
                })
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
