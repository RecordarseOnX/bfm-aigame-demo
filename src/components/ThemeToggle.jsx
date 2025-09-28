// src/components/ThemeToggle.jsx
import React from 'react';
// 1. 从 lucide-react 额外导入 Sparkles 图标
import { Sun, Moon, Droplet, Sparkles } from 'lucide-react';
import './ThemeToggle.css';

function ThemeToggle({ theme, palette, toggleTheme, togglePalette, showProvince, toggleShowProvince, onAIBtnClick }) {
  // 调色板颜色映射，现在 AI 按钮也会使用它
  const paletteColors = {
    red: '#ef3b2c',
    blue: '#4292c6',
    purple: '#807dba',
  };

  return (
    <div className="theme-toggle-wrapper">
      {/* 主题切换 */}
      <button onClick={toggleTheme} className="theme-toggle-button" aria-label="Toggle theme">
        {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
      </button>

      {/* 调色板切换 */}
      <button onClick={togglePalette} className="theme-toggle-button" aria-label="Toggle palette">
        <Droplet size={20} color={paletteColors[palette] || '#ef3b2c'} />
      </button>

      {/* 省级图层控制按钮 */}
      <button onClick={toggleShowProvince} className="theme-toggle-button" aria-label="Toggle province layer">
        <span className={`province-label ${showProvince ? '' : 'slashed'}`}>省</span>
      </button>

      {/* 2. 修改：AI 按钮现在使用 Sparkles 图标，并根据 palette 动态着色 */}
      <button onClick={onAIBtnClick} className="theme-toggle-button" aria-label="AI Analysis">
        <Sparkles size={20} color={paletteColors[palette] || '#807dba'} />
      </button>
    </div>
  );
}

export default ThemeToggle;