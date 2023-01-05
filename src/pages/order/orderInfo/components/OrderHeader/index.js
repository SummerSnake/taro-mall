import { View, Text } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import './index.scss';

function OrderHeader(props) {
  const { headerInfo = {} } = props;

  return (
    <View className="orderHeader">
      <View className="addrDom">
        <View>
          <Text>{headerInfo.consignee}</Text>
          <Text>{headerInfo.phone}</Text>
        </View>
        <View>
          {headerInfo.province}
          {headerInfo.city}
          {headerInfo.region}
          {headerInfo.detailAddr}
        </View>
      </View>
      <View className="invoiceDom">
        <AtIcon prefixClass="fa" value="files-text-o" size="14" color="#999" />
        <Text>发票信息：{headerInfo.company}</Text>
      </View>
    </View>
  );
}

export default OrderHeader;
