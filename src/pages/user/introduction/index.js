import React from 'react';
import { View, Image } from '@tarojs/components';
import './index.scss';

function Introduction() {
  return (
    <View className="introWrap">
      <View className="introHeader" />
      <View className="introCon">
        <View className="conItem">
          <View className="circle">
            <Image src="https://s1.ax1x.com/2020/06/01/tGtsZ4.png" />
          </View>
          <View className="conTitle">泰罗商城</View>
          <View className="conTxt">taro 小程序商城二号</View>
        </View>

        <View className="conItem">
          <View className="circle">
            <Image src="https://s1.ax1x.com/2020/06/01/tGtRRx.png" />
          </View>
          <View className="conTitle">开发者</View>
          <View className="conTxt">SummerSnake QingDao China</View>
        </View>

        <View className="conItem">
          <View className="circle">
            <Image src="https://s1.ax1x.com/2020/06/01/tGtRRx.png" />
          </View>
          <View className="conTitle">技术栈</View>
          <View className="conTxt">taro react dva scss</View>
        </View>

        <View className="conItem" style={{ border: 'none' }}>
          <View className="circle">
            <Image src="https://s1.ax1x.com/2020/06/01/tGtgiR.png" />
          </View>
          <View className="conTitle">2019年5月10日</View>
          <View className="conTxt">完结撒花</View>
        </View>

        <View className="conItem">
          <View className="circle">
            <Image src="https://s1.ax1x.com/2020/06/01/tGt5LD.png" />
          </View>
          <View className="conTitle">欢迎给星星，谢谢！</View>
          <View className="conTxt">希望能对可爱的同行们有所帮助。</View>
        </View>
      </View>
    </View>
  );
}

export default Introduction;
