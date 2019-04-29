import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import './index.scss';

export default class Gift extends Component {
  constructor() {
    super(...arguments);
    this.state = {};
  }

  render() {
    const { orderInfo } = this.props;
    return (
      <View className="giftWrap">
        <View>
          我的积分
          <Text>{orderInfo.memScore}</Text>
        </View>
        <View>
          本次礼品使用积分
          <Text>{orderInfo.consumeIntegral}</Text>
        </View>
        <View>
          抵扣后剩余积分
          <Text>{orderInfo.availableIntegral}</Text>
        </View>
      </View>
    );
  }
}
