export default {
  namespace: 'common',
  state: {},

  effects: {},

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
