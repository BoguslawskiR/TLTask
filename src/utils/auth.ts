export function getAuth() {
  if (window !== undefined) {
    const token = window.localStorage.getItem('token');
    return token;
  }
  return null;
}

export function setAuth(token: string) {
  if (window !== undefined) {
    const user = window.localStorage.setItem('token', token);
  }
}