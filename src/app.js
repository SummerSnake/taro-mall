import Taro, { Component } from '@tarojs/taro';
import '@tarojs/async-await';
import { Provider } from '@tarojs/redux';
import Home from './pages/home';
import dva from './utils/dva';
import models from './models';
import './styles/base.scss';

const dvaApp = dva.createApp({
  initialState: {},
  models: models,
});
const store = dvaApp.getStore();

class App extends Component {

  config = {
    pages: [
      'pages/home/index',
    ],
    window: {
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '商城',
      navigationBarTextStyle: 'black'
    }
  };

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Home />
      </Provider>
    );
  }
}

Taro.render(<App />, document.getElementById('app'));
