import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import { connect } from '@tarojs/redux';
import { isObj } from '@/utils/api';
import './index.scss';

@connect(({ addrPage, invoiceEdit }) => ({
  ...addrPage,
  ...invoiceEdit,
}))
class OrderHeader extends Component {
  componentDidShow = () => {
    this.props.dispatch({
      type: 'addrPage/load',
    });
    this.props.dispatch({
      type: 'invoiceEdit/load',
    });
  };

  /**
   * 跳转页面
   * @param type
   */
  goHref = type => {
    Taro.setStorageSync('navType', 'order');
    switch (type) {
      case '01':
        Taro.navigateTo({
          url: '/pages/user/subPages/addrPage/index',
        });
        break;
      case '02':
        Taro.navigateTo({
          url: '/pages/user/subPages/invoiceEdit/index',
        });
        break;
      default:
        Taro.switchTab({
          url: '/pages/index/index',
        });
    }
  };

  render() {
    const { addrInfo, addrList, params } = this.props;
    let addrObj = {};
    let addrTxt = ''; // 收货地址
    if (isObj(addrInfo) && addrInfo.addrId > 0) {
      // 选择收货地址
      addrObj = { ...addrInfo };
      addrTxt = addrInfo.address;
    } else {
      // 挂载带出默认地址
      addrList.forEach(item => {
        if (item.type === 1) {
          addrObj = { ...item };
          addrTxt = `${item.province}${item.city}${item.region}${item.detailAddr}`;
        }
      });
    }
    return (
      <View className="orderHeader">
        {isObj(addrObj) && Object.keys(addrObj).length > 0 ? (
          <View className="addrDom" onClick={this.goHref.bind(this, '01')}>
            <View>
              <Text>{addrObj.consignee}</Text>
              <Text>{addrObj.phone}</Text>
              <Image
                className="imgDom"
                src="https://haifeng-1258278342.cos.ap-chengdu.myqcloud.com/images/more_arrow.png"
              />
            </View>
            <View>{addrTxt}</View>
          </View>
        ) : (
          <View className="addrDom" onClick={this.goHref.bind(this, '01')}>
            <View>
              <Text>请选择地址</Text>
              <Image
                className="imgDom"
                src="https://gitee.com/summersnake/images/raw/master/others/more_arrow.png"
              />
            </View>
          </View>
        )}
        <View className="invoiceDom" onClick={this.goHref.bind(this, '02')}>
          <AtIcon prefixClass="fa" value="files-text-o" size="14" color="#999" />
          <Text>发票信息：{params.company || ''}</Text>
          <Image
            className="imgDom right"
            src="https://gitee.com/summersnake/images/raw/master/others/more_arrow.png"
          />
        </View>
      </View>
    );
  }
}

export default OrderHeader;
