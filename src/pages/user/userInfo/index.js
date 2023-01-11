import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Image, Text, Button } from '@tarojs/components';
import { AtIcon, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui';
import { getUserInfoApi } from '@/services/user';

import Loading from '@/components/Loading/index';
import { isObj } from '@/utils/util';

import './index.scss';

function UserInfo() {
  const [miniUserInfo, setMiniUserInfo] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [isModalShow, setIsModalShow] = useState(false);
  const [loading, setLoading] = useState(false);

  /**
   * @desc 小程序授权
   * @return { void }
   */
  const handleApplyAuthorize = () => {
    Taro.getUserInfo({
      success: (res) => {
        setMiniUserInfo(res.userInfo);
        Taro.setStorageSync('miniUserInfo', JSON.stringify(res.userInfo));
        setIsModalShow(false);
      },
    });
  };

  /**
   * @desc 跳转页面
   * @param { string } url
   * @return { void }
   */
  const handleRedirect = (url) => {
    Taro.setStorageSync('navType', 'user');
    Taro.navigateTo({ url });
  };

  /**
   * @desc 获取用户信息
   * @return { void }
   */
  const fetchUserInfo = async () => {
    setLoading(true);
    const res = await getUserInfoApi();

    if (res?.status === 200) {
      setUserInfo(res?.data);
      Taro.setStorageSync('userInfo', JSON.stringify(res?.data));
    }

    setLoading(false);
  };

  useEffect(() => {
    const miniInfo = Taro.getStorageSync('miniUserInfo');
    if (miniInfo) {
      const infoJson = JSON.parse(miniInfo);

      if (isObj(infoJson) && Object.keys(infoJson).length > 0) {
        setMiniUserInfo(infoJson);
      }
    }

    fetchUserInfo();
  }, []);

  return (
    <View className="userWrap">
      <View className="userHeader">
        <View className="headerLeft">
          <View className="headerImgWrap left">
            <Image src={miniUserInfo.avatarUrl} />
          </View>
          <View className="headerTxt">
            <View
              onClick={() => {
                if (!miniUserInfo.nickName) {
                  setIsModalShow(true);
                }
              }}
            >
              {miniUserInfo.nickName || '请登录'}
            </View>
            <View
              className="left"
              onClick={() => handleRedirect('/pages/user/userEdit/index', 'navigateTo')}
            >
              个人设置
            </View>
          </View>
        </View>
        <View className="headerRight">
          <View>
            <AtIcon prefixClass="fa" value="vimeo" size="12" color="#e80e27" />
            <Text>积分：{userInfo.score}</Text>
          </View>
        </View>
      </View>

      <View
        className="couponWrap"
        onClick={() => handleRedirect('/pages/coupon/index', 'navigateTo')}
      >
        <View>
          <Text className="couponTxt">我的优惠券</Text>
          <View className="couponTotal right">
            <View>{userInfo.coupons}张</View>
            <AtIcon value="chevron-right" size="24" color="#FFE2C0" />
          </View>
        </View>
      </View>

      <View className="myOrder">
        <View
          onClick={() => {
            Taro.navigateTo({
              url: `/pages/order/orderList/index?current=00`,
            });
          }}
        >
          我的订单
          <View className="right">
            <AtIcon value="chevron-right" size="18" color="#999" />
          </View>
        </View>
        <View>
          <View
            onClick={() => {
              Taro.navigateTo({
                url: `/pages/order/orderList/index?current=00`,
              });
            }}
          >
            <Image className="orderImg_01" src="https://s1.ax1x.com/2020/06/01/tGt0MT.png" />
            <View>全部订单</View>
          </View>
          <View
            onClick={() => {
              Taro.navigateTo({
                url: `/pages/order/orderList/index?current=01`,
              });
            }}
          >
            <Image className="orderImg_02" src="https://s1.ax1x.com/2020/06/01/tGtoee.png" />
            <View>待付款</View>
            <View className="badgeDom">{userInfo.unPay}</View>
          </View>
          <View
            onClick={() => {
              Taro.navigateTo({
                url: `/pages/order/orderList/index?current=02`,
              });
            }}
          >
            <Image className="orderImg_03" src="https://s1.ax1x.com/2020/06/01/tGtDLF.png" />
            <View>待发货</View>
            <View className="badgeDom">{userInfo.unSend}</View>
          </View>
          <View
            onClick={() => {
              Taro.navigateTo({
                url: `/pages/order/orderList/index?current=03`,
              });
            }}
          >
            <Image className="orderImg_04" src="https://s1.ax1x.com/2020/06/01/tGtUGq.png" />
            <View>已完成</View>
          </View>
        </View>
      </View>

      <View className="infoList">
        <View onClick={() => handleRedirect('/pages/user/addrPage/index')}>
          <AtIcon value="map-pin" size="16" color="#999" className="verIcon" />
          <Text>收货地址</Text>
          <View className="right">
            <AtIcon value="chevron-right" size="20" color="#999" />
          </View>
        </View>
        <View onClick={() => handleRedirect('/pages/user/phoneEdit/index')}>
          <AtIcon value="phone" size="16" color="#999" className="verIcon" />
          <Text>认证手机</Text>
          <View className="right">
            <AtIcon value="chevron-right" size="20" color="#999" />
          </View>
        </View>
        <View onClick={() => handleRedirect('/pages/user/invoiceEdit/index')}>
          <AtIcon prefixClass="fa" value="book" size="14" color="#999" className="verIcon" />
          <Text>增值发票</Text>
          <View className="right">
            <AtIcon value="chevron-right" size="20" color="#999" />
          </View>
        </View>
        <View onClick={() => handleRedirect('/pages/user/suggestion/index')}>
          <AtIcon
            prefixClass="fa"
            value="paper-plane-o"
            size="16"
            color="#999"
            className="verIcon"
          />
          <Text>反馈建议</Text>
          <View className="right">
            <AtIcon value="chevron-right" size="20" color="#999" />
          </View>
        </View>
        <View onClick={() => handleRedirect('/pages/user/introduction/index')}>
          <AtIcon prefixClass="fa" value="superpowers" size="14" color="#999" className="verIcon" />
          <Text>系统介绍</Text>
          <View className="right">
            <AtIcon value="chevron-right" size="20" color="#999" />
          </View>
        </View>
      </View>

      <AtModal isOpened={isModalShow} closeOnClickOverlay={false}>
        <AtModalHeader>欢迎来到泰罗商城</AtModalHeader>
        <AtModalContent>请授权登录，获得完整购物体验</AtModalContent>
        <AtModalAction>
          <Button onClick={() => setIsModalShow(false)}>取消</Button>
          <Button openType="getUserInfo" onClick={handleApplyAuthorize}>
            授权登录
          </Button>
        </AtModalAction>
      </AtModal>

      <Loading isLoading={loading} />
    </View>
  );
}

export default UserInfo;
