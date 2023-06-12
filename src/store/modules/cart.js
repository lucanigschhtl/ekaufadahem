import BackendConnection from '../../services/authorizedapi';


const state = {
  orderItems: [],
  isShown:false,
}

const getters = {
  allCartItems: (state) => state.cartItems,
  isShown: (state) => state.isShown,
  cartIsLoading:(state)=>state.isLoading,
  numItems:(state)=>{  
    let counter = 0
    var tempCartItems = [...state.cartItems]
    tempCartItems.forEach(cartItem => {counter+= cartItem.amount});
    return counter
  },
  deactivatedCartItems: (state)=>{
    var deactivatedProducts = []
    for(let cartItem of state.cartItems){
        if(cartItem.product.activated!=1)
            deactivatedProducts.push(cartItem)  
    }   
    return deactivatedProducts
  }
}

const actions = {
    async fetchCartItems({commit,state}){
        state.isLoading=true       
        var response =await BackendConnection.get("/me/cart") 
        if(response.status==200)
          state.isLoading=false
        commit('_setCartItems',response.data)       
  },
  async addProduct({ commit,state,dispatch }, product) {

    var cartItem = state.cartItems.find(cartItem => cartItem.product.id == product.id)
    if (cartItem == undefined)
    {
        var response = await BackendConnection.post("/me/cart",{ product: product.id, amount: 1 })  
        if (response.status != 200)
          return
      
        commit("_addToastMessage", {
              title: product.name + " wurde zum Warenkorb hinzugefügt", options: {
            noHoverPause: true,
            variant: "success",
            autoHideDelay: 100,
            noCloseButton: true
          }
        })
        commit('_addCartItem', response.data)
        return
    }
       
    
     //If Product is already in the cart only update the amount
    dispatch('updateCartItemAmount', { newAmount: cartItem.amount + 1, cartItem: cartItem })
    
    commit("_addToastMessage", {
            title: `${cartItem.amount + 1} ${product.name} sind jetzt im Warenkorb`, options: {
          noHoverPause: true,
          variant: "primary",
          autoHideDelay: 100,
          noCloseButton: true
        }
      })
  },
  
  async updateCartItemAmount({ state,dispatch }, { newAmount, cartItem }) {
      //Setting Variables
      var tempCartItems = [...state.cartItems]
      const cartItemIndex = tempCartItems.indexOf(cartItem)
      newAmount = parseInt(newAmount)
      
      //If Amount of Cartitem is null it's getting deleted
      if (newAmount < 1 || isNaN(newAmount)) {               
        dispatch('removeCartItem', tempCartItems[cartItemIndex])
        return       
      }           
     
      //Updating Amount when not deleted because of null value
      var response = await BackendConnection.put("/me/cart/" + tempCartItems[cartItemIndex].id,{"newAmount": newAmount} )
      if(response.status!=200)
      {
        console.log("Sync Error")
        return
      }

      tempCartItems[cartItemIndex].amount = newAmount
    }, 
    
  async removeCartItem({ state,commit },  cartItem ) {
    var tempCartItems = [...state.cartItems]
    var response = await BackendConnection.delete("/me/cart/"+cartItem.id)
    if (response.status != 200)
      return
    commit('_removeCartItem',tempCartItems.indexOf(cartItem))
  }
}

const mutations = {
    _addCartItem:(state,cartItem)=>(state.cartItems.push(cartItem)),
    _setCartItems:(state,cartItems)=>(state.cartItems=cartItems),
    _setShowState:(state,isShown)=>(state.isShown=isShown),   
    _setLoadingState: (state, isLoading) => (state.isLoading = isLoading),
    _removeCartItem :(state,cartItemIndex)=>(state.cartItems.splice(cartItemIndex,1))
  }


export default {
    state,
    getters,
    actions,
    mutations
  };



