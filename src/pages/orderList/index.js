import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { AtToast } from "taro-ui";
import { connect } from '@tarojs/redux';
import NoData from '@/components/NoData/index';
import Loading from '@/components/Loading/index';
import './index.scss';

@connect(({ orderList, loading }) => ({
  ...orderList,
  ...loading,
}))
export default class OrderList extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      tabHeader: [
        { id: "00", title: "全部订单" },
        { id: "01", title: "待付款" },
        { id: "02", title: "待发货" },
        { id: "03", title: "已完成" },
      ],
      tabList: [],
      curTab: "00",
      toastOpen: false,
    };
  }

  config = {
    navigationBarTitleText: '订单列表',
  };

  componentDidMount = async () => {
    if (this.$router.preload) {
      const curTab = this.$router.preload.current;
      this.setState({ curTab });
      this.fetchApi(curTab, null);
    }
  };

  /**
   * tab 点击事件
   * @param value
   */
  handleClick = async (value) => {
    this.setState({ curTab: value });
    this.fetchApi(value, null);
  };

  /**
   * 获取数据
   * @param curTab
   */
  fetchApi = async (curTab) => {
    await this.props.dispatch({
      type: 'orderList/load',
    });
    const { fetchData } = this.props;
    const arr = curTab === '00'
      ? [...fetchData]
      : fetchData.filter(item => {
        return item.orderState === curTab;
      });
    this.setState({
      tabList: [...arr],
    });
  };

  // /**
  //  * 选择优惠券，跳转订单页面
  //  * @param id
  //  * @param orderState
  //  * @param orderNum
  //  */
  // goOrderDetail = (id, orderState, orderNum) => {
  //   this.$preload({
  //     id,
  //     orderState,
  //     memId: this.$router.preload.memId,
  //   });
  //   if (orderNum) {
  //     this.$preload({
  //       orderNum,
  //     });
  //   }
  //   Taro.navigateTo({
  //     url: `/pages/orderDetail/index`
  //   });
  // };

  render() {
    const { effects } = this.props;
    const { tabHeader, curTab, tabList, toastOpen } = this.state;
    return (
      <View className='orderListWrap'>
        <View className='tabsHeader'>
          {
            tabHeader.map((item) => {
              return (
                <View key={item.id}>
                  <Text
                    className={item.id === curTab ? 'tabTagActive' : 'tabTag'}
                    onClick={this.handleClick.bind(this, item.id)}
                  >
                    {item.title}
                  </Text>
                </View>
              );
            })
          }
        </View>

        <View className='tabsCon'>
          {
            Array.isArray(tabList) && tabList.length > 0 && tabList.map((item) => {
              return (
                <View
                  className='tabsItem'
                  key={item.id}
                  onClick={this.goOrderDetail.bind(this, item.id, item.orderState, item.orderNum)}
                >
                  <View className='tabTitle'>
                    {item.orderState === "01" ? '待付款' : item.orderState === "02" ? '待发货' : '已完成'}
                    <Text className='right'>￥{item.actualMoney}</Text>
                  </View>
                  {
                    Array.isArray(item.goodsList) && item.goodsList.length > 0 &&
                    (
                      <View className='tabCon'>
                        {
                          item.goodsList.map((good) => {
                            return (<Image key={good.id} className='goodImg' src={good.goodsPictures} />);
                          })
                        }
                      </View>
                    )
                  }
                  <View className='tabCon'>
                    <Text>共{item.goodsList.length}件商品</Text>
                    <Text>{item.createDate}</Text>
                  </View>
                </View>
              );
            })
          }
        </View>

        <NoData isVisible={tabList.length === 0} />

        <AtToast isOpened={toastOpen} text='下边没有了' icon='close-circle' />

        <Loading isLoading={effects['orderList/load']} />
      </View>
    );
  }
}
