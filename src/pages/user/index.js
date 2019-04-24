import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text, Button } from '@tarojs/components';
import { AtIcon, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui';
import { connect } from '@tarojs/redux';
import Loading from '@/components/Loading/index';
import { isObj } from '@/utils/api';
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
      modalOpen: false,
    };
  }

  config = {
    navigationBarTitleText: '我的',
  };

  componentDidMount = async () => {
    const userInfo = Taro.getStorageSync('userInfo');
    if (isObj(userInfo) && Object.keys(userInfo).length > 0) {
      this.setState({ userInfo });
    } else { // 未授权弹出授权页面
      this.setState({ modalOpen: true });
    }
    this.props.dispatch({
      type: 'user/load',
    });
  };

  /**
   * 获取用户信息
   */
  applyAuthorize = () => {
    // 获取用户信息
    Taro.getUserInfo({
      success: (res) => {
        this.setState({
          userInfo: res.userInfo,
          modalOpen: false,
        });
        Taro.setStorageSync('userInfo', res.userInfo);
      }
    });
  };

  /**
   * 跳转页面
   * @param type
   */
  goHref = (type) => {
    switch (type) {
      case '01':
        Taro.navigateTo({
          url: '/pages/user/subPages/userEdit/index',
        });
        break;
      case '02':
        Taro.navigateTo({
          url: '/pages/coupon/index',
        });
        break;
      case '03':
        Taro.navigateTo({
          url: '/pages/user/subPages/addrPage/index',
        });
        break;
      case '04':
        Taro.navigateTo({
          url: '/pages/user/subPages/phoneEdit/index',
        });
        break;
      case '05':
        Taro.navigateTo({
          url: '/pages/invoiceEdit/index',
        });
        break;
      default:
        Taro.switchTab({
          url: '/pages/index/index',
        });
    }
  };

  /**
   * 跳转订单列表
   * @param type
   */
  goOrderList = (type) => {
    this.$preload({ current: type });
    Taro.navigateTo({
      url: '/pages/orderList/index',
    });
  };

  render() {
    const { userInfo } = this.state;
    const { fetchData, effects } = this.props;
    return (
      <View className='userWrap'>
        <View className='userHeader'>
          <View className='headerLeft'>
            <View className='headerImgWrap left'>
              <Image src={userInfo.avatarUrl} />
            </View>
            <View className='headerTxt'>
              <View>{userInfo.nickName}</View>
              <View className='left' onClick={this.goHref.bind(this, '01')}>个人设置</View>
            </View>
          </View>
          <View className='headerRight'>
            <View>
              <AtIcon prefixClass='fa' value='vimeo' size='12' color='#e80e27' />
              <Text>积分：{fetchData.score}</Text>
            </View>
          </View>
        </View>

        <View className='couponWrap' onClick={this.goHref.bind(this, '02')}>
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
          <View onClick={this.goHref.bind(this, '03')}>
            <AtIcon value='map-pin' size='16' color='#999' className='verIcon' />
            <Text>收货地址</Text>
            <View className='right'>
              <AtIcon value='chevron-right' size='20' color='#999' />
            </View>
          </View>
          <View onClick={this.goHref.bind(this, '04')}>
            <AtIcon value='phone' size='16' color='#999' className='verIcon' />
            <Text>认证手机</Text>
            <View className='right'>
              <AtIcon value='chevron-right' size='20' color='#999' />
            </View>
          </View>
          <View onClick={this.goHref.bind(this, '05')}>
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

        <AtModal isOpened={this.state.modalOpen} closeOnClickOverlay={false}>
          <AtModalHeader>欢迎来到泰罗商城</AtModalHeader>
          <AtModalContent>
            请授权登录，获得完整购物体验
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.goHref.bind(this)}>取消</Button>
            <Button openType='getUserInfo' onClick={this.applyAuthorize}>授权登录</Button>
          </AtModalAction>
        </AtModal>

        <Loading isLoading={effects['user/load']} />
      </View>
    );
  }
}
