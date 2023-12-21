import { AuthProvider } from "react-admin";
import { Authentificator } from '@cipher-health/sdk'

const authentificator = new Authentificator({
  mode: 'ADMIN'
});

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    try {
      await authentificator.login({
        email: username,
        password
      })
      return Promise.resolve();
    } catch (e) {
      return Promise.reject((e as Error).message);
    }
  },
  checkAuth: () => {
    return authentificator.isConnected
      ? Promise.resolve()
      : Promise.reject('Not authenticated');
  },
  getPermissions: () => {
    console.log('getPermissions')
    // Required for the authentication to work
    return Promise.resolve();
  },
  checkError: () => {
    return Promise.resolve();
  },
  getIdentity: async () => {
    try {
      const me = await authentificator.me()

      const fullName = me.profile
        ? `${me.profile.firstName} ${me.profile.lastName}`
        : me.email.split('@')[0]

      return Promise.resolve({
        id: me.id,
        fullName: fullName,
        avatar: "https://www.gravatar.com/"
      })
    } catch (e) {
      return Promise.reject((e as Error).message);
    }
  },
  logout: async () => {
    try {
      await authentificator.logout()
      return Promise.resolve();
    } catch (e) {
      return Promise.reject();
    }
  },
}