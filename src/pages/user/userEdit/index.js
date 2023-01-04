import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Input, Picker } from '@tarojs/components';

import { isNotNull } from '@/utils/util';
import { wxToast } from '@/utils/wxApi';
import { updateUserApi } from '@/services/user';

import Loading from '@/components/Loading/index';
import './index.scss';

function UserEdit() {
  const [formData, setFormData] = useState({});
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
    if (checkInputVal(formData.appellation, '请输入称呼')) {
      return;
    }
    if (checkInputVal(formData.birth, '请输入出生日期')) {
      return;
    }

    setLoading(true);
    const res = await updateUserApi({
      ...formData,
    });

    if (res?.status === 200) {
      wxToast('操作成功', 'check-circle');
    }

    setLoading(false);
    setTimeout(() => {
      Taro.navigateBack();
    }, 2000);
  };

  /**
   * @desc 获取用户信息
   * @return { void }
   */
  const fetchUserInfo = async () => {
    setLoading(true);
    const res = await updateUserApi();

    if (res?.status === 200) {
      setFormData(res?.data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <View className="phoneEditWrap">
      <View className="infoItem clearfix">
        <View className="prefixDom left">称呼：</View>
        <View className="inputDom left">
          <Input
            className="inputNode"
            placeholder="请输入您的称呼"
            value={appellation}
            onInput={(e) => handleInputChange(e, 'appellation')}
          />
        </View>
      </View>

      <View>
        <View className="infoItem clearfix">
          <View className="prefixDom left">出生日期：</View>
          <View className="inputDom left">
            <Picker
              className="inputNode"
              placeholder="请选择出生日期"
              mode="date"
              value={formData.birth}
              onInput={(e) => handleInputChange(e, 'birth')}
            >
              <View className="pickerNode ellipsis">{formData.birth}</View>
            </Picker>
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

export default UserEdit;
