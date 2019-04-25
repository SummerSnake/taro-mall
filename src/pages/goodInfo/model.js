import goodsList from './service';

export default {
  namespace: 'goodInfo',
  state: {
    goodInfo: {},
    goodId: 0,
  },
  effects: {
    *load(_, { call, put, select }) {
      const { goodId } = yield select(state => state.goodInfo);
      const data = yield call(goodsList, {});
      if (data['status'] === 200) {
        if (Array.isArray(data.data) && data.data.length > 0) {
          const list = data.data;
          const info = list.filter(item => item.id === goodId);
          yield put({
            type: 'save',
            payload: {
              goodInfo: info[0],
            },
          });
        }
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
