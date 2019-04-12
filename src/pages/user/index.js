import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import { connect } from '@tarojs/redux';
import Loading from '../../components/Loading/index';
import GlobalFooter from '../../components/GlobalFooter/index';
import './index.scss';

@connect(({ user, loading }) => ({
  ...user,
  ...loading,
}))

export default class User extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      userInfo: {},
    };
  }

  config = {
    navigationBarTitleText: '我的'
  };

  componentDidMount = async () => {
    const userInfo = Taro.getStorageSync('userInfo');
    if (Object.keys(userInfo).length > 0) {
      this.setState({ userInfo });
    }
    this.props.dispatch({
      type: 'user/load',
    });
  };

  // /**
  //  * 跳转页面
  //  * @param type
  //  */
  // goEdit = (type) => {
  //   this.$preload({
  //     id: this.state.fetchData.id
  //   });
  //   switch (type) {
  //     case '01':
  //       Taro.navigateTo({
  //         url: '/pages/addrPage/index'
  //       });
  //       break;
  //     case '02':
  //       Taro.navigateTo({
  //         url: '/pages/phoneEdit/index'
  //       });
  //       break;
  //     case '03':
  //       Taro.navigateTo({
  //         url: '/pages/invoiceEdit/index'
  //       });
  //       break;
  //     case '04':
  //       Taro.navigateTo({
  //         url: '/pages/coupon/index'
  //       });
  //       break;
  //     case '05':
  //       Taro.navigateTo({
  //         url: '/pages/userEdit/index'
  //       });
  //       break;
  //     default:
  //       Taro.navigateTo({
  //         url: '/pages/homepage/index'
  //       });
  //   }
  // };

  /**
   * 跳转订单列表
   * @param type
   */
  goOrderList = (type) => {
    this.$preload({
      current: type
    });
    Taro.navigateTo({
      url: '/pages/orderList/index'
    });
  };

  render() {
    const { userInfo } = this.state;
    const { fetchData, effects } = this.props;
    return (
      <View className='userWrap'>
        <View className='userHeader'>
          <View className='headerLeft'>
            <View className='headerImgWrap'>
              <Image src={userInfo.avatarUrl} />
            </View>
            <View className='headerTxt'>
              <View>{userInfo.nickName}</View>
              <View onClick={this.goEdit.bind(this, '05')}>个人设置</View>
            </View>
          </View>
          <View className='headerRight'>
            <View>
              <AtIcon prefixClass='fa' value='vimeo' size='12' color='#e80e27' />
              <Text>积分：{fetchData.score}</Text>
            </View>
          </View>
        </View>

        <View className='couponWrap' onClick={this.goEdit.bind(this, '04')}>
          <View>
            <Text className='couponTxt'>我的优惠券</Text>
            <View className='couponTotal right'>
              <View>{fetchData.coupons}张</View>
              <AtIcon value='chevron-right' size='24' color='#FFE2C0' />
            </View>
          </View>
        </View>

        <View className='myOrder'>
          <View onClick={this.goOrderList.bind(this, "00")}>
            我的订单
            <View className='right'>
              <AtIcon value='chevron-right' size='18' color='#999' />
            </View>
          </View>
          <View>
            <View onClick={this.goOrderList.bind(this, "00")}>
              <Image
                className='orderImg_01'
                src='https://gitee.com/summersnake/images/raw/master/others/all_order.png'
              />
              <View>全部订单</View>
            </View>
            <View onClick={this.goOrderList.bind(this, "01")}>
              <Image
                className='orderImg_02'
                src='https://gitee.com/summersnake/images/raw/master/others/unpay.png'
              />
              <View>待付款</View>
              <View className='badgeDom'>{fetchData.unPay}</View>
            </View>
            <View onClick={this.goOrderList.bind(this, "02")}>
              <Image
                className='orderImg_03'
                src='https://gitee.com/summersnake/images/raw/master/others/express.png'
              />
              <View>待发货</View>
              <View className='badgeDom'>{fetchData.unSend}</View>
            </View>
            <View onClick={this.goOrderList.bind(this, "03")}>
              <Image
                className='orderImg_04'
                src='https://gitee.com/summersnake/images/raw/master/others/completed.png'
              />
              <View>已完成</View>
            </View>
          </View>
        </View>

        <View className='infoList'>
          <View onClick={this.goEdit.bind(this, '01')}>
            <AtIcon value='map-pin' size='16' color='#999' className='verIcon' />
            <Text>收货地址</Text>
            <View className='right'>
              <AtIcon value='chevron-right' size='20' color='#999' />
            </View>
          </View>
          <View onClick={this.goEdit.bind(this, '02')}>
            <AtIcon value='phone' size='16' color='#999' className='verIcon' />
            <Text>认证手机</Text>
            <View className='right'>
              <AtIcon value='chevron-right' size='20' color='#999' />
            </View>
          </View>
          <View onClick={this.goEdit.bind(this, '03')}>
            <AtIcon prefixClass='fa' value='book' size='14' color='#999' className='verIcon' />
            <Text>增值发票</Text>
            <View className='right'>
              <AtIcon value='chevron-right' size='20' color='#999' />
            </View>
          </View>
          <View>
            <AtIcon prefixClass='fa' value='paper-plane-o' size='16' color='#999' className='verIcon' />
            <Text>反馈建议</Text>
            <View className='right'>
              <AtIcon value='chevron-right' size='20' color='#999' />
            </View>
          </View>
          <View>
            <AtIcon prefixClass='fa' value='superpowers' size='14' color='#999' className='verIcon' />
            <Text>系统介绍</Text>
            <View className='right'>
              <AtIcon value='chevron-right' size='20' color='#999' />
            </View>
          </View>
        </View>

        <Loading isLoading={effects['user/load']} />

        <GlobalFooter isActive='04' />
      </View>
    );
  }
}
