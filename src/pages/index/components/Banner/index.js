import React from 'react';
import Taro from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import './index.scss';

function Banner(props) {
  const { topCardObj = {} } = props;

  return (
    <View className="topCardWrap">
      <View
        className="topCardTit"
        onClick={() =>
          Taro.navigateTo({
            url: `/pages/activity/index?list=${JSON.stringify(topCardObj?.imgList)}`,
          })
        }
      >
        {topCardObj?.title}
        <View className="moreArrow right">
          <Text>更多</Text>
          <Image className="moreArrowImg" src="https://s1.ax1x.com/2020/06/01/tGtBsU.png" />
        </View>
      </View>
      <View className="topCardBanner">
        <Image src={topCardObj?.picture} />
      </View>
      <View className="topItemWrap">
        {Array.isArray(topCardObj?.imgList) &&
          topCardObj?.imgList.map((item) => (
            <View
              className="topItemDom"
              key={item.id}
              onClick={() =>
                Taro.navigateTo({
                  url: `/pages/goodInfo/index?id=${item.id}`,
                })
              }
            >
              <View className="topItemImgWrap">
                <Image src={item.goodPic} />
              </View>
              <View className="topItemTxtWrap">
                <View className="txtTop">
                  <Text className="left">热销</Text>
                  <Text className="left ellipsis">{item.name}</Text>
                </View>
                <View className="txtMid">￥{item.price}</View>
                <View className="txtBot">销量：100</View>
              </View>
            </View>
          ))}
      </View>
    </View>
  );
}

export default Banner;
