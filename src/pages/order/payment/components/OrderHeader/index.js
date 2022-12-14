import React, { useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import { isObj } from '@/utils/util';
import { getAddressApi } from '@/services/user';
import './index.scss';

function OrderHeader(props) {
  const { addrInfo } = props;

  const [addrObj, setAddrObj] = useState({});
  const [addrTxt, setAddrTxt] = useState('');
  const [invoiceInfo, setInvoiceInfo] = useState([]);

  /**
   * @desc 跳转页面
   * @param { string } url
   * @return { void }
   */
  handleRedirect = (url) => {
    Taro.setStorageSync('navType', 'order');
    Taro.navigateTo({ url });
  };

  /**
   * @desc 获取地址信息
   * @return { void }
   */
  const fetchAddrInfo = async () => {
    const res = await getAddressApi();

    if (res?.status === 200 && Array.isArray(res?.data)) {
      res?.data.forEach((item) => {
        if (item.type === 1) {
          setAddrObj(item);
          setAddrTxt(`${item.province}${item.city}${item.region}${item.detailAddr}`);
        }
      });
    }
  };

  /**
   * @desc 获取发票信息
   * @return { void }
   */
  const fetchInvoiceInfo = async () => {
    const res = await getAddressApi();

    if (res?.status === 200) {
      setInvoiceInfo(res?.data);
    }
  };

  useEffect(() => {
    if (isObj(addrInfo) && addrInfo.addrId > 0) {
      // 选择收货地址
      setAddrObj(addrInfo);
      setAddrTxt(addrInfo.address);
    } else {
      // 挂载带出默认地址
      fetchAddrInfo();
    }

    // 获取发票信息
    fetchInvoiceInfo();
  }, []);

  return (
    <View className="orderHeader">
      {isObj(addrObj) && Object.keys(addrObj).length > 0 ? (
        <View className="addrDom" onClick={() => handleRedirect('/pages/user/addrPage/index')}>
          <View>
            <Text>{addrObj.consignee}</Text>
            <Text>{addrObj.phone}</Text>
            <Image className="imgDom" src="https://s1.ax1x.com/2020/06/01/tGtBsU.png" />
          </View>
          <View>{addrTxt}</View>
        </View>
      ) : (
        <View className="addrDom" onClick={() => handleRedirect('/pages/user/addrPage/index')}>
          <View>
            <Text>请选择地址</Text>
            <Image className="imgDom" src="https://s1.ax1x.com/2020/06/01/tGtBsU.png" />
          </View>
        </View>
      )}

      <View className="invoiceDom" onClick={() => handleRedirect('/pages/user/invoiceEdit/index')}>
        <AtIcon prefixClass="fa" value="files-text-o" size="14" color="#999" />
        <Text>发票信息：{invoiceInfo.company || ''}</Text>
        <Image className="imgDom right" src="https://s1.ax1x.com/2020/06/01/tGtBsU.png" />
      </View>
    </View>
  );
}

export default OrderHeader;
