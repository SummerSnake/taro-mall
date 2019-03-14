import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import '../../styles/iconfont.scss';

export default class GoodsList extends Component {
  constructor() {
    super(...arguments);
    this.state = {};
  }

  render() {
    const { isVisible } = this.props;
    return (
      <View style={{
        display: isVisible ? 'block' : 'none',
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'
      }}
      >
        <View style={{ width: '80px', height: '80px', textAlign: 'center', color: '#999' }}>
          <View className='fa fa-paper-plane' style={{ fontSize: '40px' }} />
          <View>暂无数据</View>
        </View>
      </View>
    );
  }
}
