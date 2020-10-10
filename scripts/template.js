/**
 * pages模板快速生成脚本,执行命令 yarn tep `文件名`
 */

const fs = require('fs');

const dirName = process.argv[2];

if (!dirName) {
  console.log('文件夹名称不能为空！');
  console.log('示例：yarn tep test');
  process.exit(0);
}

// 页面模版
const indexTep = `import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './index.scss';

@connect(({${dirName}}) => ({
  ...${dirName},
}))
export default class ${titleCase(dirName)} extends Component {
  config = {
    navigationBarTitleText: '${dirName}'
  };

  componentDidMount = () => {

  };

  render() {
    return (
      <View className='${dirName}Wrap'>
        ${dirName}
      </View>
    );
  }
}
`;

// scss文件模版
const scssTep = `@import "../../styles/base";

.${dirName}Wrap {
  @include wh(100%, 100%);
}
`;

// model文件模版
const modelTep = `import * as ${dirName}Api from './service';

export default {
  namespace: '${dirName}',
  state: {

  },

  effects: {
    * effectsDemo(_, { call, put }) {
      const data = yield call(${dirName}Api.demo, {});
      if (data.code === 0) {
        yield put({ 
          type: 'save',
          payload: {
            data: data.data
          }
        });
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};
`;

// service页面模版
const serviceTep = `import { getRequest } from '../../utils/api';

const ${dirName} = async(params) => {
  return await getRequest('/${dirName}', params);
};

export default ${dirName};
`;

fs.mkdirSync(`./src/pages/${dirName}`);
process.chdir(`./src/pages/${dirName}`);

fs.writeFileSync('index.js', indexTep);
fs.writeFileSync('index.scss', scssTep);
fs.writeFileSync('model.js', modelTep);
fs.writeFileSync('service.js', serviceTep);

console.log(`模版${dirName}已创建,请手动增加models`);

function titleCase(str) {
  const array = str.toLowerCase().split(' ');
  for (let i = 0; i < array.length; i++) {
    array[i] = array[i][0].toUpperCase() + array[i].substring(1, array[i].length);
  }
  return array.join(' ');
}

process.exit(0);
