import { delayFunc } from '@/utils/api';
import addrPage from './service';

export default {
  namespace: 'addrPage',
  state: {
    id: 0,
    addrList: [],
    toastOpen: false,
  },
  effects: {
    * load(_, { call, put }) {
      const data = yield call(addrPage);
      if (data['status'] === 200) {
        if (Array.isArray(data.data) && data.data.length > 0) {
          yield put({
            type: 'save',
            payload: {
              addrList: data.data,
            },
          });
        }
      }
    },
    * delete(_, { call, put, select }) {
      const { id } = yield select(state => state.addrPage);
      const data = yield call(addrPage, {
        id,
      });
      if (data['status'] === 200) {
        if (Array.isArray(data.data) && data.data.length > 0) {
          const list = data.data.filter(item => item.id !== id);
          yield put({
            type: 'save',
            payload: {
              addrList: list,
            },
          });
        }
        // 删除成功显示 toast
        yield put({
          type: 'save',
          payload: {
            toastOpen: true,
          }
        });
        yield call(delayFunc, 2000);
        yield put({
          type: 'save',
          payload: {
            toastOpen: false,
          }
        });
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
