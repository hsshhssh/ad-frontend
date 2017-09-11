import fetch from 'utils/fetch'
import { deleteEmptyProperty } from 'utils/filter'
import { deepCoyp } from 'utils/copy'

export function appMediaList(search, page, size) {
    let searchCopy = deepCoyp(search)
    deleteEmptyProperty(searchCopy)

    let params = new FormData()
    params.append('search', JSON.stringify(searchCopy))
    params.append('page', page)
    params.append('size', size)
    return fetch({
        url: '/xqh/ad/appMedia/search',
        method: 'post',
        data: params,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    })
}

export function appMediaCreate(body) {
    const bodyCopy = deepCoyp(body)
    return fetch({
        url: '/xqh/ad/appMedia/',
        method: 'put',
        data: bodyCopy
    })
}

export function appMediaUpdate(body) {
    const bodyCopy = deepCoyp(body)
    return fetch({
        url: '/xqh/ad/appMedia/',
        method: 'post',
        data: bodyCopy
    })
}

export function getTestUrl(id) {
    return fetch({
        url: '/xqh/ad/appMedia/test/url?id=' + id,
        method: 'get'
    })
}