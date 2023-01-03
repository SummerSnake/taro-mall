import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import './index.scss';

function GoodsCard(props) {
  const { goodsList } = props;

  return (
    <View className="goodsCard">
      {Array.isArray(goodsList) &&
        goodsList.map((item) => {
          return (
            <View
              className="goodWrap clearfix"
              key={item.id}
              onClick={() =>
                Taro.navigateTo({
                  url: `/pages/goodInfo/index?id=${item.id}`,
                })
              }
            >
              <View className="goodImgWrap left">
                <Image src={item.goodPic} />
              </View>
              <View className="goodTxtWrap left">
                <View className="txtTop">{item.name}</View>
                <View className="txtBottom">￥{item.price}</View>
                <View className="txtRight right">
                  x<Text>{item.num}</Text>
                </View>
              </View>
            </View>
          );
        })}
    </View>
  );
}

export default GoodsCard;
