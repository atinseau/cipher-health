import { AuthProvider } from "react-admin";
import { authentificator } from "../auth";

export const authProvider: AuthProvider = {
  login: async () => {
    // Do nothing
    // login is handled by the Signin custom component
  },
  checkAuth: async () => {
    const isConnected = await authentificator.isConnected()
    return isConnected
      ? Promise.resolve()
      : Promise.reject();
  },
  getPermissions: async () => {
    // console.log('getPermissions')
    try {
      if (!await authentificator.isConnected()) {
        return Promise.resolve([]);
      }

      const me = await authentificator.me()
      return Promise.resolve(me.admin?.permissions || [])
    } catch (e) {
      return Promise.resolve([]);
    }
  },
  checkError: () => {
    // not implemented yet
    // console.log('checkError')
    return Promise.resolve();
  },
  getIdentity: async () => {
    // console.log('getIdentity')
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
    // console.log('logout')
    try {
      await authentificator.logout()
      return Promise.resolve();
    } catch (e) {
      return Promise.reject();
    }
  },
}