// src/App.jsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import Map from './components/Map';
import Drawer from './components/Drawer';
import ThemeToggle from './components/ThemeToggle';
import MTBModal from './components/MTBModal';
import SearchBar from './components/SearchBar';
import { mtbData } from './mockData';
import useOnClickOutside from './hooks/useOnClickOutside';
// 1. 引入 Sparkles 图标用于 AI 弹窗
import { Sparkles } from 'lucide-react';
import './App.css';

function App() {
  const [selectedCityData, setSelectedCityData] = useState(null);
  const [modalMtb, setModalMtb] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [palette, setPalette] = useState(() => localStorage.getItem('palette') || 'purple');
  const [showProvince, setShowProvince] = useState(true);
  const [zoomToCity, setZoomToCity] = useState(null);
  // 2. 新增 state 用于控制 AI 弹窗
  const [isAIPopupOpen, setIsAIPopupOpen] = useState(false);
  const drawerRef = useRef();
  const modalRef = useRef();

  // ... (其余代码，如 customerPriority, allItems, handleCityClick, handleSearchSelect 等保持不变)
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
      if (priA !== priB) { return priA - priB; }
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
    localStorage.setItem('palette', palette);
  }, [palette]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  const togglePalette = () => {
    const order = ['red', 'blue', 'purple'];
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
          const gradientMap = {
            red: 'linear-gradient(135deg, #ff7e5f, #feb47b)',
            blue: 'linear-gradient(135deg, #36d1dc, #5b86e5)',
            purple: 'linear-gradient(135deg, #4e54c8, #8f94fb)',
          };
          return (
            <div key={label} className="stat-card" style={{ background: gradientMap[palette] }}>
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
        // 3. 传递打开 AI 弹窗的函数
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
        onMtbClick={(mtb) => setModalMtb(mtb)}
      />

      <MTBModal
        ref={modalRef}
        mtb={modalMtb}
        onClose={() => setModalMtb(null)}
      />

      {/* 4. 在这里渲染新的 AI 弹窗 */}
      {isAIPopupOpen && (
        <div 
          className="popup-overlay" 
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => setIsAIPopupOpen(false)}
        >
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <Sparkles className="popup-icon" size={20} />
            <p className="popup-text">
              点击该按钮即可总结全国各市以及总体的商业分析。
            </p>
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