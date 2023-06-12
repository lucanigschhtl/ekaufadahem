
import BackendConnection from '../../services/authorizedapi';

const state = {
  orders : [],
  isLoading: false,
}

const getters = {
  orders: (state) => state.orders,
  ordersIsLoading:(state)=>state.isLoading,
  getOrder(state,orderId){
    var order = state.orders.find(element=>element.id==orderId)
    if(order != undefined)
      return order
    
    return null

  }

}

const actions = {

  async fetchOrders({ commit,state }) {   
    state.isLoading = true

    var response = await BackendConnection.get("orders/me/")
    if (response.status != 200)
        return;
  
    // var activeOrders = new Array()
    // var archivedOrders = new Array()

    // response.data.forEach(order => {
    //     if(order.status.rank<4)
    //         activeOrders.push(order)        
    //     else
    //         archivedOrders.push(order)        
    // });
    commit('_setOrders', response.data)
    state.isLoading = false   
  }  
}
const mutations = {
  _setOrders: (state, orders) => (  
    state.orders = orders   
  )
}

export default {
    state,  
    getters,
    actions,
    mutations
  };



