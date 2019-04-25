import homepage from './service';

export default {
  namespace: 'home',
  state: {
    imgList: [],
    iconList: [],
    topCardObj: {},
    midCardObj: {},
    botCardObj: {},
  },
  effects: {
    *load(_, { call, put }) {
      const data = yield call(homepage, {});
      if (data['status'] === 200) {
        yield put({
          type: 'save',
          payload: {
            imgList: data.data.imgList,
            iconList: data.data.iconList,
            topCardObj: data.data.topCardObj,
            midCardObj: data.data.midCardObj,
            botCardObj: data.data.botCardObj,
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
