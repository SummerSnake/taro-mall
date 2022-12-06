import React from 'react';
import Taro from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import './index.scss';

function MidCard(props) {
  const { midCardObj = {} } = props;
  const imgList = midCardObj?.imgList?.splice(4);

  return (
    <View className="midCardWrap">
      <View
        className="midCardTit"
        onClick={() =>
          Taro.navigateTo({
            url: `/pages/activity/index?list=${midCardObj?.imgList}`,
          })
        }
      >
        {midCardObj?.title}
        <View className="moreArrow right">
          <Text>更多</Text>
          <Image className="moreArrowImg" src="https://s1.ax1x.com/2020/06/01/tGtBsU.png" />
        </View>
      </View>

      <View className="midCardBanner left">
        <Image src={midCardObj?.picture} />
      </View>

      <View className="midItemWrap clearfix">
        {Array.isArray(imgList) &&
          imgList.map((item) => (
            <View
              className="midItemDom left"
              key={item.id}
              onClick={() =>
                Taro.navigateTo({
                  url: `/pages/goodInfo/index?id=${item.id}`,
                })
              }
            >
              <View className="midItemImgWrap">
                <Image src={item.goodPic} />
                <View className="midImgBot">
                  <Text>热销</Text>
                  <Text className="ellipsis">{item.name}</Text>
                </View>
              </View>
              <View className="midItemTxtWrap">
                <View className="txtTop">￥{item.price}</View>
                <View className="txtBot">销量：1000</View>
              </View>
            </View>
          ))}
      </View>
    </View>
  );
}

export default MidCard;
