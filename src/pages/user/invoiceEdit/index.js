import React, { useState, useEffect } from 'react';
import { View, Input } from '@tarojs/components';
import { isNotNull } from '@/utils/util';
import { updateInvoiceApi } from '@/services/user';

import Loading from '@/components/Loading/index';
import './index.scss';

function InvoiceEdit() {
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
   * 提交
   */
  const handleSubmit = async () => {
    if (checkInputVal(formData.company, '请输入单位名称')) {
      return;
    }
    if (checkInputVal(formData.taxpayer, '请输入纳税人识别码')) {
      return;
    }
    if (checkInputVal(formData.regAddr, '请输入注册地址')) {
      return;
    }
    if (checkInputVal(formData.regPhone, '请输入注册电话')) {
      return;
    }
    if (checkInputVal(formData.bank, '请输入开户银行')) {
      return;
    }
    if (checkInputVal(formData.bankAccount, '请输入银行账户')) {
      return;
    }

    setLoading(true);
    const res = await updateInvoiceApi({
      ...formData,
    });

    if (res?.status === 200) {
      wxToast('设置成功', 'check-circle');
    }

    setLoading(false);
    setTimeout(() => {
      Taro.navigateBack();
    }, []);
  };

  /**
   * @desc 获取发票信息
   * @return { void }
   */
  const fetchInvoiceInfo = async () => {
    setLoading(true);
    const res = await getAddressApi();

    if (res?.status === 200) {
      setFormData(res?.data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchInvoiceInfo();
  }, []);

  return (
    <View className="invoiceEditWrap">
      <View>
        <View className="infoItem clearfix">
          <View className="prefixDom left">单位名称：</View>
          <View className="inputDom left">
            <Input
              type="text"
              value={formData.company}
              onInput={(e) => handleInputChange(e, 'company')}
              className="inputNode"
            />
          </View>
        </View>
        <View className="infoItem clearfix">
          <View className="prefixDom left">纳税人识别码：</View>
          <View className="inputDom left">
            <Input
              type="text"
              value={formData.taxpayer}
              onInput={(e) => handleInputChange(e, 'taxpayer')}
              className="inputNode"
            />
          </View>
        </View>
        <View className="infoItem clearfix">
          <View className="prefixDom left">注册地址：</View>
          <View className="inputDom left">
            <Input
              type="text"
              value={formData.regAddr}
              onInput={(e) => handleInputChange(e, 'regAddr')}
              className="inputNode"
            />
          </View>
        </View>
        <View className="infoItem clearfix">
          <View className="prefixDom left">注册电话：</View>
          <View className="inputDom left">
            <Input
              type="text"
              value={formData.regPhone}
              onInput={(e) => handleInputChange(e, 'regPhone')}
              className="inputNode"
            />
          </View>
        </View>
        <View className="infoItem clearfix">
          <View className="prefixDom left">开户银行：</View>
          <View className="inputDom left">
            <Input
              type="text"
              value={formData.bank}
              onInput={(e) => handleInputChange(e, 'bank')}
              className="inputNode"
            />
          </View>
        </View>
        <View className="infoItem clearfix">
          <View className="prefixDom left">银行账户：</View>
          <View className="inputDom left">
            <Input
              type="text"
              value={formData.bankAccount}
              onInput={(e) => handleInputChange(e, 'bankAccount')}
              className="inputNode"
            />
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

export default InvoiceEdit;
