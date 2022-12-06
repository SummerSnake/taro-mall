import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import { getAddressApi, deleteAddressApi } from '@/services/user';
import { wxToast } from '@/utils/wxApi';

import Loading from '@/components/Loading/index';
import './index.scss';

function AddrPage() {
  const [addrList, setAddrList] = useState([]);
  const [loading, setLoading] = useState(false);

  /**
   * @desc 新增编辑收货地址
   * @param { number } id
   * @param { object } e
   * @return { void }
   */
  const updateAddr = (id, e) => {
    e.stopPropagation();
    let itemClone = {};

    // 编辑传数据
    if (id > 0) {
      addrList.forEach((item) => {
        if (item.id === id) {
          itemClone = { ...item };
        }
      });
    }

    Taro.navigateTo({
      url: `/pages/user/addrEdit/index?itemClone=${itemClone}`,
    });
  };

  /**
   * @desc 删除地址
   * @param { number } id
   * @param { object } e
   * @return { void }
   */
  const deleteAddr = async (id, e) => {
    e.stopPropagation();

    setLoading(true);
    const res = await deleteAddressApi();

    if (res?.status === 200) {
      wxToast(toastTxt, 'check-circle');
    }

    setLoading(false);
  };

  /**
   * @desc 获取地址信息
   * @return { void }
   */
  const fetchAddrInfo = async () => {
    setLoading(true);
    const res = await getAddressApi();

    if (res?.status === 200) {
      setAddrList(res?.data);
    }

    setLoading(false);
  };

  /**
   * 订单页面选择收货地址
   * @param id
   * @param consignee
   * @param phone
   * @param address
   */
  const handleAddrClick = async (id, consignee, phone, address) => {
    const navType = Taro.getStorageSync('navType');
    if (navType === 'order') {
      Taro.setStorageSync(
        'addrInfo',
        JSON.stringify({
          addrId: id,
          consignee,
          phone,
          address,
        })
      );
      Taro.navigateBack();
    }
  };

  useEffect(() => {
    fetchAddrInfo();
  }, []);

  return (
    <View className="addrPageWrap">
      {Array.isArray(addrList) &&
        addrList.map((item) => {
          const phoneVal = `${item.phone.toString().slice(0, 3)}****${item.phone
            .toString()
            .slice(7)}`;
          const addrVal = `${item.province}${item.city}${item.region}${item.detailAddr}`;

          return (
            <View
              className="addrWrap"
              key={item.id}
              onClick={() => handleAddrClick(item.id, item.consignee, item.phone, addrVal)}
            >
              <View className="addrTop">
                <Text>{item.consigneeName}</Text>
                <View>
                  {phoneVal}
                  <Text style={{ display: item.type === 1 ? 'inline-block' : 'none' }}>
                    默认地址
                  </Text>
                </View>
              </View>
              <View className="addrBottom ellipsis">{addrVal}</View>
              <View className="editIcon" onClick={(e) => updateAddr(item.id, e)}>
                <AtIcon value="edit" size="20" color="#666" />
              </View>
              <View className="deleteIcon" onClick={(e) => deleteAddr(item.id, e)}>
                <AtIcon value="close-circle" size="20" color="#666" />
              </View>
            </View>
          );
        })}

      <View className="submitBtn" onClick={(e) => updateAddr(undefined, e)}>
        新增收货地址
      </View>

      <Loading isLoading={loading} />
    </View>
  );
}

export default AddrPage;
