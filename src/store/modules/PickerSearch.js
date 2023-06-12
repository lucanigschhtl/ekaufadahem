import BackendConnection from '../../services/authorizedapi';

const state = {
  orders: [],
  customers:[],
  isLoading: false,
  searchText: "",
  isCreateCustomerModalShown:false,
  isCreateEmptyOrderModalShowState:false
}

const getters = {
    isCreateCustomerModalShown: (state) => state.isCreateCustomerModalShown,
    isCreateEmptyOrderModalShowState: (state) => state.isCreateEmptyOrderModalShowState,
    isPickerSearchLoading:(state)=>state.isLoading,
    pickerSearchOrders:(state)=>state.orders,
    pickerSearchCustomers:(state)=>state.customers
    
}


const actions = {
    async fetchPickerSearch({state},searchText) {
        state.isLoading = true   

        if(searchText==undefined)
            searchText=""

        state.searchText = searchText
       
        var response = await BackendConnection.post("/orders/search/",{searchString:state.searchText})
        
        state.isLoading = false

        if (response.status != 200)
            return
            
        state.orders = response.data.orders
        state.customers = response.data.customers
       
      }
     
}

const mutations = {
    setCreateCustomerModalShowState:(state,showState)=>(state.isCreateCustomerModalShown=showState),
    setCreateEmptyOrderModalShowState:(state,showState)=>(state.isCreateEmptyOrderModalShowState=showState)
}

export default {
    state,  
    getters,
    actions,
    mutations
  };
