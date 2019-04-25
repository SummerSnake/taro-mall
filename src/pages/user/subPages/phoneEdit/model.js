import Taro from '@tarojs/taro';
import { delayFunc } from '@/utils/api';
import phoneEdit from './service';

export default {
  namespace: 'phoneEdit',
  state: {
    oldPhone: '',
    newPhone: '',
    newSmsCode: '',
    toastOpen: false,
    toastTxt: '',
    toastIcon: '',
  },
  effects: {
    *submit(_, { call, put, select }) {
      const { oldPhone, newPhone, newSmsCode } = yield select(state => state.phoneEdit);
      const data = yield call(phoneEdit, {
        oldPhone,
        newPhone,
        newSmsCode,
      });
      if (data['status'] === 200) {
        yield put({
          type: 'save',
          payload: {
            toastOpen: true,
            toastTxt: '设置成功',
            toastIcon: 'check-circle',
          },
        });
      } else {
        yield put({
          type: 'save',
          payload: {
            toastOpen: true,
            toastTxt: '设置失败',
            toastIcon: 'close-circle',
          },
        });
      }
      yield call(delayFunc, 2000);
      yield put({
        type: 'save',
        payload: {
          toastOpen: false,
        },
      });
      Taro.navigateBack();
    },

    *sendSmsCode(_, { call, put, select }) {
      const { newPhone, newSmsCode } = yield select(state => state.phoneEdit);
      const data = yield call(phoneEdit, {
        newPhone,
        newSmsCode,
      });
      if (data['status'] === 200) {
        yield put({
          type: 'save',
          payload: {
            toastOpen: true,
            toastTxt: '验证码发送成功',
            toastIcon: 'check-circle',
          },
        });
      } else {
        yield put({
          type: 'save',
          payload: {
            toastOpen: true,
            toastTxt: '验证码发送失败',
            toastIcon: 'close-circle',
          },
        });
      }
      yield call(delayFunc, 2000);
      yield put({
        type: 'save',
        payload: {
          toastOpen: false,
        },
      });
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
