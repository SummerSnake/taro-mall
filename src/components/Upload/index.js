import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import { wxToast } from '@/utils/wxApi';
import './index.scss';

function Upload(props) {
  const { onUploadCall = () => {} } = props;

  const [imgList, setImgList] = useState(props.imgList || []);
  const [isAddIconShow, setIsAddIconShow] = useState(false);

  /**
   * @desc 上传图片
   * @param { object } e
   * @return { void }
   */
  const handleUpload = async (e) => {
    e.stopPropagation();

    const res = await Taro.handleUpload({
      count: 5, // 可上传数量
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    });

    if (res?.tempFiles[0].size > 1048576) {
      wxToast('图片大小不能超过1M', 'close-circle');
      return;
    }

    const list = JSON.parse(JSON.stringify(imgList));
    list.push(res?.tempFiles[0].path);

    setImgList(list);

    if (list.length > 4) {
      setIsAddIconShow(false);
    }

    onUploadCall(list);
  };

  /**
   * @desc 删除图片
   * @param { number } index
   * @param { object } e
   * @return { void }
   */
  const handleRemove = (index, e) => {
    e.stopPropagation();

    const list = JSON.parse(JSON.stringify(imgList));
    list.splice(index, 1);

    setImgList(list);
    setIsAddIconShow(true);

    onUploadCall(list);
  };

  useEffect(() => {
    if (Array.isArray(props.imgList) && props.imgList.length > 0) {
      setImgList(props.imgList);

      if (props.imgList.length > 4) {
        this.setState({
          isVisible: false,
        });
      }
    }
  }, [props.imgList]);

  return (
    <View className="uploadWrap">
      {Array.isArray(imgList) &&
        imgList.map((item, index) => {
          return (
            <View className="imgDom left" key={index.toString()}>
              <Image src={item} />
              <View className="cancelIcon" onClick={() => handleRemove(index)}>
                <AtIcon value="close-circle" size="12" />
              </View>
            </View>
          );
        })}

      {isAddIconShow && (
        <View className="addDom left" onClick={handleUpload}>
          <AtIcon value="add" size="30" />
        </View>
      )}
    </View>
  );
}

export default Upload;
