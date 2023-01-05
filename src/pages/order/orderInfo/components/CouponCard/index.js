import { View, Text } from '@tarojs/components';
import './index.scss';

function CouponCard(props) {
  const { couponInfo = {} } = props;

  return (
    <View className="couponWrap">
      <View className="couponItem">
        订单金额<Text className="itemTxt right">{couponInfo.orderMoney}</Text>
      </View>

      <View className="couponItem">
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

export default CouponCard;
