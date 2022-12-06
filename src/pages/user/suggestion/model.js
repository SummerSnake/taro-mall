import Taro from '@tarojs/taro';
import { delayFunc } from '@/utils/api';
import suggestion from './service';

export default {
  namespace: 'suggestion',
  state: {
    suggestionVal: '',
    imgList: [],
    toastOpen: false,
    toastTxt: '',
    toastIcon: '',
  },
  effects: {
    *submit(_, { call, put, select }) {
      const { suggestionVal, imgList } = yield select(state => state.suggestion);
      const data = yield call(suggestion, {
        suggestionVal,
        imgList,
      });
      if (data['status'] === 200) {
        yield put({
          type: 'save',
          payload: {
            toastOpen: true,
            toastTxt: '提交成功',
            toastIcon: 'check-circle',
          },
        });
      } else {
        yield put({
          type: 'save',
          payload: {
            toastOpen: true,
            toastTxt: '提交失败',
            toastIcon: 'close-circle',
          },
        });
      }
      yield call(delayFunc, 2000);
      yield put({
        type: 'save',
        payload: {
          toastOpen: false,
        },
      });
      Taro.navigateBack();
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
