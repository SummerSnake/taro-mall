import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import './index.scss';

export default class Coupon extends Component {
  render() {
    const { couponInfo } = this.props;
    return (
      <View className="couponWrap">
        <View className="couponItem">
          订单金额<Text className="itemTxt right">{couponInfo.orderMoney}</Text>
        </View>

        <View className="couponItem" onClick={this.goCouponList.bind(this)}>
          优惠券
          <Text className="itemTxt right">{couponInfo.couponName}</Text>
        </View>

        <View className="couponItem">
          积分抵扣金额
          <View>(100积分抵扣10元)</View>
          <Text className="itemTxt right">{couponInfo.integralDiscount}</Text>
        </View>
      </View>
    );
  }
}
