
const state = {
    isLoggedIn:false
  
  }
  
  const getters = {
    isUserLoggedIn: (state) => state.isLoggedIn,
  }
  
  const actions = {
    
  }
  const mutations = {
    setUserLoggedIn: (state, userState) => (  
      state.isLoggedIn = userState 
    )
   
  }
  
  export default {
      state,  
      getters,
      actions,
      mutations
    };
  
  
  
  