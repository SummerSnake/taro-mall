import orderList from './service';

export default {
  namespace: 'orderList',
  state: {
    fetchData: {},
  },
  effects: {
    *load(_, { call, put }) {
      const data = yield call(orderList, {});
      if (data.code === 0) {
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
