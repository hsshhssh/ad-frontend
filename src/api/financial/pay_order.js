import fetch from 'utils/fetch';
import {deleteEmptyProperty} from 'utils/filter';
import {deepCoyp} from 'utils/copy';

export function orderList(search, page, size) {
  // console.log(search)
  let searchCopy = deepCoyp(search)
  deleteEmptyProperty(searchCopy)
  console.log(search)
  let params = new FormData();
  params.append('search', JSON.stringify(searchCopy));
  params.append('page', page);
  params.append('size', size);
  
  return fetch({
    url: '/xqh/financial/pay/order/list',
    method: 'post',
    data: params,
    headers:{'Content-Type':'application/x-www-form-urlencoded'}
  });
}