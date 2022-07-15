/* eslint-disable camelcase */
import { post, get } from '@/http/request'

export function getFile(parems) {
  return get('/api/file', parems)
}

export function postFileCreatedir(parems) {
  return post(`/api/file/create-dir`, parems)
}

export function postFileId(id,parems) {
  return post(`/api/file/${id}`, parems)
}

export function postFileUpload(parems) {
  return post(`/api/file/upload`, parems)
}

export function postFileDownloadUrl(parems) {
  return post(`/api/file/download-url`, parems)
}
