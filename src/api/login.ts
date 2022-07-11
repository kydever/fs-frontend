/* eslint-disable camelcase */
import { post } from '@/http/request'

export function login(params) {
  return post('/login', params)
}

export function postLoginCode(params) {
  return post('api/oauth/login', params)
}

