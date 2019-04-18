import * as categoryApi from './service';

export default {
  namespace: 'category',
  state: {
    goodsList: [],
    classifyList: [],
    filters: {},
    pagination: {
      current: 1,
      pageSize: 5,
    },
  },
  effects: {
    * load(_, { call, put, select }) {
      const { goodsList, filters, pagination } = yield select(state => state.category);
      const data = yield call(categoryApi.category, {
        filters,
        pagination,
      });
      if (data['status'] === 200) {
        if (Array.isArray(data.data) && data.data.length > 0) {
          yield put({
            type: 'save',
            payload: {
              goodsList: pagination.current > 1 ? [...goodsList, ...data.data] : data.data,
            },
          });
        }
      }
    },

    * loadClassify(_, { call, put }) {
      const data = yield call(categoryApi.classify, {});
      if (data['status'] === 200) {
        if (Array.isArray(data.data) && data.data.length > 0) {
          yield put({
            type: 'save',
            payload: {
              classifyList: data.data,
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
