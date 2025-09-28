// src/components/MTBModal.jsx
import React, { useState, forwardRef } from 'react';
// 1. 从 lucide-react 导入 Sparkles 图标
import { X, Cpu, BarChart2, Sparkles } from 'lucide-react';
import './MTBModal.css';

const formatValue = (value) => (value === null || value === undefined ? '-' : value);

const calculateGrowth = (current, previous) => {
  if (current === null || current === undefined || previous === null || previous === undefined || previous === 0) {
    return { text: '-', color: 'default' };
  }
  const percentage = Math.round((current / previous) * 100);
  return { text: `${percentage}%`, color: percentage >= 100 ? 'green' : 'orange' };
};

const calculateShare = (orders, total) => {
  if (orders === null || orders === undefined || total === null || total === undefined || total === 0) return '-';
  return `${Math.round((orders / total) * 100)}%`;
};

const MTBModal = forwardRef(({ mtb, onClose }, ref) => {
  // 2. 为两个新弹窗添加 state
  const [isHistoryPopupOpen, setIsHistoryPopupOpen] = useState(false);
  const [isAIPopupOpen, setIsAIPopupOpen] = useState(false);

  if (!mtb) return null;

  const yoyGrowth = calculateGrowth(mtb.thisYearOrders, mtb.lastYearOrders);
  const qoqGrowth = calculateGrowth(mtb.thisQuarterOrders, mtb.lastQuarterOrders);
  const fanucShare = calculateShare(mtb.lastYearOrders, mtb.lastYearDemand);

  // 3. 将 JSX 包裹在 React Fragment 中
  return (
    <>
      <div className="modal-overlay" ref={ref} onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close-button" onClick={onClose}><X size={24} /></button>
          <h3>{mtb.name}</h3>
          <div className="modal-grid">
            <div className="grid-item"><span>客户定位</span><strong>{formatValue(mtb.positioning)}</strong></div>
            <div className="grid-item"><span>上年系统需求总量</span><strong>{formatValue(mtb.lastYearDemand)}</strong></div>
            <div className="grid-item"><span>FANUC 占比 (上年)</span><strong>{fanucShare}</strong></div>
            <div className="grid-item"><span>本年/上年 订单量</span>
              <div className="growth-details">
                <strong className={`growth-${yoyGrowth.color}`}>{yoyGrowth.text}</strong>
                <span className="growth-numbers">({formatValue(mtb.thisYearOrders)}/{formatValue(mtb.lastYearOrders)})</span>
              </div>
            </div>
            <div className="grid-item"><span>本季/上季 订单量</span>
              <div className="growth-details">
                <strong className={`growth-${qoqGrowth.color}`}>{qoqGrowth.text}</strong>
                <span className="growth-numbers">({formatValue(mtb.thisQuarterOrders)}/{formatValue(mtb.lastQuarterOrders)})</span>
              </div>
            </div>
          </div>

          <div className="modal-section">
            <h4>补充信息</h4>
            <p className="supplementary-info">{formatValue(mtb.supplementaryInfo)}</p>
          </div>

          <div className="modal-section">
            <h4>主要竞品</h4>
            <div className="tags-container">
              {mtb.competitorsList && mtb.competitorsList.length > 0
                ? mtb.competitorsList.map(c => <span key={c} className="tag competitor-tag">{c}</span>)
                : '-'}
            </div>
          </div>

          <div className="modal-section"><h4>主营机床类型</h4>
            <div className="tags-container">{mtb.machineTypes.length > 0 ? mtb.machineTypes.map(type => <span key={type} className="tag">{type}</span>) : '-'}</div>
          </div>

          <div className="modal-section"><h4>主要终端用户</h4>
            <div className="tags-container">{mtb.endUsers.length > 0 ? mtb.endUsers.map(user => (<span key={user.name} className="tag user-tag">{user.name} <span className="user-tag-label">#{user.tag}</span></span>)) : '-'}</div>
          </div>

          <div className="modal-actions">
            {/* 4. 为按钮添加 onClick 事件 */}
            <button className="secondary-action-button" onClick={() => setIsHistoryPopupOpen(true)}>
              <BarChart2 size={18} />
              历史来往分析
            </button>
            <button className="ai-button" onClick={() => setIsAIPopupOpen(true)}>
              <Cpu size={18} />
              AI 解析客户
            </button>
          </div>
        </div>
      </div>

      {/* 5. 添加两个弹窗的 JSX 结构 */}
      {isHistoryPopupOpen && (
        <div 
          className="popup-overlay"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => setIsHistoryPopupOpen(false)}
        >
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <BarChart2 className="popup-icon" size={20} />
            <p className="popup-text">
              点击该按钮即可查看与该客户的历史往来总结。
            </p>
          </div>
        </div>
      )}

      {isAIPopupOpen && (
        <div 
          className="popup-overlay"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => setIsAIPopupOpen(false)}
        >
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <Sparkles className="popup-icon" size={20} />
            <p className="popup-text">
              点击该按钮即可对该客户进行商业分析。
            </p>
          </div>
        </div>
      )}
    </>
  );
});

export default MTBModal;