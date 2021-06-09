import request from 'umi-request';
import api from '@/utils/api';

const url = api.weighoutstore;
export async function query(params) {
  return request(url, {
    params,
  });
}
export async function queryTruck(params) {
  return request(api.truck, {
    params,
  });
}
export async function querySteelPlant(params) {
  return request(api.steelplant, {
    params,
  });
}
export async function queryIntermediary(params) {
  return request(api.intermediary, {
    params,
  });
}
export async function remove(params) {
  return request(url, {
    method: 'POST',
    data: { id: params.id, method: 'delete' },
  });
}
export async function add(params) {
  return request(url, {
    method: 'POST',
    data: { data: { ...params }, method: 'post' },
  });
}
export async function update(obj) {
  let _url = url;
  switch (obj.action) {
    case 'update':
      _url = url;
      break;
    case 'opposite':
      _url = url + 'opposite';
      break;
    case 'payment':
      _url = url + 'payment';
      break;
  }
  return request(_url, {
    method: 'POST',
    data: { id: obj.id, data: obj, method: 'update' },
  });
}
