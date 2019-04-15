import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import NoData from '@/components/NoData/index';
import Loading from '@/components/Loading/index';
import GlobalFooter from '@/components/GlobalFooter/index';
import { isObj } from '@/utils/api';
import Header from './components/Header/index';
import Classify from './components/Classify/index';
import GoodsList from './components/GoodsList/index';
import './index.scss';

@connect(({ category, loading }) => ({
  ...category,
  ...loading,
}))
export default class Category extends Component {

  config = {
    navigationBarTitleText: '商品分类',
  };

  componentDidMount = async () => {
    this.props.dispatch({ type: 'category/load' });
    this.props.dispatch({ type: 'category/loadClassify' });
  };

  /**
   * 头部回调
   * @param json
   */
  onHeaderCall = (json) => {
    if (isObj(json) && Object.keys(json).length > 0) {
      this.props.dispatch({
        type: 'category/save',
        payload: {
          filters: {
            ...this.props.filters,
            ...json,
          },
        },
      });
      this.props.dispatch({
        type: 'category/load',
      });
    }
  };

  /**
   * 分类回调
   * @param json
   */
  onClassifyCall = (json) => {
    if (isObj(json) && Object.keys(json).length > 0) {
      this.props.dispatch({
        type: 'category/save',
        payload: {
          filters: {
            ...this.props.filters,
            ...json,
          },
        },
      });
      this.props.dispatch({
        type: 'category/load',
      });
    }
  };

  /**
   * 列表滚动回调
   * @param json
   */
  onGoodsCall = (json) => {
    if (json.type === 'loading') {
      this.props.dispatch({
        type: 'category/save',
        payload: {
          pagination: {
            ...this.props.pagination,
            current: this.props.pagination.current += 1,
          },
        },
      });
      this.props.dispatch({
        type: 'category/load',
      });
    }
  };

  render() {
    const { goodsList, classifyList, effects } = this.props;
    return (
      <View className='categoryWrap'>
        <Header onHeaderCall={this.onHeaderCall} />

        <Classify
          onClassifyCall={this.onClassifyCall}
          classifyList={classifyList}
        />

        <GoodsList
          goodsList={goodsList}
          onGoodsCall={this.onGoodsCall}
        />

        <Loading isLoading={effects['category/load']} />

        <NoData isVisible={goodsList.length === 0} />

        <GlobalFooter isActive='02' />
      </View>
    );
  }
}
