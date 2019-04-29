import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import { connect } from '@tarojs/redux';
import './index.scss';

@connect(({ addrPage, invoiceEdit, loading }) => ({
  ...addrPage,
  ...invoiceEdit,
  ...loading,
}))
export default class OrderHeader extends Component {
  componentDidMount = () => {
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
          url: '/pages/addrPage/index',
        });
        break;
      case '02':
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

  render() {
    const { addrList, company } = this.props;
    let addrInfo = {};
    addrList.forEach(item => {
      if (item.type === 1) {
        addrInfo = { ...item };
      }
    });
    return (
      <View className="orderHeader">
        {addrInfo && Object.keys(addrInfo).length > 0 ? (
          <View className="addrDom" onClick={this.goHref.bind(this, '01')}>
            <View>
              <Text>{addrInfo.consignee}</Text>
              <Text>{addrInfo.phone}</Text>
              <Image
                className="imgDom"
                src="https://haifeng-1258278342.cos.ap-chengdu.myqcloud.com/images/more_arrow.png"
              />
            </View>
            <View>
              {addrInfo.province}
              {addrInfo.city}
              {addrInfo.region}
              {addrInfo.detailAddr}
            </View>
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
          <Text>发票信息：{company || ''}</Text>
          <Image
            className="imgDom"
            src="https://gitee.com/summersnake/images/raw/master/others/more_arrow.png"
          />
        </View>
      </View>
    );
  }
}
