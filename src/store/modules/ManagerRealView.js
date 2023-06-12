import BackendConnection from '../../services/authorizedapi';

const state = {
  boxes: [], 
  isLoading: false,  
  timeoutId: null
}

const getters = {
    isPickerRealViewLoading:(state)=>state.isLoading,
    getAllBoxes:(state)=>state.boxes  
}


const actions = {
    async refreshBoxData({state,dispatch}){
        var response = await BackendConnection.get("/boxes")
       
        if (response.status != 200)
            return
           
        for(var box of response.data)
        {
            if(!state.boxes.includes(box))
            {
                state.boxes=response.data
                break   
            }
           
        }
        state.timeoutId = setTimeout(()=>{dispatch('refreshBoxData')}, 2000 );
    },
    stopPlaceRefresh({state}){
        clearTimeout(state.timeoutId)
    },
    async openTray({commit},trayId){
        
        var response = await BackendConnection.put("/boxes/trays/"+trayId+"/open")

        if (response.status != 200)
            return
   
        commit("_addToastMessage", {
            title: `Öffnungs-Kommando wurde gesendet`, options: {
          noHoverPause: true,
          variant: "success",
          autoHideDelay: 500,
          noCloseButton: true
        }
      })
    }
     
}


export default {
    state,  
    getters,
    actions
  };
