/* eslint-disable camelcase */
import { post, get } from '@/http/request'

export function getFile(parems) {
  return get('/api/file', parems)
}

export function postFileId(id, parems) {
  return post(`/api/file/${id}`, parems)
}
