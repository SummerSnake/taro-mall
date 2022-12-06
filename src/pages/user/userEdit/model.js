import Taro from '@tarojs/taro';
import { delayFunc } from '@/utils/api';
import userEdit from './service';

export default {
  namespace: 'userEdit',
  state: {
    appellation: '',
    birth: '',
    toastOpen: false,
    toastTxt: '',
    toastIcon: '',
  },
  effects: {
    *load(_, { call, put }) {
      const data = yield call(userEdit, {});
      if (data['status'] === 200) {
        yield put({
          type: 'save',
          payload: {
            appellation: data.data.appellation,
            birth: data.data.birth,
          },
        });
      }
    },
    *submit(_, { call, put, select }) {
      const { appellation, birth } = yield select(state => state.userEdit);
      const data = yield call(userEdit, {
        appellation,
        birth,
      });
      if (data['status'] === 200) {
        yield put({
          type: 'save',
          payload: {
            toastOpen: true,
            toastTxt: '设置成功',
            toastIcon: 'check-circle',
          },
        });
      } else {
        yield put({
          type: 'save',
          payload: {
            toastOpen: true,
            toastTxt: '设置失败',
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
