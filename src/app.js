import Taro from '@tarojs/taro';
import React, { Fragment } from 'react';
import 'taro-ui/dist/style/index.scss';
import './styles/base.scss';
import './styles/iconfont.scss';

function App(props) {
  Taro.baseUrl = 'http://rap2api.taobao.org/app/mock/256282/mall';

  return <Fragment>{props?.children}</Fragment>;
}

export default App;
