// src/hooks/useOnClickOutside.js
import { useEffect } from 'react';

/**
 * useOnClickOutside Hook
 * @param {Object} ref - 目标 DOM 的 ref
 * @param {Function} handler - 点击外部时调用的函数
 * @param {Array} excludeRefs - 可选，排除的 refs 数组（点击这些元素不会触发 handler）
 */
function useOnClickOutside(ref, handler, excludeRefs = []) {
  useEffect(() => {
    const listener = (event) => {
      // 如果 ref 不存在，或者点击发生在 ref 元素内部，则不触发
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      // 遍历排除 refs，如果点击在排除的元素内部，也不触发
      for (let exRef of excludeRefs) {
        if (exRef.current && exRef.current.contains(event.target)) {
          return;
        }
      }

      // 否则触发 handler
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener); // 移动端也支持

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, excludeRefs]);
}

export default useOnClickOutside;
