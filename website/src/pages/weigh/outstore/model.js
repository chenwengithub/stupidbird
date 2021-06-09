import {
  add,
  query,
  remove,
  update,
  queryTruck,
  querySteelPlant,
  queryIntermediary,
} from './service';

const WeighInstoreModel = {
  namespace: 'weigh_outstore',
  state: {
    weight: 0,
    current: null,
    visible_gross_weight: false,
    visible_gross_weight_edit: false,
    visible_body_weight: false,
    loading_list_index: '',
    list: [],
    history: [],
    options_steel_plant: [],
    options_truck: [],
    options_intermediary: [],
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
    setOptionsSteelPlant(state, { payload }) {
      const options = [];
      payload.forEach((item) => {
        options.push({ label: item.name, value: item.id });
      });
      return { ...state, options_steel_plant: options };
    },
    setOptionsTruck(state, { payload }) {
      const options = [];
      payload.forEach((item) => {
        options.push({ label: item.car_number, value: item.id });
      });

      return { ...state, options_truck: options };
    },
    setOptionsIntermediary(state, { payload }) {
      const options = [];
      payload.forEach((item) => {
        options.push({ label: item.name, value: item.id });
      });

      return { ...state, options_intermediary: options };
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

    *fetchTruck({ payload }, { call, put }) {
      const response = yield call(queryTruck, payload);
      yield put({
        type: 'setOptionsTruck',
        payload: response ? response.data : [],
      });
    },

    *fetchSteelPlant({ payload }, { call, put }) {
      const response = yield call(querySteelPlant, payload);
      yield put({
        type: 'setOptionsSteelPlant',
        payload: response ? response.data : [],
      });
    },

    *fetchIntermediary({ payload }, { call, put }) {
      const response = yield call(queryIntermediary, payload);
      yield put({
        type: 'setOptionsIntermediary',
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
