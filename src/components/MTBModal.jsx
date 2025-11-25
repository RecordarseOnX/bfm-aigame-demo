// src/components/MTBModal.jsx

import React, { useState, forwardRef } from 'react';
import { X, Cpu, BarChart2, Brain } from 'lucide-react';
import './MTBModal.css';

// --- Helper Functions ---
const formatValue = (value) => (value === null || value === undefined ? '-' : value);

const calculateGrowth = (current, previous) => {
  if (
    current === null ||
    current === undefined ||
    previous === null ||
    previous === undefined ||
    previous === 0
  ) {
    return { text: '-', color: 'default' };
  }
  const percentage = Math.round((current / previous) * 100);
  return {
    text: `${percentage}%`,
    color: percentage >= 100 ? 'green' : 'orange',
  };
};

const calculateShare = (orders, total) => {
  if (
    orders === null ||
    orders === undefined ||
    total === null ||
    total === undefined ||
    total === 0
  )
    return '-';
  return `${Math.round((orders / total) * 100)}%`;
};

// --- Custom AI Icon Component ---
const AiSparklesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
    <path d="M20 2v4"></path>
    <path d="M22 4h-4"></path>
    <circle cx="4" cy="20" r="2"></circle>
  </svg>
);


const MTBModal = forwardRef(({ mtb, onClose }, ref) => {
  const [isHistoryPopupOpen, setIsHistoryPopupOpen] = useState(false);
  const [isAIPopupOpen, setIsAIPopupOpen] = useState(false);

  if (!mtb) return null;

  const yoyGrowth = calculateGrowth(mtb.thisYearOrders, mtb.lastYearOrders);
  const qoqGrowth = calculateGrowth(mtb.thisQuarterOrders, mtb.lastQuarterOrders);
  const fanucShare = calculateShare(mtb.lastYearOrders, mtb.lastYearDemand);
  
  const reportTitles = [
    `${mtb.name}_2025上半年订单报告`,
    `${mtb.name}_2024全年订单报告`,
    `${mtb.name}_2024上半年订单报告`,
    `${mtb.name}_安装台账(2015-2024)`,
  ];

  return (
    <>
      {/* --- Main MTB Data Modal --- */}
      <div className="modal-overlay" ref={ref} onClick={onClose}>
        <div className="popup-content-base mtb-modal__content" onClick={(e) => e.stopPropagation()}>
          <button className="mtb-modal__close-button" onClick={onClose}>
            <X size={24} />
          </button>

          <h3>{mtb.name}</h3>

          {/* --- 【JSX 修正】恢复了主弹窗的完整内容 --- */}
          <div className="mtb-modal__grid">
            <div className="mtb-modal__grid-item">
              <span>客户定位</span>
              <strong>{formatValue(mtb.positioning)}</strong>
            </div>
            <div className="mtb-modal__grid-item">
              <span>上年系统需求总量</span>
              <strong>{formatValue(mtb.lastYearDemand)}</strong>
            </div>
            <div className="mtb-modal__grid-item">
              <span>FANUC 占比 (上年)</span>
              <strong>{fanucShare}</strong>
            </div>
            <div className="mtb-modal__grid-item">
              <span>本年/上年 订单量</span>
              <div className="mtb-modal__growth-details">
                <strong className={`growth-color--${yoyGrowth.color}`}>
                  {yoyGrowth.text}
                </strong>
                <span className="mtb-modal__growth-numbers">
                  ({formatValue(mtb.thisYearOrders)}/{formatValue(mtb.lastYearOrders)})
                </span>
              </div>
            </div>
            <div className="mtb-modal__grid-item">
              <span>本季/上季 订单量</span>
              <div className="mtb-modal__growth-details">
                <strong className={`growth-color--${qoqGrowth.color}`}>
                  {qoqGrowth.text}
                </strong>
                <span className="mtb-modal__growth-numbers">
                  ({formatValue(mtb.thisQuarterOrders)}/{formatValue(mtb.lastQuarterOrders)})
                </span>
              </div>
            </div>
          </div>

          <div className="mtb-modal__section">
            <h4>补充信息</h4>
            <p className="mtb-modal__supplementary-info">{formatValue(mtb.supplementaryInfo)}</p>
          </div>

          <div className="mtb-modal__section">
            <h4>主要竞品</h4>
            <div className="mtb-modal__tags-container">
              {mtb.competitorsList?.length
                ? mtb.competitorsList.map((c) => (
                    <span key={c} className="mtb-modal__tag mtb-modal__tag--competitor">
                      {c}
                    </span>
                  ))
                : '-'}
            </div>
          </div>

          <div className="mtb-modal__section">
            <h4>主营机床类型</h4>
            <div className="mtb-modal__tags-container">
              {mtb.machineTypes?.length
                ? mtb.machineTypes.map((type) => (
                    <span key={type} className="mtb-modal__tag">
                      {type}
                    </span>
                  ))
                : '-'}
            </div>
          </div>

          <div className="mtb-modal__section">
            <h4>主要终端用户</h4>
            <div className="mtb-modal__tags-container">
              {mtb.endUsers?.length
                ? mtb.endUsers.map((user) => (
                    <span key={user.name} className="mtb-modal__tag mtb-modal__tag--user">
                      {user.name} <span className="mtb-modal__user-tag-label">#{user.tag}</span>
                    </span>
                  ))
                : '-'}
            </div>
          </div>
          {/* --- 恢复结束 --- */}

          <div className="mtb-modal__actions">
            <button
              className="mtb-modal__button--secondary"
              onClick={() => setIsHistoryPopupOpen(true)}
            >
              <BarChart2 size={18} />
              历史报告查看
            </button>
            <button
              className="mtb-modal__button--ai"
              onClick={() => setIsAIPopupOpen(true)}
            >
              <Cpu size={18} />
              AI 解析客户
            </button>
          </div>
        </div>
      </div>

      {/* --- History (PDF) Popup --- */}
      {isHistoryPopupOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsHistoryPopupOpen(false)}
        >
          <div
            className="popup-content-base history-popup__content"
            onClick={(e) => e.stopPropagation()}
          >
            {reportTitles.map((title) => (
              <div className="history-popup__item" key={title}>
                <div className="history-popup__details">
                  <div className="history-popup__icon">
                    <AiSparklesIcon />
                  </div>
                  <span>{title}</span>
                </div>
                <button className="history-popup__download-btn">下载</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- AI Dialog Popup --- */}
      {isAIPopupOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsAIPopupOpen(false)}
        >
          <div
            className="popup-content-base dialog__wrapper"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dialog__header">
              <div className="dialog__header-icon-wrapper">
                <Brain size={20} />
              </div>
              AI 智能解析：{mtb.name}
            </div>

            <div className="dialog__flow">
              <div className="dialog__row dialog__row--user">
                <div className="dialog__bubble dialog__bubble--user">
                  {mtb.name}去年的销量如何，今年有没有继续增大订单量的搞头？
                </div>
              </div>

              <div className="dialog__row dialog__row--ai">
                <div className="dialog__bubble dialog__bubble--ai">
                  <div className="dialog__bubble-header">
                    <div className="dialog__bubble-icon">
                      <AiSparklesIcon />
                    </div>
                    <span>AI 智能分析</span>
                  </div>
                  <p>
                    您好，<strong>小黄仁儿</strong> 。我已经整合了关于 <strong>{mtb.name}</strong> 的多维度信息，包括历史订单、设备台账、客户关系管理（CRM）记录以及外部市场预测，生成了以下分析报告：
                  </p>
                  <h4>📌 1. 历史业绩与稳定性评估（2023-2024）</h4>
                  <p>
                    根据《2024全年订单报告》，该客户去年总订单量为 <strong>{mtb.lastYearOrders} 台</strong>，相较于 2023 年的 {Math.round(mtb.lastYearOrders / 1.123)} 台，实现了 <strong>+12.3%</strong> 的稳健同比增长 <span className="dialog__inline-cite">[来源: 2024年度报告]</span>。值得注意的是，其订单在下半年有显著提速（环比增长约60%），这与汽车零部件行业“年底集中采购”的季节性趋势相符 <span className="dialog__inline-cite">[来源: 行业季度分析Q4]</span>。
                  </p>
                  <h4>📌 2. 产能与设备生命周期分析</h4>
                  <p>
                    《安装台账》显示，该客户在过去十年中累计安装系统已达 <strong>1,993 台</strong>，呈现出约 <strong>5.4%</strong> 的年复合增长率。客户内部推行“旧线改造”与“新线扩产”并行的策略，显示出其业务具有很强的韧性和持续扩张的潜力 <span className="dialog__inline-cite">[来源: CRM客户规划纪要]</span>。数据显示，其一批关键的铣削类设备将在 2025-2026 年进入 7 年的设备更新周期，这预示着潜在的替换需求。
                  </p>
                  <h4>📌 3. 2025 年订单增量潜力预测</h4>
                  <p>
                    综合所有检索到的信息，我判断：<br/>
                    <strong style={{ fontSize: '15px' }}>
                      👉 {mtb.name} 在 2025 年继续增大订单量的潜力为“中等偏上”，预计增长区间在 +3% 至 +7% 之间。
                    </strong>
                  </p>
                  <p>主要依据如下：</p>
                  <ul>
                    <li><strong>宏观驱动：</strong> 权威机构 AutoParts Research 预测，2025 年汽车零部件行业整体将有 <strong>3-5%</strong> 的温和增长 <span className="dialog__inline-cite">[来源: AutoParts Research 2025展望]</span>。</li>
                    <li><strong>微观需求：</strong> 客户自身的设备更新周期即将来临，这将构成持续且稳定的基础需求。</li>
                    <li><strong>风险提示：</strong> 2024 年下半年的高订单量可能提前消化了部分 2025 年初的需求，因此 Q1 增速放缓。</li>
                  </ul>
                  <h4>📘 4. 结论与建议</h4>
                  <p>
                    <strong>结论：{mtb.name} 依然是值得重点跟进的高价值客户，今年有稳健的增单空间。</strong> 建议销售团队在 Q4 重点跟进其设备更新计划，以抓住潜在的大额订单机会。
                  </p>
                  <div className="dialog__rag-card">
                    <div className="dialog__rag-title">── RAG 检索来源</div>
                    <div className="dialog__rag-list">
                      <div>📄 《{mtb.name}_2024全年订单报告》</div>
                      <div>📄 《{mtb.name}_安装台账 (2015–2024)》</div>
                      <div>📄 《CRM_客户扩产规划内部纪要_2024.11》</div>
                      <div>🌐 《汽车零部件行业展望 2025》– AutoParts Research</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="dialog__input-area">
              <input type="text" placeholder="继续提问..." className="dialog__input" />
              <button className="dialog__send-button">发送</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default MTBModal;