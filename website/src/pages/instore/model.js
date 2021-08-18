import { add, remove, update, queryToday, queryDetail } from './service';
const InstoreModel = {
  namespace: 'instore',
  state: {
    current: null,
    detail: null,
    visible_create_form: false,
    visible_update_form: false,
    today: { total: 0, weight: 0, paid: 0 },
  },
  reducers: {
    setVisibleCreateForm(state, { payload }) {
      return { ...state, visible_create_form: payload };
    },
    setVisibleUpdateForm(state, { payload: { visible, current } }) {
      return { ...state, visible_update_form: visible, current };
    },
    setToday(state, { payload:{data} }) {
      let total = data.length;
      let weight = 0;
      let paid = 0;
      data.forEach((item) => {
        weight += item.legal_weight;
        paid += item.actual_payment;
      });
      return { ...state, today: { total, weight, paid } };
    },
    setDetail(
      state,
      {
        payload: {
          response: { data },
          payload,
        },
      },
    ) {
      const _obj = payload;
      _obj.payments = data;
      return { ...state, detail: _obj };
    },
  },
  effects: {
    *fetchToday({ payload }, { call, put }) {
      const response = yield call(queryToday);
      yield put({ type: 'setToday', payload: response });
    },
    *submit({ payload }, { call, put }) {
      if (payload.id) {
        if (Object.keys(payload).length === 1) {
          yield call(remove, payload); // delete
        } else {
          const response = yield call(update, payload); // update
        }
      } else {
        const response = yield call(add, payload); // add
      }
    },
  },
};
export default InstoreModel;
