import { createAction } from 'redux-actions';

export const fetch = createAction('weigh_outstore/fetch');
export const submit = createAction('weigh_outstore/submit');
export const setVisibleGW = createAction('weigh_outstore/setVisibleGW');
export const setVisibleGWEdit = createAction('weigh_outstore/setVisibleGWEdit');
export const setVisibleBW = createAction('weigh_outstore/setVisibleBW');
export const setLoadingListIndex = createAction('weigh_outstore/setLoadingListIndex');
export const fetchSteelPlant = createAction('weigh_outstore/fetchSteelPlant');
export const fetchTruck = createAction('weigh_outstore/fetchTruck');
export const fetchIntermediary = createAction('weigh_outstore/fetchIntermediary');
