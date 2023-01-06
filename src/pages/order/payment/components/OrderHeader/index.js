import React, { useState } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import { isObj } from '@/utils/util';
import { getAddressApi, updateInvoiceApi } from '@/services/user';
import './index.scss';

function OrderHeader() {
  const [addrInfo, setAddrInfo] = useState({});
  const [invoiceInfo, setInvoiceInfo] = useState({});

  /**
   * @desc 跳转页面
   * @param { string } url
   * @return { void }
   */
  const handleRedirect = (url) => {
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
        // 默认地址
        if (item.type === 1) {
          setAddrInfo(item);
        }
      });
    }
  };

  /**
   * @desc 获取发票信息
   * @return { void }
   */
  const fetchInvoiceInfo = async () => {
    const res = await updateInvoiceApi();

    if (res?.status === 200) {
      setInvoiceInfo(res?.data);
    }
  };

  useDidShow(() => {
    const selectedAddr = Taro.getStorageSync('addrInfo');
    if (selectedAddr) {
      setAddrInfo(JSON.parse(selectedAddr));
    } else {
      // 挂载带出默认地址
      fetchAddrInfo();
    }

    // 获取发票信息
    if (isObj(invoiceInfo) && Object.keys(invoiceInfo).length < 1) {
      fetchInvoiceInfo();
    }
  });

  return (
    <View className="orderHeader">
      {isObj(addrInfo) && Object.keys(addrInfo).length > 0 ? (
        <View className="addrDom" onClick={() => handleRedirect('/pages/user/addrPage/index')}>
          <View>
            <Text>{addrInfo.consignee}</Text>
            <Text>{addrInfo.phone}</Text>
            <Image className="imgDom right" src="https://s1.ax1x.com/2020/06/01/tGtBsU.png" />
          </View>
          <View>{`${addrInfo.province}${addrInfo.city}${addrInfo.region}${addrInfo.detailAddr}`}</View>
        </View>
      ) : (
        <View className="addrDom" onClick={() => handleRedirect('/pages/user/addrPage/index')}>
          <View>
            <Text>请选择地址</Text>
            <Image className="imgDom right" src="https://s1.ax1x.com/2020/06/01/tGtBsU.png" />
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
