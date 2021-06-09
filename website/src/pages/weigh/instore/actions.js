import {createAction} from "redux-actions"

export const fetch =createAction("weigh_instore/fetch")
export const submit =createAction("weigh_instore/submit")
export const setVisibleGW =createAction("weigh_instore/setVisibleGW")
export const setVisibleGWEdit =createAction("weigh_instore/setVisibleGWEdit")
export const setVisibleBW =createAction("weigh_instore/setVisibleBW")
export const setLoadingListIndex =createAction("weigh_instore/setLoadingListIndex")