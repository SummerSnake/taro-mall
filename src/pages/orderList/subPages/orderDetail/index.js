import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import Loading from '@/components/Loading/index';
import OrderHeader from './components/OrderHeader/index';
import GoodsCard from './components/GoodsCard/index';
import CouponCard from './components/CouponCard/index';
import './index.scss';

@connect(({ orderDetail, loading }) => ({
  ...orderDetail,
  ...loading,
}))
export default class OrderDetail extends Component {
  config = {
    navigationBarTitleText: '订单详情',
  };
  static defaultProps = {
    fetchData: {},
  };

  componentDidMount = () => {
    this.props.dispatch({
      type: 'orderDetail/load',
    });
  };

  render() {
    const { headerInfo, goodsList, couponInfo, effects } = this.props.fetchData;
    return (
      <View className="orderDetailWrap">
        <OrderHeader headerInfo={headerInfo} />

        <GoodsCard goodsList={goodsList} />

        <CouponCard couponInfo={couponInfo} />

        <View className="orderDetailBottom">返回首页</View>

        <Loading isLoading={effects['orderDetail/load']} />
      </View>
    );
  }
}
