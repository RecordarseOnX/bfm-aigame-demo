import React, { useState, useRef, useEffect } from 'react';
import useOnClickOutside from '../hooks/useOnClickOutside';
import { customerTypeToClass } from '../utils/customerUtils';
import './SearchBar.css';

function SearchBar({ allItems, onSelect, theme }) {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const ref = useRef();
  const resultsRef = useRef();

  useOnClickOutside(ref, () => setShowResults(false));

  const filteredItems = query
    ? allItems.filter(item => item.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      onSelect(filteredItems[selectedIndex]);
      setQuery('');
      setShowResults(false);
      setSelectedIndex(-1);
    }
  };

  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedLi = resultsRef.current.querySelector(`li:nth-child(${selectedIndex + 1})`);
      if (selectedLi) selectedLi.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedIndex]);

  return (
    <div className="search-container" ref={ref} data-theme={theme}>
      <input
        type="text"
        placeholder="搜索城市或MTB"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowResults(!!e.target.value);
          setSelectedIndex(-1);
        }}
        onFocus={() => query && setShowResults(true)}
        onKeyDown={handleKeyDown}
      />
      {showResults && filteredItems.length > 0 && (
        <ul className="search-results" ref={resultsRef}>
          {filteredItems.map((item, index) => (
            <li
              key={`${item.type}-${item.name}-${item.city || ''}`}
              className={`${index === selectedIndex ? 'selected' : ''} ${
                item.type === 'city'
                  ? 'city-item'
                  : `mtb-item mtb-item-bg-${customerTypeToClass(item.data?.positioning || '')}`
              }`}
              onClick={() => {
                onSelect(item);
                setQuery('');
                setShowResults(false);
              }}
            >
              <div className="search-item-content">
                <span className="item-name">{item.name}</span>
                {item.type === 'mtb' && <span className="item-city">{item.city}</span>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
