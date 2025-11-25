// src/App.jsx — cleaned version (removed custom cursor logic)
import React, { useState, useEffect, useRef, useMemo } from 'react';
import Map from './components/Map';
import Drawer from './components/Drawer';
import ThemeToggle from './components/ThemeToggle';
import MTBModal from './components/MTBModal';
import SearchBar from './components/SearchBar';
import { mtbData } from './mockData';
import useOnClickOutside from './hooks/useOnClickOutside';
import { Sparkles } from 'lucide-react';
import './App.css';

function App() {
  const [selectedCityData, setSelectedCityData] = useState(null);
  const [modalMtb, setModalMtb] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [palette, setPalette] = useState(() => localStorage.getItem('palette') || 'purple');
  const [showProvince, setShowProvince] = useState(false);
  const [zoomToCity, setZoomToCity] = useState(null);
  const [isAIPopupOpen, setIsAIPopupOpen] = useState(false);
  const drawerRef = useRef();
  const modalRef = useRef();

  const customerPriority = { '大客户': 1, '重点客户': 2, '潜力客户': 3, '小客户': 4 };

  const allItems = useMemo(() => {
    const cities = Object.keys(mtbData).map(city => ({ type: 'city', name: city }));
    const mtbs = [];

    Object.entries(mtbData).forEach(([city, list]) => {
      list.forEach(mtb => {
        mtbs.push({ type: 'mtb', name: mtb.name, city, data: mtb });
      });
    });

    cities.sort((a, b) => a.name.localeCompare(b.name));
    mtbs.sort((a, b) => {
      const priA = customerPriority[a.data.positioning] || 5;
      const priB = customerPriority[b.data.positioning] || 5;
      if (priA !== priB) return priA - priB;
      return a.name.localeCompare(b.name);
    });

    return [...cities, ...mtbs];
  }, []);

  const handleCityClick = (cityProperties) => {
    const cityName = cityProperties.name;
    const dataForCity = mtbData[cityName];
    setSelectedCityData({ cityName, mtbList: dataForCity || [] });
  };

  const handleSearchSelect = (item) => {
    if (item.type === 'city') {
      setZoomToCity(item.name);
      const dataForCity = mtbData[item.name];
      setSelectedCityData({ cityName: item.name, mtbList: dataForCity || [] });
    } else {
      setModalMtb(item.data);
    }
  };

  useOnClickOutside(drawerRef, () => setSelectedCityData(null), [modalRef]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-palette', palette);
    localStorage.setItem('palette', palette);
  }, [palette]);

  // ⚠️ Custom cursor logic removed entirely

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const togglePalette = () => {
    const order = ['red', 'blue', 'purple', 'ink'];
    setPalette(order[(order.indexOf(palette) + 1) % order.length]);
  };

  const toggleShowProvince = () => setShowProvince(prev => !prev);

  const { totalThisYearOrders, totalThisQuarterOrders } = useMemo(() => {
    let totalYear = 0, totalQuarter = 0;
    Object.values(mtbData).forEach(cityList => {
      cityList.forEach(mtb => {
        totalYear += mtb.thisYearOrders;
        totalQuarter += mtb.thisQuarterOrders;
      });
    });
    return { totalThisYearOrders: totalYear, totalThisQuarterOrders: totalQuarter };
  }, []);

  return (
    <div className="app-container">
      <div className="left-bottom-stats">
        {['今年总订单', '本季度总订单'].map((label, idx) => {
          const value = idx === 0 ? totalThisYearOrders : totalThisQuarterOrders;
          return (
            <div key={label} className="stat-card">
              <div className="stat-label">{label}</div>
              <div className="stat-value">{value.toLocaleString()}</div>
            </div>
          );
        })}
      </div>

      <ThemeToggle
        theme={theme}
        palette={palette}
        toggleTheme={toggleTheme}
        togglePalette={togglePalette}
        showProvince={showProvince}
        toggleShowProvince={toggleShowProvince}
        onAIBtnClick={() => setIsAIPopupOpen(true)}
      />

      <SearchBar allItems={allItems} onSelect={handleSearchSelect} />

      <Map
        onCityClick={handleCityClick}
        theme={theme}
        palette={palette}
        mtbData={mtbData}
        showProvince={showProvince}
        zoomToCity={zoomToCity}
      />

      <Drawer
        ref={drawerRef}
        cityData={selectedCityData}
        onClose={() => setSelectedCityData(null)}
        onMtbClick={setModalMtb}
      />

      <MTBModal
        ref={modalRef}
        mtb={modalMtb}
        onClose={() => setModalMtb(null)}
      />

      {isAIPopupOpen && (
        <div
          className="popup-overlay"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => setIsAIPopupOpen(false)}
        >
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <Sparkles className="popup-icon" size={20} />
            <p className="popup-text">点击该按钮可通过AI问答快速获取所需信息，并进行互动。</p>
          </div>
        </div>
      )}

      <div className="bottom-left-text">
        <em>注：数据均为随机生成，如有雷同，敬请谅解。</em>
      </div>
    </div>
  );
}

export default App;