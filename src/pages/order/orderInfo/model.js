import orderDetail from './service';

export default {
  namespace: 'orderDetail',
  state: {
    fetchData: {
      headerInfo: {},
      goodsList: [],
      couponInfo: {},
    },
  },
  effects: {
    *load(_, { call, put }) {
      const data = yield call(orderDetail, {});
      if (data['status'] === 200) {
        yield put({
          type: 'save',
          payload: {
            fetchData: data.data,
          },
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
