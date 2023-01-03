import React from 'react';
import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import './index.scss';

function IconList(props) {
  const { iconList = [] } = props;

  return (
    <View className="iconList clearfix">
      {Array.isArray(iconList) &&
        iconList.map((icon) => (
          <View
            className="iconItem left"
            key={icon.id}
            onClick={() => Taro.switchTab({ url: '/pages/category/index' })}
          >
            <View className="iconWrap">
              <Image src={icon.imgUrl} />
            </View>
            <View className="iconTitle">{icon.title}</View>
          </View>
        ))}
    </View>
  );
}

export default IconList;
