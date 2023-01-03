import React, { useState, useEffect } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { getOrderListApi } from '@/services/order';

import NoData from '@/components/NoData/index';
import Loading from '@/components/Loading/index';

import './index.scss';

function OrderList() {
  const {
    router: { params = {} },
  } = getCurrentInstance() && getCurrentInstance();

  const tabList = [
    { id: '00', title: '全部订单' },
    { id: '01', title: '待付款' },
    { id: '02', title: '待发货' },
    { id: '03', title: '已完成' },
  ];

  const [tabPaneList, setTabPaneList] = useState([]);
  const [tabIndex, setTabIndex] = useState('00');
  const [loading, setLoading] = useState(false);

  /**
   * @desc 获取订单列表
   * @return { void }
   */
  const fetchOrderList = async () => {
    setLoading(true);
    const res = await getOrderListApi();

    if (res?.status === 200) {
      const arr =
        tabIndex === '00'
          ? [...res?.data]
          : res?.data.filter((item) => item.orderState === tabIndex);

      setTabPaneList(arr);
    }

    setLoading(false);
  };

  useEffect(() => {
    setTabIndex(params.current);
    fetchOrderList();
  }, []);

  return (
    <View className="orderListWrap">
      <View className="tabsHeader">
        {Arrays.isArray(tabList) &&
          tabList.map((item) => (
            <View key={item.id}>
              <Text
                className={item.id === tabIndex ? 'tabTagActive' : 'tabTag'}
                onClick={() => {
                  setTabIndex(params.current);
                  fetchOrderList();
                }}
              >
                {item.title}
              </Text>
            </View>
          ))}
      </View>

      <View className="tabsCon">
        {Array.isArray(tabPaneList) &&
          tabPaneList.map((item) => (
            <View
              className="tabsItem"
              key={item.id}
              onClick={() =>
                Taro.navigateTo({
                  url: '/pages/orderList/subPages/orderDetail/index',
                })
              }
            >
              <View className="tabTitle">
                {item.orderState === '01'
                  ? '待付款'
                  : item.orderState === '02'
                  ? '待发货'
                  : '已完成'}
                <Text className="right">￥{item.actualMoney}</Text>
              </View>
              {Array.isArray(item?.goodsList) && item?.goodsList.length > 0 && (
                <View className="tabCon">
                  {item.goodsList.map((good) => {
                    return <Image key={good.id} className="goodImg" src={good.goodsPictures} />;
                  })}
                </View>
              )}
              <View className="tabCon">
                <Text>共{item.goodsList.length}件商品</Text>
                <Text>{item.createDate}</Text>
              </View>
            </View>
          ))}
      </View>

      <NoData isVisible={tabList.length === 0} />

      <Loading isLoading={loading} />
    </View>
  );
}

export default OrderList;
