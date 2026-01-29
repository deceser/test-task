import { useState } from 'react';
import { Dropdown } from './Dropdown';
import type { DropdownOption } from './Dropdown.types';
import './App.css';

async function mockAsyncSearch(query: string, options: DropdownOption<string>[]): Promise<DropdownOption<string>[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const normalized = query.trim().toLowerCase();
  if (!normalized) return options;
  return options.filter((opt) => opt.label.toLowerCase().includes(normalized));
}

function App() {
  const [value, setValue] = useState<string | null>('');
  const [value2, setValue2] = useState<string | null>('');

  const baseOptions = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'date', label: 'Date' },
    { value: 'elderberry', label: 'Elderberry' },
    { value: 'fig', label: 'Fig' },
    { value: 'grape', label: 'Grape' },
    { value: 'honeydew', label: 'Honeydew' },
    { value: 'kiwi', label: 'Kiwi' },
    { value: 'lemon', label: 'Lemon' },
    { value: 'lime', label: 'Lime' },
    { value: 'mango', label: 'Mango' },
    { value: 'nectarine', label: 'Nectarine' },
    { value: 'orange', label: 'Orange' },
    { value: 'pear', label: 'Pear' },
    { value: 'pineapple', label: 'Pineapple' },
    { value: 'plum', label: 'Plum' },
    { value: 'raspberry', label: 'Raspberry' },
  ];

  return (
    <div className="app-container">
      <Dropdown
        options={baseOptions}
        value={value}
        onChange={(next) => setValue(next)}
        placeholder="Choose fruit 1"
        searchFn={mockAsyncSearch}
        renderOption={(option, isSelected) => (
          <span style={{ fontWeight: isSelected ? 600 : 400 }}>{option.label}</span>
        )}
        renderValue={(option) => (option ? <span style={{ color: '#4f46e5' }}>{option.label}</span> : 'Choose fruit 1')}
      />

      <Dropdown
        options={baseOptions}
        value={value2}
        onChange={(next) => setValue2(next)}
        placeholder="Choose fruit 2"
        searchFn={mockAsyncSearch}
        renderOption={(option, isSelected) => (
          <span style={{ fontWeight: isSelected ? 600 : 400 }}>{option.label}</span>
        )}
        renderValue={(option) => (option ? <span style={{ color: '#4f46e5' }}>{option.label}</span> : 'Choose fruit 2')}
      />
    </div>
  );
}

export default App;
