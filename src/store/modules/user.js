
import router from '@/router'
import * as Sentry from "@sentry/browser";



const state = { 
  accessToken:undefined,
  refreshToken:undefined,
  authorization:undefined
}

const getters = {
  isUserLoggedIn(state){
    if(state.accessToken!=undefined&&state.accessToken!=undefined&&state.authorization!=undefined)
      return true
    return false
  },  
  getAccessToken: (state) => state.accessToken,
  getRefreshToken: (state) => state.refreshToken,
  getAuthorization: (state) => state.authorization
}

const actions = {
  async logOutUser({commit}){  
    commit('setAccessToken',undefined) 
    commit('setRefreshToken',undefined)  
    commit('setAuthorization',undefined)  
    Sentry.configureScope(scope => scope.setUser(null));  
    router.push("/login") 
}
}

const mutations = {  
  setAccessToken: (state,accessToken) => (
    state.accessToken = accessToken
  ),
  setRefreshToken(state,refreshToken){
    state.refreshToken = refreshToken
    Sentry.setUser({"refreshToken": refreshToken })
  },
  setAuthorization(state,authorization){
    state.authorization = authorization
    Sentry.setUser({"authorization": authorization })
  }
}

export default {
    state,  
    getters,
    actions,
    mutations
  };



