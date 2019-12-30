import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import './index.scss';

class Introduction extends Component {
  config = {
    navigationBarTitleText: '系统介绍',
  };

  render() {
    return (
      <View className="introWrap">
        <View className="introHeader" />
        <View className="introCon">
          <View className="conItem">
            <View className="circle">
              <Image src="https://gitee.com/summersnake/images/raw/master/others/first_step.png" />
            </View>
            <View className="conTitle">泰罗商城</View>
            <View className="conTxt">taro 小程序商城二号</View>
          </View>

          <View className="conItem">
            <View className="circle">
              <Image src="https://gitee.com/summersnake/images/raw/master/others/process_step.png" />
            </View>
            <View className="conTitle">开发者</View>
            <View className="conTxt">SummerSnake QingDao China</View>
          </View>

          <View className="conItem">
            <View className="circle">
              <Image src="https://gitee.com/summersnake/images/raw/master/others/process_step.png" />
            </View>
            <View className="conTitle">技术栈</View>
            <View className="conTxt">taro react dva scss</View>
          </View>

          <View className="conItem" style={{ border: 'none' }}>
            <View className="circle">
              <Image src="https://gitee.com/summersnake/images/raw/master/others/last_step.png" />
            </View>
            <View className="conTitle">2019年5月10日</View>
            <View className="conTxt">完结撒花</View>
          </View>

          <View className="conItem">
            <View className="circle">
              <Image src="https://gitee.com/summersnake/images/raw/master/others/tip_image.png" />
            </View>
            <View className="conTitle">欢迎给星星，谢谢！</View>
            <View className="conTxt">希望能对可爱的同行们有所帮助。</View>
          </View>
        </View>
      </View>
    );
  }
}

export default Introduction;
