import { useState, useEffect, useRef } from 'react';

function useCountDown(initCount = 60) {
  const [count, setCount] = useState(() => initCount);
  const timer = useRef(null);

  // 设置清除定时器,避免 count 还未为0时，组件已被 Unmount
  useEffect(() => {
    return () => {
      clearInterval(timer.current);
    };
  }, []);

  // 监听 count 的变化
  useEffect(() => {
    if (count === 0) {
      clearInterval(timer.current);
      setCount(60);
    }
  }, [count]);

  // 定义定时器，每秒减一
  const run = () => {
    timer.current = setInterval(() => {
      setCount((pre) => pre - 1);
    }, 1000);
  };

  return { count, run };
}

export default useCountDown;
