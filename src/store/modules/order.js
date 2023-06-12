import BackendConnection from '../../services/authorizedapi';

const state = {
  activeOrderId: undefined,
  isShown:false,  
  isLoading:false,
  orderData:undefined
}

const getters = {
  activeOrder: (state) => state.orderData,
  isOrderShown: (state) => state.isShown, 
  isOrderLoading: (state) => state.isLoading 
}

const actions = { 
  async showCustomerOrder({state},orderId){
    state.isShown=true
    state.isLoading=true
    state.activeOrderId = orderId
    
    if(state.activeOrderId == null || state.activeOrderId == undefined)
      return  

    var response = await BackendConnection.get("/orders/"+state.activeOrderId)
    if(response.status!=200)
      return
    
    state.orderData = response.data 
    state.isLoading=false
  }
}

const mutations = {
    _setOrderShowState:(state,isShown)=>(state.isShown=isShown)    
    }


export default {
    state,
    getters,
    actions,
    mutations
  };



