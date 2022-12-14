import React, { useState, useEffect } from 'react';
import { View } from '@tarojs/components';
import { getOrderInfoApi } from '@/services/order';

import Loading from '@/components/Loading/index';
import OrderHeader from './components/OrderHeader/index';
import GoodsCard from './components/GoodsCard/index';
import CouponCard from './components/CouponCard/index';

import './index.scss';

function OrderDetail() {
  const [orderInfo, setOrderInfo] = useState({});
  const [loading, setLoading] = useState(false);

  /**
   * @desc 获取订单列表
   * @return { void }
   */
  const fetchOrderInfo = async () => {
    setLoading(true);
    const res = await getOrderInfoApi();

    if (res?.status === 200) {
      setOrderInfo(res?.data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchOrderInfo();
  }, []);

  return (
    <View className="orderDetailWrap">
      <OrderHeader headerInfo={orderInfo?.headerInfo} />

      <GoodsCard goodsList={orderInfo?.goodsList} />

      <CouponCard couponInfo={orderInfo?.couponInfo} />

      <View className="orderDetailBottom">返回首页</View>

      <Loading isLoading={loading} />
    </View>
  );
}

export default OrderDetail;
