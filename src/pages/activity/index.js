import React from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import './index.scss';

function Activity() {
  const {
    router: { params = {} },
  } = getCurrentInstance() && getCurrentInstance();

  return (
    <View className="activityWrap">
      <View className="topItemWrap">
        {Array.isArray(params?.goodsList) &&
          params?.goodsList.map((item) => (
            <View
              className="botCardItemWrap clearfix"
              key={item.id}
              onClick={() =>
                Taro.navigateTo({
                  url: `/pages/goodInfo/index?id=${item.id}`,
                })
              }
            >
              <View className="botItemImgWrap left">
                <Image src={item.goodPic} />
              </View>
              <View className="botItemTxtWrap left">
                <View className="txtTop">
                  <Text className="left">热销</Text>
                  <Text className="left ellipsis">{item.name}</Text>
                </View>
                <View className="txtMid">￥{item.price}</View>
                <View className="txtBot">销量：10000</View>
              </View>
            </View>
          ))}
      </View>
    </View>
  );
}

export default Activity;
