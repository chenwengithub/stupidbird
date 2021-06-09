import { add, remove, update, queryTruck, querySteelPlant, queryIntermediary } from './service';
const OutstoreModel = {
  namespace: 'outstore',
  state: {
    current: null,
    visible_update_form: false,
    visible_opposite_form: false,
    visible_payment_form: false,
    visible_create_form: false,
    options_steel_plant: [],
    options_truck: [],
    options_intermediary: [],
  },
  reducers: {
    setVisibleCreateForm(state, { payload }) {
      return { ...state, visible_create_form: payload };
    },
    setVisibleUpdateForm(state, { payload: { visible, current } }) {
      return { ...state, visible_update_form: visible, current };
    },
    setVisibleOppositeForm(state, { payload: { visible, current } }) {
      return { ...state, visible_opposite_form: visible, current };
    },
    setVisiblePaymentForm(state, { payload: { visible, current } }) {
      return { ...state, visible_payment_form: visible, current };
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
  },
  effects: {
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
        } else {
          const response = yield call(update, payload); // update
        }
      } else {
        const response = yield call(add, payload); // add
      }
    },
  },
};
export default OutstoreModel;
