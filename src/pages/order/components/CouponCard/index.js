import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, Picker } from '@tarojs/components';
import { AtToast } from 'taro-ui';
import './index.scss';

export default class Coupon extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      score: [0, 1000, 2000, 3000, 5000],
      index: 0,
      toastOpen: false,
      scoreNum: 0,
    };
  }

  /**
   * 选择积分
   * @param e
   */
  pickerChange = e => {
    this.setState({
      index: e.detail.value,
    });
    if (this.state.score[parseInt(e.detail.value)] <= this.props.orderInfo.availableIntegral) {
      this.props.onScoreCall(this.state.score[parseInt(e.detail.value)]);
      this.setState({ scoreNum: this.state.score[e.detail.value] });
    } else {
      this.setState({ toastOpen: true });
      setTimeout(() => {
        this.setState({ toastOpen: false });
      }, 2000);
    }
  };

  /**
   * 跳转优惠券列表
   * @param type
   */
  goCoupon = type => {
    if (type === '02') {
      this.$preload({
        memId: this.props.memId,
        couponIds: this.props.couponIds,
      });
      Taro.navigateTo({
        url: `/pages/coupon/index`,
      });
    }
  };

  render() {
    const { totalMoney, couponIds, couponInfo, integraRule } = this.props;
    let couponName = '暂无可用优惠券';
    let type = '02';
    if (
      typeof couponIds !== 'undefined' &&
      couponIds !== null &&
      typeof couponInfo !== 'undefined'
    ) {
      couponName =
        couponIds.length === 0
          ? '暂无可用优惠券'
          : Object.keys(couponInfo).length === 0
          ? '请选择优惠券'
          : couponInfo.couponName;
      type = couponIds.length === 0 ? '01' : '02'; // 无优惠券，阻止跳转
    }
    return (
      <View className="couponWrap">
        <View className="couponItem">
          订单金额<Text className="itemTxt right">{totalMoney}</Text>
        </View>

        <View className="couponItem" onClick={this.goCoupon.bind(this, type)}>
          优惠券
          <Image
            className="arrowImg"
            src="https://haifeng-1258278342.cos.ap-chengdu.myqcloud.com/images/more_arrow.png"
          />
          <Text className="itemTxt right">{couponName}</Text>
        </View>

        <View className="couponItem">
          积分抵扣金额
          <View>
            ({integraRule.integralDosage}积分抵扣{integraRule.deductionAmount}元)
          </View>
          <Image
            className="arrowImg right"
            src="https://haifeng-1258278342.cos.ap-chengdu.myqcloud.com/images/more_arrow.png"
          />
          <View className="pickDom right">
            <Picker
              onChange={this.pickerChange}
              value={this.state.index}
              range={this.state.score}
              className="inputNode"
            >
              <Text className="scoreTxt">{this.state.scoreNum}</Text>
            </Picker>
          </View>
        </View>

        <AtToast isOpened={this.state.toastOpen} text="可用积分不足" icon="heart-2" />
      </View>
    );
  }
}
