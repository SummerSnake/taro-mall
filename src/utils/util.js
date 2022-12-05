/**
 * @desc 验证非空
 * @param { any } 要验证的值
 * @return { boolean } true => 非空
 */
export const isNotNull = (val) => val !== '' && typeof val !== 'undefined' && val !== null;

/**
 * @desc 验证是否是对象类型
 * @param { any } obj 要验证的值
 * @return { boolean }  true => 对象类型
 */
export const isObj = (obj) => Object.prototype.toString.call(obj) === '[object Object]';

/**
 * @desc 验证是否是数组类型且数组长度大于0
 * @param { array } array 要验证的数组
 * @return { boolean }
 */
export const verifyArr = (array) => Array.isArray(array) && array.length > 0;

/**
 * @desc 校验是否是正整数
 * @param { any } num
 * @return { boolean }
 */
export const isPositiveInteger = (num) => /(^[1-9]\d*$)/.test(num);

/**
 * @desc 校验最多两位小数
 * @param { any } num
 * @return { boolean }
 */
export const atMostTwoDecimal = (num) => /^-?\d+\.?\d{0,2}$/.test(num);

/**
 * @desc 校验手机号
 * @param { any } val 要验证的值
 * @return { boolean }
 */
export const verifyPhone = (val) => /^1[3-9]\d{9}$/.test(val);

/**
 * @desc 延迟执行
 */
export const delayFunc = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout));

/**
 * @desc 函数防抖 (触发事件后在 n 秒内函数只能执行一次，如果在 n 秒内又触发了事件，则会重新计算函数执行时间)
 * @param { function } func 函数
 * @param { number } delay 延迟执行毫秒数
 * @param { boolean } immediate true 表立即执行，false 表非立即执行
 */
export const debounce = (func, delay, immediate) => {
  let timeout = null;

  return function () {
    const context = this;
    const args = arguments;

    if (timeout) clearTimeout(timeout);

    if (immediate) {
      const callNow = !timeout;
      // 一定时间后清空定时器，即一定时间内定时器存在，callNow 为 false
      timeout = setTimeout(() => {
        timeout = null;
      }, delay);
      if (callNow) func.apply(context, args);
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, delay);
    }
  };
};

/**
 * @desc 函数节流 时间戳版 (在持续触发事件的过程中，函数会立即执行，并且每 n 秒执行一次)
 * @param { function } func 函数
 * @param { number } delay 延迟执行毫秒数
 */
export const throttle = (func, delay) => {
  let previous = 0;
  return function () {
    const now = Date.now();
    const context = this;

    if (now - previous > delay) {
      func.apply(context, arguments);
      previous = now;
    }
  };
};

/**
 * @desc 汉语格式化星期几
 * @param { string } day
 * @return { string }
 */
export const weekFormat = (day) => {
  switch (day) {
    case '1':
      return '星期一';
    case '2':
      return '星期二';
    case '3':
      return '星期三';
    case '4':
      return '星期四';
    case '5':
      return '星期五';
    case '6':
      return '星期六';
    case '0':
      return '星期天';
    default:
  }
};

/**
 * @desc 将数字12345678转化成RMB形式：12,345,678
 * @param { number } num 要转换的数字
 */
export const formatNumberToRMB = (num) => {
  if (!num) {
    return 0;
  }

  let str = num.toString();
  let digit = '';

  if (str.indexOf('.') > -1) {
    digit = str.substring(str.indexOf('.'), str.indexOf('.') + 3);
    if (digit.length < 3) {
      digit += '0';
    }
    str = str.substring(0, str.indexOf('.'));
  }

  let arr = str.split('').reverse();
  let len = arr.length;

  while (len > 3) {
    len -= 1;

    if (len % 3 === 0) {
      arr.splice(len, 0, ',');
    }
  }

  return arr.reverse().join('') + digit;
};
