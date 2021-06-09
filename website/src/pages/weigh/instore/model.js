import { add, query, remove, update } from './service';
const WeighInstoreModel = {
  namespace:'weigh_instore',
  state: {
    weight: 0,
    current: null,
    visible_gross_weight: false,
    visible_gross_weight_edit: false,
    visible_body_weight: false,
    loading_list_index: '',
    list: [],
    history: [],
  },
  reducers: {
    queryList(state, { payload: list }) {
      return { ...state, list};
    },
    appendList(state, { payload }) {
      return { ...state, list: [payload, ...state.list] };
    },
    subList(state, { payload }) {
      const list = state.list;
      list.splice(
        list.findIndex((item) => item.id === payload),
        1,
      );
      return { ...state, list };
    },
    updateList(state) {
      return state;
    },
    setVisibleGW(state, { payload }) {
      return { ...state, visible_gross_weight: payload };
    },
    setVisibleGWEdit(state, { payload: { visible, current } }) {
      return { ...state, visible_gross_weight_edit: visible, current };
    },
    setVisibleBW(state, { payload: { visible, current } }) {
      return { ...state, visible_body_weight: visible, current };
    },
    setLoadingListIndex(state, { payload }) {
      return { ...state, loading_list_index: payload };
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(query, payload);
      yield put({
        type: 'queryList',
        payload: response ? response.data : [],
      });
    },

    *submit({ payload }, { call, put }) {
      if (payload.id) {
        if (Object.keys(payload).length === 1) {
          yield call(remove, payload); // delete
          yield put({ type: 'subList', payload: payload.id });
        } else {
          const response = yield call(update, payload); // update
          if ('new' !== response.status) {
            yield put({ type: 'subList', payload: payload.id });
          } else {
            yield put({ type: 'updateList' });
          }
        }
      } else {
        const response = yield call(add, payload); // add
        yield put({ type: 'appendList', payload: response });
      }
    },
  },
};
export default WeighInstoreModel;
