import Cookies from 'js-cookie'

const TokenKey = 'KyOkrToken'

export function getToken(): string {
  return Cookies.get(TokenKey) || ''
}

export function setToken(token: string): void {
  Cookies.set(TokenKey, token)
}

export function removeToken(): void {
  Cookies.remove(TokenKey)
}

export function getCookies(name): any {
  return JSON.parse(Cookies.get(name) || '{}')
}

export function setCookies(name, data: any): void {
  Cookies.set(name, JSON.stringify(data))
}

export function removeCookies(name): void {
  Cookies.remove(name)
}
