import axios from 'axios';
import { Service } from 'axios-middleware';
import store from '../store/index.js';
import router from '../router/index.js';
import { HTTP } from './api.js'; 
// import * as Sentry from "@sentry/browser";

const BackendConnection = axios.create({
  baseURL: process.env.VUE_APP_BACKEND_SERVER,
  headers: {'Content-Type': 'application/json'},
  validateStatus: function (status) {      
      return status < 500; 
    }
})

const service = new Service(BackendConnection);

service.register({
  onRequest(config) {    
    return{
      ...config,
      headers:{
        Authorization: "Bearer "+ store.getters.getAccessToken,
        ...config.headers
      }
    }    
    
  },  
  async onResponse(response) {
    if(response.status==440){
      await renewAccessToken()
      if(!store.getters.isUserLoggedIn)
      {        
        return response
      }
      var result =  BackendConnection({
        ...response,      
        headers: {
          ...response.headers,
          Authorization: "Bearer "+ store.getters.getAccessToken,
        }              
      }) 
      
      return result
    }
   
    return response;
  }
});

async function renewAccessToken(){
  debugger;
  var response  = await HTTP.get("user/token",{refreshToken:store.getters.getRefreshToken})
  
  if(response.status!=200)
  {
    store.dispatch('logOutUser')    
    return
  }

  store.commit('setAccessToken',response.data.accessToken)
  router.go(router.currentRoute)
  console.log("new AccessToken saved")
}

export default BackendConnection