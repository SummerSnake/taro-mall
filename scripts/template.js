/**
 * @desc pages模板快速生成脚本,执行命令 npm run tep `文件名`
 */

const fs = require('fs');

const dirName = process.argv[2];

if (!dirName) {
  console.log('文件夹名称不能为空！');
  console.log('npm run tep test');
  process.exit(0);
}

// 页面模版
const indexTep = `import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import './index.scss';

function ${titleCase(dirName)}() {

  useEffect(() => {

  }, []);

  return (
    <View className='${dirName}Wrapper'>
      ${dirName}
    </View>
  );
}

export default ${titleCase(dirName)};
`;

// scss文件模版
const scssTep = `@import "../../styles/base";

.${dirName}Wrap {
  @include wh(100%, 100%);
}
`;

fs.mkdirSync(`./src/pages/${dirName}`);
process.chdir(`./src/pages/${dirName}`);

fs.writeFileSync('index.js', indexTep);
fs.writeFileSync('index.scss', scssTep);

console.log(`模版${dirName}已创建`);

function titleCase(str) {
  const array = str.toLowerCase().split(' ');
  for (let i = 0; i < array.length; i++) {
    array[i] = array[i][0].toUpperCase() + array[i].substring(1, array[i].length);
  }
  return array.join(' ');
}

process.exit(0);
