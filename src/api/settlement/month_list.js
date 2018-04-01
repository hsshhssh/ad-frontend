/* eslint-disable prefer-const */
import fetch from 'utils/fetch';
import {deleteEmptyProperty} from 'utils/filter';
import {deepCoyp} from 'utils/copy';

export function monthSettlementSearch(search, page, size) {
    let searchCopy = deepCoyp(search)
    deleteEmptyProperty(searchCopy)

    let params = new FormData()
    params.append('search', JSON.stringify(searchCopy))
    params.append('page', page)
    params.append('size', size)
    return fetch({
        url: 'xqh/ad/month/settlement/list',
        method: 'post',
        data: params,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    })
}

export function monthSettlementCreate(body) {
    let bodyCopy = deepCoyp(body)
    return fetch ({
        url: 'xqh/ad/month/settlement',
        method: 'put',
        data: bodyCopy
    });
}

export function monthSettlementUpdate(body) {
    let bodyCopy = deepCoyp(body)
    return fetch ({
        url: 'xqh/ad/month/settlement',
        method: 'post',
        data: bodyCopy
    });
}

export function monthSettlementDelete(body) {
    let bodyCopy = deepCoyp(body)
    return fetch ({
        url: 'xqh/ad/month/settlement/delete',
        method: 'post',
        data: bodyCopy
    });
}
