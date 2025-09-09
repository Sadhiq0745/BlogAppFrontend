import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Input from '../ui/Input';
import { debounce } from '../../utils/helpers';

const SearchBar = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  disabled = false,
  debounceTime = 300
}) => {
  const [inputValue, setInputValue] = useState(value);

  // Update internal state when external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Debounced change handler
  const debouncedOnChange = debounce((newValue) => {
    onChange(newValue);
  }, debounceTime);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    debouncedOnChange(newValue);
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        disabled={disabled}
        className="pl-10" // Add padding for the icon
      />
      <Search className="absolute left-3 w-5 h-5 text-gray-400" />
    </div>
  );
};

export default SearchBar;
