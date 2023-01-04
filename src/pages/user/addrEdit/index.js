import React, { useState, useEffect } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
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
      [sign]: sign === 'checkedVal' ? !formData.checkedVal : e?.target?.value,
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
  const handleSubmit = async () => {
    if (checkInputVal(formData.consignee, '请输入收货人')) {
      return;
    }
    if (checkInputVal(formData.phone, '请输入手机号码')) {
      return;
    }
    if (formData.area.length === 0) {
      wxToast('请选择所在地区', 'close-circle');
      return;
    }
    if (checkInputVal(formData.detailAddr, '请输入详细地址')) {
      return;
    }

    setLoading(true);
    const res = await updateAddressApi({
      ...formData,
      province: formData.area[0],
      city: formData.area[1],
      region: formData.area[2],
      type: formData.checkedVal ? 1 : 0,
    });

    if (res?.status === 200) {
      wxToast('操作成功', 'check-circle');
    }

    setLoading(false);
    setTimeout(() => {
      Taro.navigateBack();
    }, 2000);
  };

  useEffect(() => {
    const initFormData = params.initFormData ? JSON.parse(params.initFormData) : null;
    if (isObj(initFormData) && Object.keys(initFormData).length > 0) {
      setFormData({
        ...formData,
        consignee: initFormData.consignee,
        phone: initFormData.phone,
        area: [initFormData.province, initFormData.city, initFormData.region],
        detailAddr: initFormData.detailAddr,
        checkedVal: initFormData.type === 1,
      });
    }
  }, []);

  return (
    <View className="userEditWrap">
      <View className="infoItem clearfix">
        <View className="prefixDom left">收货人：</View>
        <View className="inputDom left">
          <Input
            className="inputNode"
            placeholder="请输入收货人"
            value={formData.consignee}
            onInput={(e) => handleInputChange(e, 'consignee')}
          />
        </View>
      </View>
      <View className="infoItem clearfix">
        <View className="prefixDom left">手机号码：</View>
        <View className="inputDom left">
          <Input
            className="inputNode"
            placeholder="请输入手机号码"
            value={formData.phone}
            onInput={(e) => handleInputChange(e, 'phone')}
          />
        </View>
      </View>
      <View className="infoItem clearfix">
        <View className="prefixDom left">所在地区：</View>
        <View className="inputDom left">
          <Picker
            className="inputNode"
            mode="region"
            value={formData.area}
            onChange={(e) => handleInputChange(e, 'area')}
          >
            <View className="pickerNode ellipsis">
              <Text>{formData.area[0]}</Text>
              <Text>{formData.area[1]}</Text>
              <Text>{formData.area[2]}</Text>
            </View>
          </Picker>
        </View>
      </View>
      <View className="infoItem clearfix">
        <View className="prefixDom left">详细地址：</View>
        <View className="inputDom left">
          <Input
            className="inputNode"
            placeholder="请输入详细地址"
            value={formData.detailAddr}
            onInput={(e) => handleInputChange(e, 'detailAddr')}
          />
        </View>
      </View>
      <View className="infoItem clearfix">
        <View className="prefixDom left">设为默认地址：</View>
        <View className="inputDom left">
          <View
            className={formData.checkedVal ? 'cardCheckActive' : 'cardCheck'}
            onClick={(e) => handleInputChange(e, 'checkedVal')}
          >
            <View style={{ display: formData.checkedVal ? 'block' : 'none' }}>
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
