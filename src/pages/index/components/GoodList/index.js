import React from 'react';
import Taro from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import './index.scss';

function GoodList(props) {
  const { botCardObj = {} } = props;

  return (
    <View className="botCardWrap">
      <View
        className="botCardTit"
        onClick={() =>
          Taro.navigateTo({
            url: `/pages/activity/index?list=${botCardObj.imgList}`,
          })
        }
      >
        ——<Text>{botCardObj?.title}</Text>——
      </View>

      {Array.isArray(botCardObj?.imgList) &&
        botCardObj?.imgList.map((item) => (
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
  );
}

export default GoodList;
