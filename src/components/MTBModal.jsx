// src/components/MTBModal.jsx
import React, { useState, forwardRef } from 'react';
import { X, Cpu, BarChart2, Sparkles } from 'lucide-react';
import './MTBModal.css';

const formatValue = (value) =>
  value === null || value === undefined ? '-' : value;

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

const MTBModal = forwardRef(({ mtb, onClose }, ref) => {
  const [isHistoryPopupOpen, setIsHistoryPopupOpen] = useState(false);
  const [isAIPopupOpen, setIsAIPopupOpen] = useState(false);

  if (!mtb) return null;

  const yoyGrowth = calculateGrowth(mtb.thisYearOrders, mtb.lastYearOrders);
  const qoqGrowth = calculateGrowth(mtb.thisQuarterOrders, mtb.lastQuarterOrders);
  const fanucShare = calculateShare(mtb.lastYearOrders, mtb.lastYearDemand);

  return (
    <>
      {/* Main Modal */}
      <div className="modal-overlay" ref={ref} onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close-button" onClick={onClose}>
            <X size={24} />
          </button>

          <h3>{mtb.name}</h3>

          <div className="modal-grid">
            <div className="grid-item">
              <span>客户定位</span>
              <strong>{formatValue(mtb.positioning)}</strong>
            </div>

            <div className="grid-item">
              <span>上年系统需求总量</span>
              <strong>{formatValue(mtb.lastYearDemand)}</strong>
            </div>

            <div className="grid-item">
              <span>FANUC 占比 (上年)</span>
              <strong>{fanucShare}</strong>
            </div>

            <div className="grid-item">
              <span>本年/上年 订单量</span>
              <div className="growth-details">
                <strong className={`growth-${yoyGrowth.color}`}>
                  {yoyGrowth.text}
                </strong>
                <span className="growth-numbers">
                  ({formatValue(mtb.thisYearOrders)}/{formatValue(mtb.lastYearOrders)})
                </span>
              </div>
            </div>

            <div className="grid-item">
              <span>本季/上季 订单量</span>
              <div className="growth-details">
                <strong className={`growth-${qoqGrowth.color}`}>
                  {qoqGrowth.text}
                </strong>
                <span className="growth-numbers">
                  ({formatValue(mtb.thisQuarterOrders)}/{formatValue(mtb.lastQuarterOrders)})
                </span>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="modal-section">
            <h4>补充信息</h4>
            <p className="supplementary-info">{formatValue(mtb.supplementaryInfo)}</p>
          </div>

          <div className="modal-section">
            <h4>主要竞品</h4>
            <div className="tags-container">
              {mtb.competitorsList?.length
                ? mtb.competitorsList.map((c) => (
                    <span key={c} className="tag competitor-tag">
                      {c}
                    </span>
                  ))
                : '-'}
            </div>
          </div>

          <div className="modal-section">
            <h4>主营机床类型</h4>
            <div className="tags-container">
              {mtb.machineTypes?.length
                ? mtb.machineTypes.map((type) => (
                    <span key={type} className="tag">
                      {type}
                    </span>
                  ))
                : '-'}
            </div>
          </div>

          <div className="modal-section">
            <h4>主要终端用户</h4>
            <div className="tags-container">
              {mtb.endUsers?.length
                ? mtb.endUsers.map((user) => (
                    <span key={user.name} className="tag user-tag">
                      {user.name} <span className="user-tag-label">#{user.tag}</span>
                    </span>
                  ))
                : '-'}
            </div>
          </div>

          {/* Buttons */}
          <div className="modal-actions">
            <button
              className="secondary-action-button"
              onClick={() => setIsHistoryPopupOpen(true)}
            >
              <BarChart2 size={18} />
              历史报告查看
            </button>

            <button
              className="ai-button"
              onClick={() => setIsAIPopupOpen(true)}
            >
              <Cpu size={18} />
              AI 解析客户
            </button>
          </div>
        </div>
      </div>

      {/* History Popup */}
      {isHistoryPopupOpen && (
        <div
          className="popup-overlay"
          onClick={() => setIsHistoryPopupOpen(false)}
        >
          <div
            className="popup-content pdf-list-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <BarChart2 className="popup-icon" size={20} />

            {[
              '黑白红有限公司_2025上半年',
              '黑白红有限公司_2024下半年',
              '黑白红有限公司_2024全年',
              '黑白红有限公司_2024上半年',
            ].map((title) => (
              <div className="pdf-item" key={title}>
                <div className="pdf-left">
                  <Sparkles size={22} className="pdf-icon" />
                  <span>{title}</span>
                </div>
                <button className="pdf-download-btn">下载</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Dialog Popup */}
      {isAIPopupOpen && (
        <div
          className="popup-overlay"
          onClick={() => setIsAIPopupOpen(false)}
        >
          <div
            className="popup-content ai-dialog-wrapper"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 横向布局：用户消息在左侧，AI消息在右侧 */}
            <div className="horizontal-dialog-container">
              {/* 用户部分（左侧） */}
              <div className="user-section">
                <div className="dialog-section-title user-title">
                  👤 你（PingLi）
                </div>
                <div className="dialog-bubble user-bubble">
                  黑红白公司去年的销量如何，今年有没有继续增大订单量的搞头？
                </div>
              </div>

              {/* AI 部分（右侧） */}
              <div className="ai-section">
                <div className="dialog-section-title ai-title">
                  🤖 AI 智能分析
                </div>
                <div className="dialog-bubble ai-bubble">
                  {/* --- 更RAG式的AI分析正文：强调检索来源的整合 --- */}
                  <p>
                    基于检索到的历史报告、系统安装台账、内部规划文档，以及外部行业预测信息，我对 <strong>黑红白有限公司</strong> 进行了综合分析。以下是基于RAG（Retrieval-Augmented Generation）机制生成的判断，所有数据均引用自可靠来源：
                  </p>

                  <h4>📌 1. 去年销量情况（2024）</h4>
                  <ul>
                    <li>全年总订单：<strong>325 台</strong> <span className="inline-cite">[来源: 2024全年订单报告]</span></li>
                    <li>同比增长：<strong>+12.3%</strong>（相较于 2023 年 289 台） <span className="inline-cite">[来源: 2024全年订单报告]</span></li>
                    <li>上半年：125 台 <span className="inline-cite">[来源: 2024上半年报告]</span></li>
                    <li>下半年：200 台（环比 +60%） <span className="inline-cite">[来源: 2024下半年报告]</span></li>
                  </ul>

                  <p>从检索到的季节波动数据看，下半年存在“集中补单”现象，这在汽车零件行业较为常见 <span className="inline-cite">[来源: 行业展望报告]</span>。</p>

                  <h4>📌 2. 合作历史与累计产能</h4>
                  <p>
                    该客户 10 年累计安装系统 <strong>1993 台</strong>，平均年复合增长率约 <strong>5.4%</strong> <span className="inline-cite">[来源: 安装台账（2015–2024）]</span>。
                  </p>
                  <p>
                    检索显示，客户采用“更换旧线 + 新扩产线并行”的策略，整体趋势稳定，无明显衰退 <span className="inline-cite">[来源: 2024下半年扩产规划内部稿]</span>。
                  </p>

                  <h4>📌 3. 今年是否有扩单空间？（2025 预测）</h4>
                  <p>
                    通过整合行业预测与客户设备周期数据，我判断：<br/>
                    <strong style={{ fontSize: '15px' }}>
                      👉 2025 年预计继续小幅增长（+3% ~ +7% 区间）。
                    </strong>
                  </p>

                  <p>主要理由是：</p>
                  <ul>
                    <li>客户处于汽车零部件行业，该行业 2025 年预计 <strong>增长 3–5%</strong> <span className="inline-cite">[来源: AutoParts Research 2025展望]</span></li>
                    <li>其铣削类设备 7 年更新周期在 2025–2026 来临 <span className="inline-cite">[来源: 安装台账]</span></li>
                    <li>2024 下半年订单偏高，不排除“前置需求”，但仍有持续性 <span className="inline-cite">[来源: 2024下半年报告]</span></li>
                  </ul>

                  <h4>📘 4. 结论</h4>
                  <p>
                    <strong>黑红白公司今年依然有扩单空间，预计规模不大但稳健增长。</strong> 该判断基于上述RAG检索来源的综合生成。
                  </p>

                  {/* --- RAG 来源总结（更结构化） --- */}
                  <div className="rag-source-card">
                    <div className="rag-title">── RAG 检索来源总结</div>
                    <div className="rag-list">
                      <div>📄 《黑白红有限公司_2024全年订单报告》：年度销量与统计数据</div>
                      <div>📄 《黑白红有限公司_2024上半年报告》：上半年订单细节</div>
                      <div>📄 《黑白红有限公司_2024下半年报告》：下半年订单与环比分析</div>
                      <div>📄 《黑白红有限公司_安装台账（2015–2024）》：累计安装与增长率</div>
                      <div>📄 《黑白红有限公司_2024下半年扩产规划内部稿》：扩产策略与季节波动</div>
                      <div>🌐 《汽车零部件行业展望 2025》（AutoParts Research）：行业增长预测</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default MTBModal;