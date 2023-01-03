import React, { useState, useEffect } from 'react';
import { useDidHide, getCurrentInstance } from '@tarojs/taro';
import { View, Text, Image, Button } from '@tarojs/components';
import { getGoodsListApi } from '@/services/good';

import { AtIcon } from 'taro-ui';
import Loading from '@/components/Loading/index';

import './index.scss';

function GoodInfo() {
  const {
    router: { params = {} },
  } = getCurrentInstance() && getCurrentInstance();

  const [goodInfo, setGoodInfo] = useState({});
  const [tabIndex, setTabIndex] = useState(0);
  const [totalNum, setTotalNum] = useState(0);
  const [totalMoney, setTotalMoney] = useState(0);
  const [loading, setLoading] = useState(false);

  /**
   * @desc 商品数量按钮点击事件
   * @param { string } type
   * @return { void }
   */
  const btnClick = (type) => {
    num = type === 'add' ? (totalNum += 1) : (totalNum -= 1);

    if (num < 0) {
      return;
    }

    setTotalNum(num);
    setTotalMoney((goodInfo.price * num).toFixed(2));
  };

  /**
   * @desc 跳转页面
   * @param { string } url
   * @param { string } action
   * @return { void }
   */
  handleRedirect = (url, action) => {
    if (url === '/pages/cart/index' || url === '/pages/order/index') {
      updateStorage();
    }

    Taro[action]({ url });
  };

  /**
   * @desc 将商品信息存入缓存
   * @return { void }
   */
  const updateStorage = () => {
    if (totalNum > 0) {
      let list = [];
      const goodsList = Taro.getStorageSync('goodsList');
      if (goodsList) {
        list = JSON.parse(goodsList);
        let hasItem = false;
        list.forEach((item) => {
          // 如果缓存在该 商品信息，则添加数量
          if (item.id === goodInfo?.id) {
            item.num = totalNum;
            hasItem = true;
          }
        });
        // 如果缓不存在该 商品信息，则加入缓存
        if (!hasItem) {
          list.push({
            ...goodInfo,
            num: totalNum,
          });
        }
      } else {
        // 如果不存在，则将 商品信息 存入缓存中
        list.push({ ...goodInfo, num: totalNum });
      }

      Taro.setStorageSync('goodsList', JSON.stringify(list));
    }
  };

  /**
   * @desc 获取商品列表
   * @param { object } filters
   * @param { object } pagination
   * @return { void }
   */
  const fetchGoodsList = async () => {
    setLoading(true);
    const res = await getGoodsListApi({ pagination, filters });

    if (res?.status === 200) {
      const info = res?.data.filter((item) => item.id === params?.id);

      setGoodInfo(info[0]);

      // 获取缓存中的商品信息
      const goodsList = Taro.getStorageSync('goodsList');
      if (goodsList) {
        const list = JSON.parse(goodsList);

        list.forEach((item) => {
          if (item.id === params?.id) {
            setTotalNum(item.num);
            setTotalMoney((item.num * info[0]?.price).toFixed(2));
          }
        });
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchGoodsList();
  }, []);

  useDidHide(() => {
    updateStorage();
  });

  return (
    <View className="goodsInfoWrap">
      <View className="bannerWrap">
        <Image src={goodInfo.goodPic} />
      </View>

      <View className="infoTxtWrap">
        <View className="txtTop">
          <Text className="ellipsis">{goodInfo.name}</Text>
        </View>
        <View className="txtBottom">
          <Text>￥{goodInfo.price}</Text>
          <Text className="bottomLast">￥{goodInfo.price}</Text>
        </View>
        <View className="txtRight right">
          <Text>库存：9999</Text>
          <Text>销量：9999</Text>
        </View>
      </View>

      <View className="numWrap">
        <View className="totalMoney">
          合计：<Text>{totalMoney}</Text>
        </View>
        <View className="btnGroup right">
          <View className="subBtn" onClick={() => btnClick('sub')}>
            <AtIcon value="subtract-circle" size="20" color="#999" />
          </View>
          <View className="totalNum">{totalNum}</View>
          <View className="addBtn" onClick={() => btnClick('add')}>
            <AtIcon value="add-circle" size="20" color="#999" />
          </View>
        </View>
      </View>

      <View className="tabsWrap">
        <View className="tabsHeader">
          <View>
            <Text
              className={tabIndex === 0 ? 'tabTagActive' : 'tabTag'}
              onClick={() => setTabIndex(0)}
            >
              商品描述
            </Text>
          </View>
          <View>
            <Text
              className={tabIndex === 1 ? 'tabTagActive' : 'tabTag'}
              onClick={() => setTabIndex(1)}
            >
              规格参数
            </Text>
          </View>
          <View>
            <Text
              className={tabIndex === 2 ? 'tabTagActive' : 'tabTag'}
              onClick={() => setTabIndex(2)}
            >
              包装售后
            </Text>
          </View>
        </View>

        <View className="tabsCon">
          <Image
            mode="widthFix"
            src={
              tabIndex === 0
                ? goodInfo.goodPic
                : tabIndex === 1
                ? 'https://s1.ax1x.com/2020/06/01/tGtWz6.jpg'
                : 'https://s1.ax1x.com/2020/06/01/tGt4sO.jpg'
            }
          />
        </View>
      </View>

      <View className="goodInfoBottom">
        <View className="bottomIconWrap">
          <View className="bottomIcon">
            <AtIcon
              value="home"
              size="21"
              color="#666"
              onClick={() => handleRedirect('/pages/index/index', 'switchTab')}
            />
            <View className="iconTxt">首页</View>
          </View>
          <View
            className="bottomIcon"
            onClick={() => handleRedirect('/pages/category/index', 'switchTab')}
          >
            <AtIcon value="bullet-list" size="21" color="#666" />
            <View className="iconTxt">分类</View>
          </View>
          <View
            className="bottomIcon"
            onClick={() => handleRedirect('/pages/cart/index', 'switchTab')}
          >
            <View className="badgeDom" style={{ display: totalNum > 0 ? 'block' : 'none' }}>
              {totalNum}
            </View>
            <AtIcon value="shopping-cart" size="21" color="#666" />
            <View className="iconTxt">购物车</View>
          </View>
        </View>
        <View className="botBtnWrap">
          <View className="addToCart" onClick={() => btnClick('add')}>
            加入购物车
          </View>
          <Button
            className="goPay"
            onClick={() => handleRedirect('/pages/order/index', 'navigateTo')}
          >
            去结算
          </Button>
        </View>
      </View>

      <Loading isLoading={loading} />
    </View>
  );
}

export default GoodInfo;
