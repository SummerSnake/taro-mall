import React, { useState, useEffect } from 'react';
import { Image, Swiper, SwiperItem } from '@tarojs/components';
import { getHomeDataApi } from '@/services/good';

import Loading from '@/components/Loading/index';
import IconList from './components/IconList/index';
import TopCard from './components/TopCard/index';
import MidCard from './components/MidCard/index';
import BotCard from './components/BotCard/index';

import './index.scss';

function Index() {
  const [imgList, setImgList] = useState([]);
  const [iconList, setIconList] = useState([]);
  const [topCardObj, setTopCardObj] = useState({});
  const [midCardObj, setMidCardObj] = useState({});
  const [botCardObj, setBotCardObj] = useState({});
  const [loading, setLoading] = useState(false);

  /**
   * @desc 获取商品列表
   * @return { void }
   */
  const fetchGoodsList = async () => {
    setLoading(true);
    const res = await getHomeDataApi();

    if (res?.status === 200) {
      setImgList(res?.data?.imgList);
      setIconList(res?.data?.iconList);
      setTopCardObj(res?.data?.topCardObj);
      setMidCardObj(res?.data?.midCardObj);
      setBotCardObj(res?.data?.botCardObj);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchGoodsList();
  }, []);

  return (
    <View className="homeWrap">
      <Swiper indicatorColor="#999" indicatorActiveColor="#fff" circular indicatorDots autoplay>
        {Array.isArray(imgList) &&
          imgList.map((img) => (
            <SwiperItem key={img.id}>
              <Image src={img.imgUrl} />
            </SwiperItem>
          ))}
      </Swiper>

      <IconList iconList={iconList} />

      <TopCard topCardObj={topCardObj} />

      <MidCard midCardObj={midCardObj} />

      <BotCard botCardObj={botCardObj} />

      <Loading isLoading={loading} />
    </View>
  );
}

export default Index;
