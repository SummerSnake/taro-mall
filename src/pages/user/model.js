import user from './service';

export default {
  namespace: 'user',
  state: {
    fetchData: {},
  },
  effects: {
    *load(_, { call, put }) {
      const data = yield call(user, {});
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
