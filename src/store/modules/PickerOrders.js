import Vue from 'vue';
import BackendConnection from '../../services/authorizedapi';


const state = {
  isOrderModalLoading: false,
  isOrderModalShown:false,
  orderModalData:null,
  isCustomerModalLoading: false,
  isCustomerModalShown:false,
  isEditOrderModalShown:false,
  customerModalData:null,    
  reserveModalOptions:null,
  isReserveModalShown:false,
  isReserveModalLoading:false,
  selectedPlaces:[],
  reserveModalActiveOrder:undefined,
  openTraysBool:false,
  statusGroups : [],
  ordersAreLoading:false,
  reserveModalPickupType:undefined

}

const getters = {
  getReserveModalPickupType:(state) => state.reserveModalPickupType,
  isOrderModalLoading: (state) => state.isOrderModalLoading,
  isOrderModalShown: (state) => state.isOrderModalShown,
  isEditOrderModalShown: (state) => state.isEditOrderModalShown,
  orderModalData: (state) => state.orderModalData,
  isCustomerModalLoading: (state) => state.isCustomerModalLoading,
  isCustomerModalShown: (state) => state.isCustomerModalShown,
  customerModalData: (state) => state.customerModalData,
  isReserveModalLoading: (state) => state.isReserveModalLoading,
  isReserveModalShown: (state) => state.isReserveModalShown,
  reserveModalOptions: (state) => state.reserveModalOptions,
  reserveModalActiveOrder: (state) => state.reserveModalActiveOrder,
  selectedPlaces:(state)=>state.selectedPlaces,
  isPlaceSelected:(state) => (placeId) => {
    var index = state.selectedPlaces.indexOf(placeId);
      if (index === -1) 
       return false
      return true
  },
  openTraysBool:(state) => state.openTraysBool,
  statusGroups:(state)=>state.statusGroups,
  getOrdersByStatusGroup: (state) => (statusId)=>{
    var result =  state.statusGroups.find(statusGroup => statusGroup.id==statusId)
    if(result==undefined)
        return []

    return result.orders
  },
  getStatusGroupById: (state)=> (statusId)=>{
    var result =  state.statusGroups.find(statusGroup => statusGroup.id==statusId)
    if(result==undefined)
        return null

    return result
  },
  areOrdersLoading:(state) => state.ordersAreLoading
}

const actions = {
    async showOrder({state},orderId){
        state.isOrderModalLoading = true
        state.isOrderModalShown=true

        if(state.isCustomerModalShown==true && state.isOrderModalShown==true)
          state.isCustomerModalShown=false

        var response = await BackendConnection.get("/orders/"+orderId)
        state.isOrderModalLoading = false
        if(response.status!=200){
            Vue.swal('Achtung','Bestellung laden hat nicht funktionert','error')
            return
        }
        state.orderModalData=response.data
     },
     
     async showCustomer({state},customerId){
        state.isCustomerModalLoading = true
        state.isCustomerModalShown=true
        var response = await BackendConnection.get("/user/"+customerId)
        state.isCustomerModalLoading = false
        if(response.status!=200){
            Vue.swal('Achtung','Der Kunde nicht geladen werden','error')
            return
        }
        state.customerModalData=response.data
        
     },
     async showReserveOptions({state},order){
      state.reserveModalActiveOrder= order._id
      state.reserveModalPickupType= order.pickupType
      state.isReserveModalLoading = true
      state.isReserveModalShown=true
      var response = await BackendConnection.get("/places/live")
      state.isReserveModalLoading = false
      if(response.status!=200){
          Vue.swal('Achtung',"ReserveOptionen laden hat nicht funktioniert",'error')
          return
      }
     },
     async moveOrder({dispatch},data){
        await dispatch('moveToState',{orderId: data.order.order,newStatusId: (data.order.status.rank+data.step)})
      },
      async moveToState({dispatch},data){
          state.ordersAreLoading = true
          var response = await BackendConnection.put("/orders/"+data.orderId+"/status",{newStatus:data.newStatusId})
          if(response.status==447)
          {
            Vue.swal('Warnung!','Whatsapp konnte nicht an den Kunden verschickt werden!','error')
            return 
          }
          
          if(response.status!=200)
          {
            Vue.swal('Achtung','Die Bestellung konnte nicht verschoben werden!','error')
            return
          } 
          state.ordersAreLoading = false      
          await dispatch('fetchStatus',data.preStatusId)    
      },
      async fetchStatus({state,getters},statusId){
        state.ordersAreLoading=true
        var response = await BackendConnection.get("/orders/status/"+statusId)
       
        if(response.status!=200)
          Vue.swal('Achtung','Die Bestellungen für den Status '+statusId+'konnte nicht geladen werden','error')
        
        //statusGroup löschen wenn sie bereits im Speicher existiert
        if(getters.getStatusGroupById(statusId)!=null)
            state.statusGroups.splice(state.statusGroups.findIndex(statusGroup => statusGroup.id==statusId),1)
        
        //statusGroup zum Speicher hinzufügen
        state.statusGroups.push({'id':statusId,'orders':response.data})

        state.ordersAreLoading = false
  },   
  
  async bookOrder({state,dispatch}){
    var response = await BackendConnection.put("/orders/"+state.reserveModalActiveOrder+"/status",{newStatus:3,openTrays:state.openTraysBool,selectedPlaces: state.selectedPlaces})
  
    if(response.status!=200){
      Vue.swal('Achtung','Die Platzbuchung hat nicht funktioniert','error')
      return
    }
    state.selectedPlaces=[]
    dispatch('fetchStatus',2)
    state.isReserveModalShown = false 
  },
}
  


const mutations = {
    setCreateCustomerModalShowState:(state,showState)=>(state.isCreateCustomerModalShown=showState),
    setEditOrderModalShowState:(state,showState)=>(state.isEditOrderModalShown=showState),
    setOrderModalShowState:(state,showState)=>(state.isOrderModalShown=showState),
    setCustomerModalShowState:(state,showState)=>(state.isCustomerModalShown=showState),
    setReserveModalShowState:(state,showState)=>(state.isReserveModalShown=showState),
    togglePlaceSelect(state,place){
      var index = state.selectedPlaces.indexOf(place._id);
      if (index === -1) {
        //check if tray is allowed to be added
        // if(tray.state.id==4||tray.state.id==3||(tray.state.id==5&&tray.activePlaceReserve.purchase==this.reserveModalActiveOrder))
        if(place.order!=null)
          return

        state.selectedPlaces.push(place._id);
       
      } else {
          state.selectedPlaces.splice(index, 1);
      }
    },
    setOpenTraysBool:(state,newState)=>(state.openTraysBool=newState),
     clearCustomerModal(state){
      state.isOrderModalShown=false
      state.orderModalData=null
      state.isCustomerModalShown=true
      state.customerModalData=null
      
     },
}

export default {
    state,
    getters,
    actions,
    mutations
  };



