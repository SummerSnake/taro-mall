import React, { useState } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import { View, Text, Image, Button } from '@tarojs/components';
import { AtIcon } from 'taro-ui';

import Loading from '@/components/Loading/index';
import NoData from '@/components/NoData/index';
import './index.scss';

function Cart() {
  const [goodsList, setGoodsList] = useState([]);
  const [checkboxIds, setCheckboxIds] = useState([]);
  const [totalMoney, setTotalMoney] = useState(0);
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [loading, setLoading] = useState(false);

  /**
   * @desc 商品数量按钮事件
   * @param { object } e
   * @param { number } id
   * @param { string } type
   * @return { void }
   */
  const handleNumChange = (e, id, type) => {
    e.stopPropagation();

    const list = JSON.parse(JSON.stringify(goodsList));
    let total = 0;
    list.forEach((item) => {
      if (item.id === id) {
        // 数量加减
        item.num = type === 'add' ? item.num + 1 : item.num - 1;
        if (item.num < 1) {
          item.num = 0;
        }
      }
      // 计算总价
      total += parseFloat(item.num) * parseFloat(item.price);
    });

    setGoodsList(list);
    setTotalMoney(total.toFixed(2));

    // 更新缓存
    const cartList = list.filter((item) => item.num > 0);
    Taro.setStorageSync('cartList', JSON.stringify(cartList));
  };

  /**
   * @desc 商品 checkbox 点击事件
   * @param { object } e
   * @param { number } id
   * @return { void }
   */
  const handleChecked = (e, id) => {
    e.stopPropagation();

    const checkboxIdArr = [...checkboxIds];
    if (checkboxIdArr.includes(id)) {
      // checkboxIds 数组中是否存在当前点击的 checkbox id，如果有，则删除
      checkboxIdArr.splice(checkboxIdArr.indexOf(id), 1);
    } else {
      // 如果 childIds 数组中不存在当前点击的 checkbox id，则将其加入数组
      checkboxIdArr.push(id);
    }

    let flag = true;
    let totalMoney = 0;
    const list = JSON.parse(JSON.stringify(goodsList));
    list.forEach((item) => {
      if (checkboxIdArr.includes(item.id)) {
        // 计算总价
        totalMoney += parseFloat(item.num) * parseFloat(item.price);
      } else {
        // 全选选择框操作
        flag = false;
      }
    });

    setCheckboxIds(checkboxIdArr);
    setTotalMoney(totalMoney.toFixed(2));
    setIsCheckedAll(flag);
  };

  /**
   * @desc 全选 checkbox
   * @return { void }
   */
  const handleCheckedAll = () => {
    const checkboxIdArr = [...checkboxIds];
    const list = JSON.parse(JSON.stringify(goodsList));

    if (isCheckedAll) {
      setCheckboxIds([]);
      setIsCheckedAll(false);
    } else {
      list.forEach((item) => checkboxIdArr.push(item.id));
      setCheckboxIds(checkboxIdArr);
      setIsCheckedAll(true);
    }
  };

  useDidShow(() => {
    setLoading(true);
    // 从缓存中拿当前购买的商品信息
    let list = Taro.getStorageSync('cartList');
    if (list) {
      list = JSON.parse(list);

      const checkboxIdArr = [];
      let totalMoney = 0;
      list.forEach((item) => {
        // 存储 checkboxIds 数组供 checkbox 使用
        checkboxIdArr.push(item.id);
        // 计算总价
        totalMoney += parseFloat(item.num) * parseFloat(item.price);
      });

      setGoodsList(list);
      setCheckboxIds(checkboxIdArr);
      setTotalMoney(totalMoney.toFixed(2));
      setIsCheckedAll(true);
    }

    setLoading(false);
  });

  return (
    <View className="cartWrap">
      {Array.isArray(goodsList) &&
        goodsList.map((item) => (
          <View
            className="cardItemWrap clearfix"
            key={item.id}
            onClick={() => {
              Taro.setStorageSync('goodsList', JSON.stringify(goodsList));
              Taro.navigateTo({
                url: `/pages/goodInfo/index?id=${item.id}`,
              });
            }}
          >
            <View
              style={{ margin: '28px 10px 0' }}
              className={checkboxIds.includes(item.id) ? 'cardCheckActive' : 'cardCheck'}
              onClick={(e) => handleChecked(e, item.id)}
            >
              <View style={{ display: checkboxIds.includes(item.id) ? 'block' : 'none' }}>
                <AtIcon prefixClass="fa" value="checked" size="16" color="#fff" />
              </View>
            </View>
            <View className="cartItemImgWrap left">
              <Image src={item.goodPic} />
            </View>
            <View className="cartItemTxtWrap left">
              <View className="ellipsis">{item.name}</View>
              <View>￥{item.price}</View>
            </View>
            <View className="btnGroup">
              <View className="subBtn" onClick={(e) => handleNumChange(e, item.id, 'sub')}>
                <AtIcon value="subtract-circle" size="23" color="#999" />
              </View>
              <View className="numDom">{item.num}</View>
              <View className="addBtn" onClick={(e) => handleNumChange(e, item.id, 'add')}>
                <AtIcon value="add-circle" size="23" color="#999" />
              </View>
            </View>
          </View>
        ))}

      <View className="statisticWrap">
        <View
          style={{ margin: '12px 4px 0 8px' }}
          className={isCheckedAll ? 'cardCheckActive' : 'cardCheck'}
          onClick={handleCheckedAll}
        >
          <View style={{ display: isCheckedAll ? 'block' : 'none' }}>
            <AtIcon
              style={{ display: isCheckedAll ? 'block' : 'none' }}
              prefixClass="fa"
              value="checked"
              size="16"
              color="#fff"
            />
          </View>
        </View>
        <Text className="selectTxt">全选</Text>
        <View className="totalNum">
          合计：<Text>￥{totalMoney}</Text>
        </View>
        <Button
          className="createOrder right"
          onClick={() => {
            Taro.setStorageSync('goodsList', JSON.stringify(goodsList));
            Taro.navigateTo({
              url: `/pages/order/payment/index?checkedGoods=${JSON.stringify(checkboxIds)}`,
            });
          }}
          openType="getUserInfo"
        >
          下单({checkboxIds.length})
        </Button>
      </View>

      <NoData isVisible={Array.isArray(goodsList) && goodsList.length === 0} />

      <Loading isLoading={loading} />
    </View>
  );
}

export default Cart;
