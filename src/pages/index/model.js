import homepage from './service';

export default {
  namespace: 'home',
  state: {
    imgList: [],
  },
  effects: {
    *load(_, { call, put }) {
      const data = yield call(homepage, {});
      if (data.code === 0) {
        yield put({
          type: 'save',
          payload: {
            imgList: data.data.rotationList,
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
