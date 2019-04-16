import Taro, { Component } from '@tarojs/taro';
import '@tarojs/async-await';
import { Provider } from '@tarojs/redux';
import Index from './pages/index';
import dva from './utils/dva';
import models from './models';
import './styles/base.scss';
import './styles/iconfont.scss';

const dvaApp = dva.createApp({
  initialState: {},
  models: models,
});
const store = dvaApp.getStore();

class App extends Component {

  config = {
    pages: [
      'pages/index/index',
      'pages/category/index',
      'pages/goodInfo/index',
      'pages/user/index',
      'pages/orderList/index',
    ],
    window: {
      navigationBarTitleText: '泰罗商城',
      navigationBarTextStyle: 'black',
      navigationBarBackgroundColor: 'white',
    }
  };

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    );
  }
}

Taro.render(<App />, document.getElementById('app'));
