import React, { useState, useEffect } from 'react';
import { View, Text, Picker, Input } from '@tarojs/components';
import { AtIcon } from 'taro-ui';

import { isNotNull, isObj } from '@/utils/util';
import { wxToast } from '@/utils/wxApi';
import { updateAddressApi } from '@/services/user';

import Loading from '@/components/Loading/index';

import './index.scss';

function AddrEdit() {
  const {
    router: { params },
  } = getCurrentInstance() && getCurrentInstance();

  const [formData, setFormData] = useState({
    consignee: '',
    phone: '',
    area: [],
    detailAddr: '',
    checkedVal: false,
  });
  const [loading, setLoading] = useState(false);

  /**
   * @desc 输入框 onChange 事件
   * @param { object } e
   * @param { string } sign
   * @return { void }
   */
  const handleInputChange = (e, sign) => {
    setFormData({
      ...formData,
      [sign]: e?.target?.value,
    });
  };

  /**
   * @desc 检测输入框值是否为空
   * @param { string } inputVal
   * @param { string } toastTxt
   * @return { boolean }
   */
  const checkInputVal = (inputVal, toastTxt) => {
    if (!isNotNull(inputVal)) {
      wxToast(toastTxt, 'close-circle');
      return true;
    }
  };

  /**
   * @desc 提交
   * @return { void }
   */
  handleSubmit = async () => {
    if (checkInputVal(formData.consignee, '请输入收货人')) {
      return;
    }
    if (checkInputVal(formData.phone, '请输入手机号码')) {
      return;
    }
    if (formData.area.length === 0) {
      toastFunc('请选择所在地区', 'close-circle');
      return;
    }
    if (checkInputVal(formData.detailAddr, '请输入详细地址')) {
      return;
    }

    setLoading(true);
    const res = await updateAddressApi({
      ...formData,
      province: params.area[0],
      city: params.area[1],
      region: params.area[2],
      type: params.checkedVal ? 1 : 0,
    });

    if (res?.status === 200) {
      wxToast('设置成功', 'check-circle');
    }

    setLoading(false);
    setTimeout(() => {
      Taro.navigateBack();
    }, []);
  };

  useEffect(() => {
    if (isObj(params?.itemClone) && Object.keys(params?.itemClone).length > 0) {
      const { itemClone = {} } = params;

      setFormData({
        ...formData,
        consignee: itemClone.consignee,
        phone: itemClone.phone,
        area: [itemClone.province, itemClone.city, itemClone.region],
        detailAddr: itemClone.detailAddr,
        checkedVal: itemClone.type === 1,
      });
    }
  }, []);

  return (
    <View className="userEditWrap">
      <View className="infoItem clearfix">
        <View className="prefixDom left">收货人：</View>
        <View className="inputDom left">
          <Input
            placeholder="请输入收货人"
            value={params.consignee}
            onInput={(e) => handleInputChange(e, 'consignee')}
            className="inputNode"
          />
        </View>
      </View>
      <View className="infoItem clearfix">
        <View className="prefixDom left">手机号码：</View>
        <View className="inputDom left">
          <Input
            placeholder="请输入手机号码"
            value={params.phone}
            onInput={(e) => handleInputChange(e, 'phone')}
            className="inputNode"
          />
        </View>
      </View>
      <View className="infoItem clearfix">
        <View className="prefixDom left">所在地区：</View>
        <View className="inputDom left">
          <Picker
            mode="region"
            onInput={(e) => handleInputChange(e, 'area')}
            value={params.area}
            className="inputNode"
          >
            <View className="pickerNode ellipsis">
              <Text>{params.area[0]}</Text>
              <Text>{params.area[1]}</Text>
              <Text>{params.area[2]}</Text>
            </View>
          </Picker>
        </View>
      </View>
      <View className="infoItem clearfix">
        <View className="prefixDom left">详细地址：</View>
        <View className="inputDom left">
          <Input
            placeholder="请输入详细地址"
            value={params.detailAddr}
            onInput={(e) => handleInputChange(e, 'detailAddr')}
            className="inputNode"
          />
        </View>
      </View>
      <View className="infoItem clearfix">
        <View className="prefixDom left">设为默认地址：</View>
        <View className="inputDom left">
          <View
            className={params.checkedVal ? 'cardCheckActive' : 'cardCheck'}
            onInput={(e) => handleInputChange(e, 'checkedVal')}
          >
            <View style={{ display: params.checkedVal ? 'block' : 'none' }}>
              <AtIcon prefixClass="fa" value="checked" size="16" color="#fff" />
            </View>
          </View>
        </View>
      </View>

      <View className="submitBtn" onClick={handleSubmit}>
        提交
      </View>

      <Loading isLoading={loading} />
    </View>
  );
}

export default AddrEdit;
