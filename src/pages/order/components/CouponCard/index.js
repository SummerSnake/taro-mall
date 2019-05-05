import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, Picker } from '@tarojs/components';
import { AtToast } from 'taro-ui';
import { connect } from '@tarojs/redux';
import './index.scss';

@connect(({ user }) => ({
  ...user,
}))
export default class Coupon extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      index: 0,
      scoreArr: [0, 1000, 2000, 3000, 5000],
      couponName: '请选择优惠券',
      toastOpen: false,
    };
  }

  componentDidMount = () => {
    this.props.dispatch({
      type: 'user/load',
    });
  };

  componentWillReceiveProps = nextProps => {
    if (nextProps.couponInfo.couponId !== this.props.couponInfo.couponId) {
      this.setState({
        couponName: nextProps.couponInfo.couponName,
      });
    }
  };

  /**
   * 选择积分
   * @param e
   */
  pickerChange = e => {
    const { score } = this.props.fetchData;
    const { scoreArr } = this.state;
    if (scoreArr[parseInt(e.detail.value)] <= score) {
      this.props.onScoreCall(scoreArr[parseInt(e.detail.value)]);
      this.setState({
        index: parseInt(e.detail.value),
      });
    } else {
      this.setState({ toastOpen: true });
      setTimeout(() => {
        this.setState({ toastOpen: false });
      }, 2000);
    }
  };

  /**
   * 跳转优惠券列表
   */
  goCouponList = () => {
    Taro.setStorageSync('navType', 'order');
    Taro.navigateTo({
      url: '/pages/coupon/index',
    });
  };

  render() {
    const { totalMoney } = this.props;
    return (
      <View className="couponWrap">
        <View className="couponItem">
          订单金额<Text className="itemTxt right">{totalMoney}</Text>
        </View>

        <View className="couponItem" onClick={this.goCouponList.bind(this)}>
          优惠券
          <Image
            className="arrowImg"
            src="https://gitee.com/summersnake/images/raw/master/others/more_arrow.png"
          />
          <Text className="itemTxt right">{this.state.couponName}</Text>
        </View>

        <View className="couponItem">
          积分抵扣金额
          <View>(100积分抵扣10元)</View>
          <Image
            className="arrowImg right"
            src="https://gitee.com/summersnake/images/raw/master/others/more_arrow.png"
          />
          <View className="pickDom right">
            <Picker
              onChange={this.pickerChange}
              value={this.state.index}
              range={this.state.scoreArr}
              className="inputNode"
            >
              <Text className="scoreTxt">{this.state.scoreArr[this.state.index]}</Text>
            </Picker>
          </View>
        </View>

        <AtToast isOpened={this.state.toastOpen} text="可用积分不足" icon="close-circle" />
      </View>
    );
  }
}
