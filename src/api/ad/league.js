import fetch from 'utils/fetch'
import { deleteEmptyProperty } from 'utils/filter'
import { deepCoyp } from 'utils/copy'


export function leagueListNoPage() {
    const params = new FormData()
    params.append('search', '{}')
    params.append('page', 1)
    params.append('size', 1000)
    return fetch({
        url: 'xqh/ad/league/search',
        method: 'post',
        data: params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
}
