import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { getCouponListApi } from '@/services/coupon';

import Loading from '@/components/Loading/index';

import './index.scss';

function Coupon() {
  const [couponList, setCouponList] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  /**
   * @desc 订单页面选择优惠券
   * @param { string } id
   * @param { string } couponName
   * @param { number } amount
   * @return { void }
   */
  const handleRedirectOrder = (id, couponName, amount) => {
    if (Taro.getStorageSync('navType') === 'order') {
      Taro.setStorageSync(
        'couponInfo',
        JSON.stringify({
          couponName,
          couponId: id,
          couponAmount: amount,
        })
      );

      Taro.navigateBack();
    }
  };

  /**
   * @desc 获取商品列表
   * @param { number } tab
   * @return { void }
   */
  const fetchCouponList = async (tab) => {
    setLoading(true);
    const res = await getCouponListApi();

    if (res?.status === 200) {
      const list =
        tab === 0
          ? res?.data.filter((item) => new Date() < new Date(Date.parse(item.endDate)))
          : res?.data.filter((item) => new Date() > new Date(Date.parse(item.endDate)));

      setCouponList(list);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCouponList(0);
  }, []);

  return (
    <View className="couponWrap">
      <View className="tabsHeader">
        <View
          className={tabIndex === 0 ? 'tabTagActive' : 'tabTag'}
          onClick={() => {
            setTabIndex(0);
            fetchCouponList(0);
          }}
        >
          可用优惠券
        </View>
        <View
          className={tabIndex === 1 ? 'tabTagActive' : 'tabTag'}
          onClick={() => {
            setTabIndex(1);
            fetchCouponList(1);
          }}
        >
          已失效优惠券
        </View>
      </View>

      <View className="tabsCon">
        {Array.isArray(couponList) &&
          couponList.map((item) => (
            <View
              className="tabsItem"
              key={item.id}
              onClick={() => handleRedirectOrder(item.id, item.name, item.amount)}
            >
              <View className="tabTitle">
                {item.name}
                <Text className="right" style={{ color: tabIndex === 0 ? '#e80e27' : '#999' }}>
                  ￥{item.amount}
                </Text>
              </View>
              <View className="tabCon">适用类型：{item.type}</View>
              <View className="tabCon">最低消费：{item.minCost}</View>
              <View className="tabCon">
                有效期：{item.startDate}
                <Text>至</Text>
                {item.endDate}
              </View>
              <View className="invalidDom" style={{ display: tabIndex === 0 ? 'none' : 'block' }}>
                已失效
              </View>
            </View>
          ))}
      </View>

      <Loading isLoading={loading} />
    </View>
  );
}

export default Coupon;
