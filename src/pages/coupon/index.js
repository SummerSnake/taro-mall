import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import Loading from '@/components/Loading/index';
import './index.scss';

@connect(({ coupon, loading }) => ({
  ...coupon,
  ...loading,
}))
export default class Coupon extends Component {
  config = {
    navigationBarTitleText: '优惠券',
  };

  componentDidMount = () => {
    this.fetchApi(0);
  };

  /**
   * tab 点击事件
   * @param value
   */
  handleTabClick = value => {
    this.fetchApi(value);
  };

  /**
   * 获取数据
   * @param current
   */
  fetchApi = current => {
    this.props.dispatch({
      type: 'coupon/save',
      payload: {
        current,
      },
    });
    this.props.dispatch({
      type: 'coupon/load',
    });
  };

  /**
   * 选择优惠券，跳转订单页面
   * @param id
   * @param couponName
   * @param amount
   */
  goOrder = (id, couponName, amount) => {
    if (Taro.getStorageSync('navType') === 'order') {
      this.$preload({
        couponName,
        couponId: id,
        couponAmount: amount,
      });
      Taro.redirectTo({
        url: '/pages/order/index',
      });
    }
  };

  render() {
    const { couponList, current, effects } = this.props;
    return (
      <View className="couponWrap">
        <View className="tabsHeader">
          <View
            className={current === 0 ? 'tabTagActive' : 'tabTag'}
            onClick={this.handleTabClick.bind(this, 0)}
          >
            可用优惠券
          </View>
          <View
            className={current === 1 ? 'tabTagActive' : 'tabTag'}
            onClick={this.handleTabClick.bind(this, 1)}
          >
            已失效优惠券
          </View>
        </View>

        <View className="tabsCon">
          {Array.isArray(couponList) &&
            couponList.map(item => (
              <View
                className="tabsItem"
                key={item.id}
                onClick={this.goOrder.bind(this, item.id, item.name, item.amount)}
              >
                <View className="tabTitle">
                  {item.name}
                  <Text className="right" style={{ color: current === 0 ? '#e80e27' : '#999' }}>
                    ￥{item.amount}
                  </Text>
                </View>
                <View className="tabCon">适用类型：{item.type}</View>
                <View className="tabCon">最低消费：{item.minCost}</View>
                <View className="tabCon">
                  有效期：{item.startDate}
                  <Text>至</Text>
                  {item.endDate}
                </View>
                <View className="invalidDom" style={{ display: current === 0 ? 'none' : 'block' }}>
                  已失效
                </View>
              </View>
            ))}
        </View>

        <Loading isLoading={effects['coupon/load']} />
      </View>
    );
  }
}
