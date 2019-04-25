import Taro from '@tarojs/taro';
import { delayFunc } from '@/utils/api';
import invoiceEdit from './service';

export default {
  namespace: 'invoiceEdit',
  state: {
    params: {
      company: '',
      taxpayer: '',
      regAddr: '',
      regPhone: '',
      bank: '',
      bankAccount: '',
    },
    toastOpen: false,
    toastTxt: '',
    toastIcon: '',
  },
  effects: {
    *load(_, { call, put }) {
      const data = yield call(invoiceEdit, {});
      if (data['status'] === 200) {
        yield put({
          type: 'save',
          payload: {
            params: { ...data.data },
          },
        });
      }
    },
    *submit(_, { call, put, select }) {
      const { params } = yield select(state => state.invoiceEdit);
      const data = yield call(invoiceEdit, {
        ...params,
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
