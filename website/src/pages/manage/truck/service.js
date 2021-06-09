import request from '@/utils/request';
import api from '@/utils/api'

export async function query(params) {
  return request(api.truck, {
    params,
  });
}
export async function remove(params) {
  const { key } = params;
  return request(api.truck, {
    method: 'POST',
    data: { key, method: 'delete' },
  });
}
export async function add(params) {
  return request(api.truck, {
    method: 'POST',
    data: { data: params, method: 'post' },
  });
}
export async function update(params) {
  return request(api.truck, {
    method: 'POST',
    data: { data: params, key: params.key, method: 'update' },
  });
}

