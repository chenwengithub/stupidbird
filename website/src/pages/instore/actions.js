import { createAction } from 'redux-actions';

export const submit = createAction('instore/submit');
export const setVisibleCreateForm = createAction('instore/setVisibleCreateForm');
export const setVisibleUpdateForm = createAction('instore/setVisibleUpdateForm');
export const fetchToday = createAction('instore/fetchToday');
export const fetchDetail = createAction('instore/fetchDetail');

