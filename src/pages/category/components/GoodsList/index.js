import React from 'react';
import { View, Image, Text, ScrollView } from '@tarojs/components';
import './index.scss';

function GoodsList(props) {
  const { goodsList = [], onGoodsCall = () => {} } = props;

  /**
   * @desc 滚动加载
   * @return { void }
   */
  const handleScroll = () => {
    onGoodsCall({ type: 'loading' });
  };

  return (
    <View className="goodCardWrap">
      <ScrollView
        className="scrollDom"
        scrollY
        scrollWithAnimation
        lowerThreshold="50"
        onScrollToLower={handleScroll}
      >
        {Array.isArray(goodsList) &&
          goodsList.map((item) => (
            <View
              className="botCardItemWrap clearfix"
              key={item.id}
              onClick={() => Taro.navigateTo({ url: `/pages/goodInfo/index?id=${item.id}` })}
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
      </ScrollView>
    </View>
  );
}

export default GoodsList;
