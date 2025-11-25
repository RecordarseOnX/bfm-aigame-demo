// src/components/Drawer.jsx
import React, { useState, useEffect, useMemo, forwardRef, useRef } from 'react';
import { ChevronLeft, ChevronRight, Upload, Sparkles } from 'lucide-react';
import MtbLogo from './MtbLogo';
import { customerTypeToClass } from '../utils/customerUtils';
import './Drawer.css';

const ITEMS_PER_PAGE = 10;
const FILTERS = ["大客户", "重点客户", "潜力客户", "小客户"];

// --- 新的标签数据结构 ---
const UPLOAD_TAG_CATEGORIES = [
  {
    id: 'positioning',
    title: '客户定位',
    tags: ['大客户', '重点客户', '潜力客户', '小客户'],
  },
  {
    id: 'endUser',
    title: 'EU',
    tags: ['新能源汽车', '3C','半导体',  '医疗器械','工业控制', '通信设备', '数据中心'],
  },
];


const Drawer = forwardRef(({ cityData, onClose, onMtbClick }, ref) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  // 使用对象管理多个标签组的选择
  const [selectedTags, setSelectedTags] = useState({
    positioning: null,
    endUser: null, // 清理：移除了不再使用的 industry
  });
  const fileInputRef = useRef(null);

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
    setIsPopupOpen(false);
    setCurrentPage(1);
    setActiveFilter(null);
    // 重置标签选择
    setSelectedTags({ positioning: null, endUser: null }); // 清理：同步重置状态
  }, [cityData]);

  // --- 标签点击处理函数 ---
  const handleTagClick = (categoryId, tag) => {
    setSelectedTags(prev => ({
      ...prev,
      [categoryId]: prev[categoryId] === tag ? null : tag,
    }));
  };

  const handleReportButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(`已选择文件: ${file.name}`);
      console.log('选择的客户标签:', selectedTags);
      // 在这里可以添加实际的文件上传逻辑
      setIsPopupOpen(false); // 选择后关闭弹窗
    }
  };

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
            <Upload size={16} /> 上传客户报告
          </button>
        </div>
      </div>

      {isPopupOpen && (
        <div 
          className="popup-overlay" 
          // 关键修复 (1/2): 在 mousedown 阶段就阻止事件，确保在 useOnClickOutside 钩子之前生效
          onMouseDown={(e) => e.stopPropagation()} 
          onClick={() => setIsPopupOpen(false)}
        >
          {/* 
            关键修复 (2/2): 为保险起见，保留这里的 stopPropagation, 
            防止点击内容区时意外触发父元素的 onClick
          */}
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <Sparkles className="popup-icon" size={22} />
              <p>为新客户选择相关标签，AI 将为您智能归档。</p>
            </div>

            <div className="popup-body">
              {UPLOAD_TAG_CATEGORIES.map(category => (
                <div key={category.id} className="tag-group">
                  <h5>{category.title}</h5>
                  <div className="tags-wrapper">
                    {category.tags.map(tag => (
                      <button
                        key={tag}
                        className={`popup-tag ${selectedTags[category.id] === tag ? 'active' : ''}`}
                        onClick={() => handleTagClick(category.id, tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="popup-footer">
              <button className="select-report-button" onClick={handleReportButtonClick}>
                <Upload size={16} /> 选择报告
              </button>
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt,.md"
            />
          </div>
        </div>
      )}
    </>
  );
});

export default Drawer;