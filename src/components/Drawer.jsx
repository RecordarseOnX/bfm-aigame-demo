// src/components/Drawer.jsx
import React, { useState, useEffect, useMemo, forwardRef } from 'react';
import { ChevronLeft, ChevronRight, Upload, Sparkles } from 'lucide-react'; 
import MtbLogo from './MtbLogo';
import { customerTypeToClass } from '../utils/customerUtils';
import './Drawer.css';

const ITEMS_PER_PAGE = 10;
const FILTERS = ["大客户", "重点客户", "潜力客户", "小客户"];

const Drawer = forwardRef(({ cityData, onClose, onMtbClick }, ref) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const mtbList = cityData?.mtbList ?? [];

  const filteredMtbs = useMemo(() => {
    if (!activeFilter) return mtbList;
    return mtbList.filter(mtb => mtb.positioning === activeFilter);
  }, [mtbList, activeFilter]);

  const totalPages = filteredMtbs.length > 0 ? Math.ceil(filteredMtbs.length / ITEMS_PER_PAGE) : 1;

  const paginatedMtbs = filteredMtbs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    // 当 cityData 改变时，重置所有相关状态
    setIsPopupOpen(false); 
    setCurrentPage(1);
    setActiveFilter(null);
  }, [cityData]);

  if (!cityData) return null;

  const { cityName } = cityData;

  return (
    <>
      <div className="drawer-content" ref={ref}>
        <div className="drawer-header">
          <div className="header-row-1">
            <h3>{cityName}</h3>
            <span className="mtb-count">{mtbList.length} 家公司</span>
          </div>
          <div className="header-row-2">
            {FILTERS.map(filter => (
              <button 
                key={filter} 
                className={`filter-btn ${customerTypeToClass(filter)} ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => {
                  setCurrentPage(1);
                  setActiveFilter(prev => (prev === filter ? null : filter));
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mtb-list">
          {paginatedMtbs.map((mtb) => (
            <div 
              key={mtb.id} 
              className={`mtb-item mtb-item-bg-${customerTypeToClass(mtb.positioning)}`} 
              onClick={() => onMtbClick(mtb)}
            >
              <MtbLogo letters={mtb.letters} color={mtb.logoColor} size={36} />
              <span className="mtb-name" title={mtb.name}>{mtb.name}</span>
            </div>
          ))}
        </div>

        <div className="drawer-footer">
          <div className="pagination">
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
              <ChevronLeft size={18} />
            </button>
            <span>第 {currentPage} / {totalPages} 页</span>
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
              <ChevronRight size={18} />
            </button>
          </div>

          <button className="upload-button" onClick={() => setIsPopupOpen(true)}>
            <Upload size={16} /> 上传客户文档
          </button>
        </div>
      </div>

      {isPopupOpen && (
        // FINAL FIX: 使用 onMouseDown 来阻止事件传播，确保在 useOnClickOutside 钩子之前生效
        <div 
          className="popup-overlay" 
          onMouseDown={(e) => e.stopPropagation()} // 关键修复！在 mousedown 阶段就阻止事件
          onClick={() => setIsPopupOpen(false)}   // onClick 依然负责关闭弹窗
        >
          {/* 
            为保险起见，保留这里的 stopPropagation，防止点击内容区关闭弹窗
            虽然父元素的 onClick 逻辑现在不依赖冒泡，但这样做更稳健
          */}
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <Sparkles className="popup-icon" size={20} />
            <p className="popup-text">
              选择一份文档，AI 将自动为您解析并填充客户信息。
            </p>
          </div>
        </div>
      )}
    </>
  );
});

export default Drawer;