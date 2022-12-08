import React, { useState } from 'react';
import { useDidHide } from '@tarojs/taro';
import { View, Textarea, Text } from '@tarojs/components';

import { isNotNull } from '@/utils/util';
import { wxToast } from '@/utils/wxApi';
import { postSuggestionsApi } from '@/services/user';

import Upload from '@/components/Upload/index';
import Loading from '@/components/Loading/index';
import './index.scss';

function Suggestion() {
  const [formData, setFormData] = useState({
    imgList: [],
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
   * @desc 上传图片回调
   * @param { object[] } imgList
   * @return { void }
   */
  const onUploadCall = (imgList) => {
    setFormData({
      ...formData,
      imgList,
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
    if (checkInputVal(formData.suggestionVal, '请输入反馈建议')) {
      return;
    }

    setLoading(true);
    const res = await postSuggestionsApi({
      ...formData,
    });

    if (res?.status === 200) {
      wxToast('提交成功', 'check-circle');
    }

    setLoading(false);
    setTimeout(() => {
      Taro.navigateBack();
    }, []);
  };

  useDidHide(() => {
    setFormData({
      imgList: [],
    });
  });

  return (
    <View className="suggestionWrap">
      <View className="areaWrap">
        <Textarea
          className="areaDom"
          placeholder="请输入反馈建议，以便我们提供更优质的服务"
          maxlength="500"
          onInput={(e) => handleInputChange(e, 'suggestionVal')}
        />
        <View className="txtCounter">
          {formData.suggestionVal.length}/
          <Text style={{ color: formData.suggestionVal.length > 500 ? '#f00' : '#666' }}>500</Text>
        </View>
      </View>

      <View className="uploadWrap">
        <View className="uploadTitle">您最多可上传5张，单张图片最大1M</View>
        <View className="uploaderDom">
          <Upload onUploadCall={onUploadCall} imgList={imgList} />
        </View>
      </View>

      <View className="submitBtn" onClick={handleSubmit}>
        提交
      </View>

      <Loading isLoading={loading} />
    </View>
  );
}

export default Suggestion;
