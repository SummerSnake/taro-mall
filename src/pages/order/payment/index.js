import React, { useState, useEffect } from 'react';
import Taro, { useDidHide } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';

import { isObj, isNotNull } from '@/utils/util';
import { wxToast } from '@/utils/wxApi';
import Loading from '@/components/Loading/index';
import OrderHeader from './components/OrderHeader/index';
import GoodsCard from './components/GoodsCard/index';
import CouponCard from './components/CouponCard/index';
import './index.scss';

function Order() {
  const {
    router: { params },
  } = getCurrentInstance() && getCurrentInstance();

  const [goodsList, setGoodsList] = useState([]);
  const [addrInfo, setAddrInfo] = useState({});
  const [couponInfo, setCouponInfo] = useState({});
  const [actualMoney, setActualMoney] = useState(0);
  const [totalMoney, setTotalMoney] = useState(0);
  const [integralDiscount, setIntegralDiscount] = useState(0);
  const [pickerChange, setPickerChange] = useState(false);
  const [loading, setLoading] = useState(false);

  /**
   * @desc 选择地址、选择优惠券回调
   * @param { number } totalMoney
   * @return { void }
   */
  const selectCallback = (totalMoney) => {
    // 选择地址
    const addrInfoStr = Taro.getStorageSync('addrInfo');
    if (addrInfoStr) {
      setAddrInfo(JSON.parse(addrInfoStr));
    }

    // 选择优惠券
    const couponInfoStr = Taro.getStorageSync('couponInfo');
    if (couponInfoStr) {
      const couponInfoObj = JSON.parse(couponInfoStr);
      let calcActualMoney = 0;
      // 优惠券金额小于等于总金额减去积分优惠金额
      if (couponInfoObj.couponAmount <= totalMoney - integralDiscount) {
        // 实付金额等于总金额减去优惠券金额与积分优惠金额
        calcActualMoney = totalMoney - (couponInfoObj.couponAmount + integralDiscount);
        setCouponInfo(couponInfoObj);
        setActualMoney(calcActualMoney.toFixed(2));
      } else {
        wxToast('优惠券金额不能大于实付金额', 'close-circle');
      }
    }
  };

  /**
   * @desc 选择积分回调
   * @param { number } score
   * @return { void }
   */
  const onScoreCall = (score) => {
    const integralDiscountRule = score / 10; // 积分抵扣规则
    let calcActualMoney = 0;

    // 如果已选择优惠券
    if (isObj(couponInfo) && isNotNull(couponInfo.couponAmount)) {
      // 积分金额小于等于总金额减去优惠券抵扣金额
      if (integralDiscountRule <= totalMoney - couponInfo.couponAmount) {
        // 实付金额等于总金额减去优惠券金额与积分优惠金额
        calcActualMoney = totalMoney - (integralDiscountRule + couponInfo.couponAmount);

        setIntegralDiscount(integralDiscountRule);
        setActualMoney(calcActualMoney.toFixed(2));
        setPickerChange(true);
      } else {
        wxToast('积分抵用金额不能大于实付金额', 'close-circle');
      }
    } else {
      // 如果未选择优惠券
      if (integralDiscountRule <= totalMoney) {
        // 实付金额等于总金额减去积分优惠金额
        calcActualMoney = totalMoney - integralDiscountRule;

        setIntegralDiscount(integralDiscountRule);
        setActualMoney(calcActualMoney.toFixed(2));
        setPickerChange(true);
      } else {
        wxToast('积分抵用金额不能大于实付金额', 'close-circle');
      }
    }

    setTimeout(() => {
      setPickerChange(false);
    }, 500);
  };

  /**
   * @desc 支付成功删除商品
   * @return { void }
   */
  const removeStorage = async () => {
    const goodsArr = JSON.parse(JSON.stringify(goodsList));

    let arr = [];
    arr = goodsList.filter((item) => {
      let arr1 = goodsArr.map((good) => good.id);
      return !arr1.includes(item.id);
    });

    Taro.setStorageSync('goodsList', JSON.stringify(arr));
    setTimeout(function () {
      Taro.redirectTo({
        url: `/pages/orderList/index?current=${1}`,
      });
    }, 2000);
  };

  /**
   * @desc 支付
   * @return { void }
   */
  const handlePayment = async () => {
    if (Object.keys(addrInfo).length === 0 || !isNotNull(addrInfo.addrId)) {
      wxToast('请选择收货地址', 'close-circle');
      return;
    }
    if (actualMoney <= 0) {
      wxToast('请选择您要购买的商品', 'close-circle');
      return;
    }

    Taro.requestPayment({
      timeStamp: '',
      nonceStr: '',
      package: '',
      signType: '',
      paySign: '',
      success: () => {
        wxToast('支付成功', 'check-circle');
        removeStorage();
        Taro.removeStorageSync('couponInfo');
      },
      fail: () => {
        wxToast('支付失败', 'close-circle');
        Taro.removeStorageSync('couponInfo');
      },
    });
  };

  /**
   * @desc 获取商品列表
   * @return { void }
   */
  const getGoodsList = () => {
    setLoading(true);
    // 从缓存中获取当前购买的商品信息
    let goodsListStr = Taro.getStorageSync('goodsList');
    if (goodsListStr) {
      const list = JSON.parse(goodsListStr);
      let arr = [];

      // 购物车选择的商品
      if (params?.checkedGoods) {
        const { checkedGoods } = params;
        if (Array.isArray(checkedGoods) && checkedGoods.length > 0) {
          arr = list.filter((item) => checkedGoods.includes(item.id));
        }
      } else {
        arr = [...list];
      }

      // 计算总价
      let totalMoney = 0;
      arr.map((item) => {
        totalMoney += parseFloat(item.num) * parseFloat(item.price);
      });

      setActualMoney(totalMoney.toFixed(2));
      setTotalMoney(totalMoney.toFixed(2));
      setGoodsList(arr);

      selectCallback(totalMoney);
      setLoading(false);
    }
  };

  useEffect(() => {
    getGoodsList();
  }, []);

  useDidHide(() => Taro.removeStorageSync('couponInfo'));

  return (
    <View className="orderWrap">
      <OrderHeader addrInfo={addrInfo} />

      <GoodsCard goodsList={goodsList} />

      <CouponCard
        totalMoney={totalMoney}
        couponInfo={couponInfo}
        pickerChange={pickerChange}
        onScoreCall={onScoreCall}
      />

      <View className="orderBottom">
        <View>
          合计：<Text>￥{actualMoney}</Text>
        </View>
        <View className="goPay" onClick={handlePayment}>
          支付
        </View>
      </View>

      <Loading isLoading={loading} />
    </View>
  );
}

export default Order;
