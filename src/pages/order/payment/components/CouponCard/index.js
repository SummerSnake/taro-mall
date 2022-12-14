import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image, Picker } from '@tarojs/components';
import './index.scss';

function CouponCard(props) {
  const scoreArr = [0, 1000, 2000, 3000, 5000];

  const [pickerIndex, setPickerIndex] = useState(0);
  const [couponName, setCouponName] = useState('请选择优惠券');

  /**
   * @desc 选择积分
   * @param { object } e
   * @return { void }
   */
  const handlePickerChange = (e) => {
    if (scoreArr[parseInt(e?.target?.value)] <= props.couponInfo?.score) {
      props.onScoreCall(scoreArr[parseInt(e?.target?.value)]);
      setPickerIndex(parseInt(e?.target?.value));
    } else {
      wxToast('可用积分不足', 'close-circle');
    }
  };

  useEffect(() => {
    setCouponName(props.couponInfo?.couponName);
  }, [props.couponInfo]);

  useEffect(() => {
    setPickerIndex(0);
  }, [props.pickerChange]);

  return (
    <View className="couponWrap">
      <View className="couponItem">
        订单金额<Text className="itemTxt right">{props.totalMoney}</Text>
      </View>

      <View
        className="couponItem"
        onClick={() => {
          Taro.setStorageSync('navType', 'order');
          Taro.navigateTo({ url: '/pages/coupon/index' });
        }}
      >
        优惠券
        <Image className="arrowImg" src="https://s1.ax1x.com/2020/06/01/tGtBsU.png" />
        <Text className="itemTxt right">{couponName}</Text>
      </View>

      <View className="couponItem">
        积分抵扣金额
        <View>(100积分抵扣10元)</View>
        <Image className="arrowImg right" src="https://s1.ax1x.com/2020/06/01/tGtBsU.png" />
        <View className="pickDom right">
          <Picker
            onChange={handlePickerChange}
            value={pickerIndex}
            range={scoreArr}
            className="inputNode"
          >
            <Text className="scoreTxt">{scoreArr[pickerIndex]}</Text>
          </Picker>
        </View>
      </View>
    </View>
  );
}

export default CouponCard;
