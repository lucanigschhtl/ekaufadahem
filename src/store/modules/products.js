import BackendConnection from '../../services/authorizedapi';

const state = {
  products: [],
  isLoading: false,
  pageNumber: 1,
  searchText: "",
  endReached:false,
  noResults:false

}

const getters = {
  allProducts: (state) => state.products,
  productsIsLoading:(state)=>state.isLoading,
  isEndReached:(state)=>state.endReached,  
  noResults:(state)=>state.noResults
}

const actions = {

  async searchProducts({state,dispatch},searchText) {
    state.searchText = searchText
    state.pageNumber = 1
    state.endReached=false
    state.noResults=false
    state.products=[]
    dispatch('fetchProducts')
  },
  async fetchProducts({ commit,state }) {
    //check if it is already fetching
    if(state.isLoading)
      return

    //only show skeleton when the first pageload is made
    if(state.pageNumber==1)
      state.isLoading = true
  
    if (state.endReached)
        return
   
    var response = await BackendConnection.get("/products?searchText=" + state.searchText + "&page=" + state.pageNumber)

    if (response.status != 200)
        return;
        
    //check if end is reached
    if (response.data.length==0)
        state.endReached = true

    //check if nothing was found
    if (response.data.length==0 && state.pageNumber==1)
        state.noResults = true


    commit('_appendProducts', response.data)

    //only show skeleton when the first pageload is made
    if(state.pageNumber==1)   
      state.isLoading = false

    state.pageNumber++
    
  }  
}
const mutations = {
  _setProducts: (state, products) => (  
    state.products = products   
  ),
  _appendProducts: (state, newProducts) => (  
    state.products.push(...newProducts)   
  )
}

export default {
    state,  
    getters,
    actions,
    mutations
  };



