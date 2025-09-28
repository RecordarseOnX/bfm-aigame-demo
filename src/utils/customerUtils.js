// src/utils/customerUtils.js
export const customerTypeToClass = (type) => {
  switch (type) {
    case '大客户': return 'dakehu';
    case '重点客户': return 'zhongdian';
    case '潜力客户': return 'qianli';
    case '小客户': return 'xiaokehu';
    default: return '';
  }
};