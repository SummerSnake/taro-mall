import userEdit from './service';

export default {
  namespace: 'userEdit',
  state: {
    appellation: '',
    birth: '',
  },
  effects: {
    * load(_, { call, put, select }) {
      const { appellation, birth } = yield select(state => state.userEdit);
      const data = yield call(userEdit, {
        appellation,
        birth,
      });
      if (data['status'] === 200) {
        yield put({
          type: 'save',
          payload: {
            appellation: data.data.appellation,
            birth: data.data.birth,
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
