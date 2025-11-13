// src/components/ThemeToggle.jsx
import React from 'react';
import { Sun, Moon, Droplet, Sparkles } from 'lucide-react';
import './ThemeToggle.css';

function ThemeToggle({ theme, palette, toggleTheme, togglePalette, showProvince, toggleShowProvince, onAIBtnClick }) {
  return (
    <div className="theme-toggle-wrapper">
      {/* 主题切换按钮 */}
      <button onClick={toggleTheme} className="theme-toggle-button" aria-label="Toggle theme">
        <Moon size={24} className="icon-moon" />
        <Sun size={24} className="icon-sun" />
      </button>

      {/* 调色板切换按钮 */}
      <button onClick={togglePalette} className="theme-toggle-button" aria-label="Toggle palette">
        <Droplet size={24} className="palette-icon" />
      </button>

      {/* 省份/市图层切换按钮 */}
      <button onClick={toggleShowProvince} className="theme-toggle-button" aria-label="Toggle province layer">
        {/* --- 【核心修改 #3】根据 showProvince 状态显示不同文字 --- */}
        <span className="province-label">
          {showProvince ? '省' : '市'}
        </span>
      </button>

      {/* AI 分析按钮 */}
      <button onClick={onAIBtnClick} className="theme-toggle-button" aria-label="AI Analysis">
        <Sparkles size={24} className="palette-icon" />
      </button>
    </div>
  );
}

export default ThemeToggle;