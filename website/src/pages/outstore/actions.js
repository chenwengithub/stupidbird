import { createAction } from 'redux-actions';

export const submit = createAction('outstore/submit');
export const setVisibleCreateForm = createAction('outstore/setVisibleCreateForm');
export const setVisibleUpdateForm = createAction('outstore/setVisibleUpdateForm');
export const setVisibleOppositeForm = createAction('outstore/setVisibleOppositeForm');
export const setVisiblePaymentForm = createAction('outstore/setVisiblePaymentForm');
export const fetchSteelPlant = createAction('outstore/fetchSteelPlant');
export const fetchTruck = createAction('outstore/fetchTruck');
export const fetchIntermediary = createAction('outstore/fetchIntermediary');

