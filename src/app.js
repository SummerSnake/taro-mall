import Taro, { Component } from '@tarojs/taro';
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
      'pages/cart/index',
      'pages/user/index',
      'pages/user/subPages/userEdit/index',
      'pages/user/subPages/addrPage/index',
      'pages/user/subPages/addrEdit/index',
      'pages/user/subPages/phoneEdit/index',
      'pages/user/subPages/invoiceEdit/index',
      'pages/user/subPages/suggestion/index',
      'pages/user/subPages/introduction/index',
      'pages/coupon/index',
      'pages/orderList/index',
      'pages/orderList/subPages/orderDetail/index',
      'pages/goodInfo/index',
      'pages/activity/index',
      'pages/order/index',
    ],
    window: {
      navigationBarTitleText: '泰罗商城',
      navigationBarTextStyle: 'black',
      navigationBarBackgroundColor: '#fff',
    },
    tabBar: {
      list: [
        {
          pagePath: 'pages/index/index',
          text: '首页',
          iconPath: './assets/tabbar_icon01.png',
          selectedIconPath: './assets/tabbar_icon01_active.png',
        },
        {
          pagePath: 'pages/category/index',
          text: '分类',
          iconPath: './assets/tabbar_icon02.png',
          selectedIconPath: './assets/tabbar_icon02_active.png',
        },
        {
          pagePath: 'pages/cart/index',
          text: '购物车',
          iconPath: './assets/tabbar_icon03.png',
          selectedIconPath: './assets/tabbar_icon03_active.png',
        },
        {
          pagePath: 'pages/user/index',
          text: '我的',
          iconPath: './assets/tabbar_icon04.png',
          selectedIconPath: './assets/tabbar_icon04_active.png',
        },
      ],
      color: '#999',
      selectedColor: '#e80e27',
      backgroundColor: '#fff',
      borderStyle: 'black',
    },
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
