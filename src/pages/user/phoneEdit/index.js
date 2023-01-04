import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Input } from '@tarojs/components';
import { isNotNull } from '@/utils/util';
import { wxToast } from '@/utils/wxApi';
import useCountDown from '@/utils/useCountDown';
import { getSendSmsCodeApi } from '@/services/common';
import { updatePhoneApi } from '@/services/user';

import Loading from '@/components/Loading/index';
import './index.scss';

function PhoneEdit() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const { count, run } = useCountDown();
  const [btnDisabled, setBtnDisabled] = useState(false);

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
   * @desc 获取新手机号验证码
   * @return { void }
   */
  const getSmsCode = () => {
    if (!isNotNull(formData.newPhone)) {
      wxToast('请填写新手机号', 'close-circle');
      return;
    }

    if (!btnDisabled) {
      setBtnDisabled(true);
      fetchSmsCode();
    }
  };

  /**
   * @desc 提交
   * @return { void }
   */
  const handleSubmit = async () => {
    if (checkInputVal(formData.oldPhone, '请输入认证手机')) {
      return;
    }
    if (checkInputVal(formData.newPhone, '请输入新手机号')) {
      return;
    }
    if (checkInputVal(formData.smsCode, '请输入验证码')) {
      return;
    }

    setLoading(true);
    const res = await updatePhoneApi({
      ...formData,
    });

    if (res?.status === 200) {
      wxToast('设置成功', 'check-circle');
    }

    setLoading(false);
    setTimeout(() => {
      Taro.navigateBack();
    }, 2000);
  };

  /**
   * @desc 获取验证码
   * @return { void }
   */
  const fetchSmsCode = async () => {
    setLoading(true);
    const res = await getSendSmsCodeApi({ smsCode: formData.smsCode });

    if (res?.status === 200) {
      run();
      wxToast('发送成功', 'check-circle');
    }

    setLoading(false);
  };

  useEffect(() => {
    if (count === 0) {
      setBtnDisabled(false);
    }
  }, [count]);

  return (
    <View className="phoneEditWrap">
      <View>
        <View className="infoItem clearfix">
          <View className="prefixDom left">认证手机：</View>
          <View className="inputDom left">
            <Input
              className="inputNode"
              placeholder="请输入认证手机"
              onInput={(e) => handleInputChange(e, 'oldPhone')}
            />
          </View>
        </View>
        <View className="infoItem clearfix">
          <View className="prefixDom left">新手机：</View>
          <View className="inputDom left">
            <Input
              className="inputNode"
              placeholder="请输入新手机"
              onInput={(e) => handleInputChange(e, 'newPhone')}
            />
          </View>
        </View>
        <View className="infoItem clearfix">
          <View className="prefixDom left">验证码：</View>
          <View className="inputDom left">
            <Input
              className="inputNode"
              placeholder="请输入验证码"
              onInput={(e) => handleInputChange(e, 'smsCode')}
            />
          </View>
          <View
            className="verBtn right"
            onClick={getSmsCode}
            style={{ backgroundColor: btnDisabled ? '#ccc' : '#e80e27' }}
          >
            {btnDisabled ? `重新发送(${count})` : '获取验证码'}
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

export default PhoneEdit;
