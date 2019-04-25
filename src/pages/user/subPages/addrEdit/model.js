import Taro from '@tarojs/taro';
import { delayFunc } from '@/utils/api';
import addrEdit from './service';

export default {
  namespace: 'addrEdit',
  state: {
    params: {
      consignee: '',
      phone: '',
      area: [],
      detailAddr: '',
      checkedVal: false,
    },
    toastOpen: false,
    toastTxt: '',
    toastIcon: '',
  },
  effects: {
    *submit(_, { call, put, select }) {
      const { params } = yield select(state => state.addrEdit);
      const data = yield call(addrEdit, {
        ...params,
        province: params.area[0],
        city: params.area[1],
        region: params.area[2],
        type: params.checkedVal ? 1 : 0,
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
