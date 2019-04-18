import coupon from './service';

export default {
  namespace: 'coupon',
  state: {
    couponList: [],
    current: 0,
  },
  effects: {
    * load(_, { call, put, select }) {
      const { current } = yield select(state => state.coupon);
      const data = yield call(coupon, {});
      const list = current === 0 ? data.data.filter(item => new Date() < new Date(Date.parse(item.endDate)))
        : data.data.filter(item => new Date() > new Date(Date.parse(item.endDate)));
      if (data['status'] === 200) {
        yield put({
          type: 'save',
          payload: {
            couponList: list,
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
