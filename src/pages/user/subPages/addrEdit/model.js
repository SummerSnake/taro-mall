import Taro from '@tarojs/taro';
import { delayFunc } from '@/utils/api';
import addrEdit from './service';

export default {
  namespace: 'addrEdit',
  state: {
    consignee: '',
    phone: '',
    region: [],
    detail: '',
    checkedVal: false,
    toastOpen: false,
    toastTxt: '',
    toastIcon: '',
  },
  effects: {
    * submit(_, { call, put, select }) {
      const { consignee, phone, region, detail, checkedVal } = yield select(state => state.addrEdit);
      const data = yield call(addrEdit, {
        consigneeName: consignee,
        consigneePhone: phone,
        province: region[0],
        city: region[1],
        area: region[2],
        detailedAddress: detail,
        type: checkedVal ? 1 : 0,
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
          }
        });
      }
      yield call(delayFunc, 2000);
      yield put({
        type: 'save',
        payload: {
          toastOpen: false,
        }
      });
      Taro.redirectTo({
        url: '/pages/user/subPages/addrPage/index',
      });
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
