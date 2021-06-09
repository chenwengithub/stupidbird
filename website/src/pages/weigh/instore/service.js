import request from 'umi-request';
import api from '@/utils/api';

const url = api.weighinstore;
export async function query(params) {
  return request(url, {
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
  return request(url, {
    method: 'POST',
    data: { id: obj.id, data: obj, method: 'update' },
  });
}
