

  
  import BackendConnection from '../../services/authorizedapi';

  const state = {
    timeslot: null,
    comment:"",
    isLoading:false,  
    feedbackModalState:false,
    feedbackModalContent:"",
    orderingState:false,
    orderItems: [],
  }
  
  const getters = {
    getTimeslot: (state) => state.timeslot,
    getPaymentMethod: (state) =>state.paymentMethod,
    getComment: (state) => state.comment,
    inputIsValid: (state) => {
        if(state.timeslot==null)
        {
          return false
        }
        if(state.orderItems==null)
        {
          return false
        }
        if(state.orderItems.length==0)
        {
          return false
        }
        return true
    },   
    noDeactivatedProducts: (state) => state.noDeactivatedProducts,
    getFeedbackModalState:(state) => state.feedbackModalIsShown,
    getFeedbackModalContent:(state) => state.feedbackModalContent,
    getOrderingState:(state) => state.orderingState,
    getOrderItems:(state) => state.orderItems
  }
  
  const actions = {
      async placeOrder({state,dispatch}){
          state.isLoading=true       
          var response = await BackendConnection.post("/orders",{"selectedTimeslotId":state.timeslot,"note":state.comment,orderItems:state.orderItems}) 
          state.isLoading=false  

          if(response.status==442){ 
            dispatch("setFeedbackModalContent","Dein gewählter Timeslot ist nicht mehr verfügbar, lade die Seite neu wähle einen Neuen aus.")
            return
          }

          if(response.status!=201){
            dispatch("setFeedbackModalContent","Es ist ein Fehler aufgetreten, laden Sie die Seite neu und versuchen Sie es nochmal")
            return
          }

          dispatch("setOrderingState",true)    
         
         
    },
    setPaymentMethod({commit,state},paymentMethod){
      state.paymentMethod = paymentMethod
      commit("validateInputs")
    },
    setTimeSlot({commit,state},timeSlot){
      if(state.timeslot==timeSlot)
        state.timeslot=null
      else 
        state.timeslot = timeSlot
      console.log("Triggered")  
      commit("validateInputs")
    },
    setComment({commit,state},comment){
      state.comment = comment
      commit("validateInputs")
    },
    setNoDeactivatedProductsState({commit,state},varState){
      state.noDeactivatedProducts = varState
      commit("validateInputs")
    },
    setFeedbackModalState({state},varState){
      state.feedbackModalState = varState
    },
    setFeedbackModalContent({state},content){
      state.feedbackModalContent = content
    },
    setOrderingState({state},newState){
      state.orderingState = newState
    }
  }
  
  const mutations = {
      
      addOrderItem(state, newItem) {
        newItem.id = state.orderItems.length;
        state.orderItems.push(newItem);
        return newItem.id;
      },
      removeOrderItem(state, id) {
        state.orderItems = state.orderItems.filter(item => item.id !== id);
      },
      updateOrderItem(state, updatedItem) {
        const index = state.orderItems.findIndex(item => item.id === updatedItem.id);
        if (index !== -1) {
          state.orderItems.splice(index, 1, updatedItem);
        }
      },
      clearOrderData(state){
        state.timeslot= null
        state.comment = null
        state.isLoading=false  
        state.inputIsValid=false
        state.feedbackModalState=false
        state.feedbackModalContent=""
        state.orderingState=false
        state.orderItems= []
      }
  }

  export default {
      state,
      getters,
      actions,
      mutations
    };
  
  
  
  