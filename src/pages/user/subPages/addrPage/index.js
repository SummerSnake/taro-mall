import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtIcon, AtToast } from 'taro-ui';
import { connect } from '@tarojs/redux';
import Loading from '@/components/Loading/index';
import './index.scss';

@connect(({ addrPage, loading }) => ({
  ...addrPage,
  ...loading,
}))
export default class AddrPage extends Component {

  config = {
    navigationBarTitleText: '收货地址',
  };

  componentDidMount = () => {
    this.props.dispatch({
      type: 'addrPage/load',
    });
  };

  /**
   * 新增编辑收货地址
   * @param id
   * @param e
   */
  addAddr = async (id, e) => {
    e.stopPropagation();
    if (id > 0) { // 编辑传数据
      let itemClone = {};
      this.state.addrList.map((item) => {
        if (item.id === id) {
          itemClone = { ...item };
        }
      });
      this.$preload({ itemClone });
    }
    Taro.navigateTo({
      url: '/pages/addrEdit/index',
    });
  };

  /**
   * 删除地址
   * @param id
   * @param e
   */
  deleteAddr = async (id, e) => {
    e.stopPropagation();
    this.props.dispatch({
      type: 'addrPage/save',
      payload: {
        id,
      }
    });
    this.props.dispatch({
      type: 'addrPage/delete',
    });
  };

  // /**
  //  * 订单页面选择收货地址
  //  * @param id
  //  * @param consignee
  //  * @param phone
  //  * @param address
  //  */
  // handleAddrClick = async (id, consignee, phone, address) => {
  //   if (this.$router.preload.type === 'order') {
  //     this.$preload({
  //       addressId: id,
  //       consignee,
  //       phone,
  //       address,
  //     });
  //     Taro.redirectTo({
  //       url: '/pages/order/index',
  //     });
  //   }
  // };

  render() {
    const { addrList, toastOpen, toastTxt, toastIcon, effects } = this.props;
    return (
      <View className='addrPageWrap'>
        {
          addrList.map(item => {
            const phoneVal = `${item.phone.toString().slice(0, 3)}****${item.phone.toString().slice(7)}`;
            const addrVal = `${item.province}${item.city}${item.region}${item.detailAddr}`;
            return (
              <View
                className='addrWrap'
                key={item.id}
                onClick={this.handleAddrClick.bind(this,
                  item.id,
                  item.consignee,
                  phoneVal,
                  addrVal
                )}
              >
                <View className='addrTop'>
                  <Text>{item.consigneeName}</Text>
                  <View>{phoneVal}
                    <Text style={{ display: item.type === 1 ? 'inline-block' : 'none' }}>默认地址</Text>
                  </View>
                </View>
                <View className='addrBottom ellipsis'>{addrVal}</View>
                <View className='editIcon' onClick={this.addAddr.bind(this, item.id)}>
                  <AtIcon value='edit' size='20' color='#666' />
                </View>
                <View className='deleteIcon' onClick={this.deleteAddr.bind(this, item.id)}>
                  <AtIcon value='close-circle' size='20' color='#666' />
                </View>
              </View>);
          })
        }

        <View className='submitBtn' onClick={this.addAddr.bind(this, null)}>
          新增收货地址
        </View>

        <AtToast isOpened={toastOpen} text={toastTxt} icon={toastIcon} />

        <Loading isLoading={effects['addrPage/load']} />
      </View>
    );
  }
}
