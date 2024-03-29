import React, { useState, useEffect } from 'react';
import { View, Image, Swiper, SwiperItem } from '@tarojs/components';
import { getHomeDataApi } from '@/services/home';

import Loading from '@/components/Loading/index';
import IconList from './components/IconList/index';
import Banner from './components/Banner/index';
import CardList from './components/CardList/index';
import GoodList from './components/GoodList/index';

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
  const fetchHomeData = async () => {
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
    fetchHomeData();
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

      <Banner topCardObj={topCardObj} />

      <CardList midCardObj={midCardObj} />

      <GoodList botCardObj={botCardObj} />

      <Loading isLoading={loading} />
    </View>
  );
}

export default Index;
