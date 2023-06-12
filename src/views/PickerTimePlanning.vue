<template>
    <b-container class="mt-3">
        <picker-order-modal></picker-order-modal>
        <picker-customer-modal></picker-customer-modal>
        <picker-copy-timeslots-modal ref="copytimeslotmodal"></picker-copy-timeslots-modal>
        <picker-timeslot-modal ref="timeslotmodal"></picker-timeslot-modal>
      <h1>Zeitplanung</h1>
      <b-btn @click="$refs.copytimeslotmodal.showModal($moment())">Zeiträume kopieren</b-btn>
      <FullCalendar ref="fullCalendar" :options="calendarOptions" />
    </b-container> 
</template>
<script>

import BackendConnection from '../services/authorizedapi';
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import PickerTimeslotModal from '../components/PickerTimeslotModal.vue';
import PickerCustomerModal from '../components/PickerCustomerModal.vue';
import PickerOrderModal from '../components/PickerOrderModal.vue';
import momentPlugin from '@fullcalendar/moment'
import PickerCopyTimeslotsModal from '../components/PickerCopyTimeslotsModal.vue';
import { mapMutations} from "vuex";
import { TypeConverter }  from "../utils/TypeConverter";

export default {
  components: {FullCalendar, PickerTimeslotModal,PickerOrderModal, PickerCustomerModal,PickerCopyTimeslotsModal},
  name: "PickerTimePlanning", 
  data(){
    return{  
            showedTimeslots:[],
            TypeConverter,  
             calendarOptions: {
              plugins: [ dayGridPlugin, interactionPlugin,listPlugin,timeGridPlugin,momentPlugin ],
              initialView: "timeGrid",
              nextDayThreshold: "00:01",
              selectable: true,
              editable: true,
              dateAlignment: "week",
              weekNumbers: true,
              firstDay: 1,
              themeSystem: "bootstrap",
              locale: "de",
              select: this.createTimeslot,  
              selectOverlap: function (event) {
                    return event.rendering === "background";
                },

                headerToolbar: {
                    center: "timeGridFourDay,listWeek",
                },
                views: {
                    listWeek: {
                        type: "listWeek", 
                        duration: { days: 7 },
                        buttonText: "Liste",
                    },
                    timeGridFourDay: {
                        type: "timeGrid",
                        duration: { days: 7 },
                        buttonText: "7 Tage",
                    },
                    dayGridMonth: {
                        type: "dayGridMonth",
                        duration: { month: 1 },
                        buttonText: "Monat",
                    },
                },
                slotDuration: "0:30",
                events: this.getTimeslotsForTime,
                eventClick: this.showTimeslot,                
                eventChange: this.moveTimeslot,         
                eventOverlap: function (stillEvent, movingEvent) {
                    return stillEvent.allDay && movingEvent.allDay;
                },
             },             
        error:"" 
    }   
  },  
  async created() {
    this.clearCustomerModal()
  },
  methods: {  
    ...mapMutations(["clearCustomerModal"]),
    async refreshTimeslots(){
      this.$refs.fullCalendar.getApi().refetchEvents()
    },
    async createTimeslot(event){

      var response = await BackendConnection.post('/timeslots',{from:event.startStr,to:event.endStr})

      if(response.status!=201){
        return
      }

      await this.refreshTimeslots()
    },

    async moveTimeslot(changeInfo){
      const timeslotId =  changeInfo.event._def.publicId
      const newFrom = this.$moment(changeInfo.event.start)
      const newTo = this.$moment(changeInfo.event.end)
      var response = await BackendConnection.put('/timeslots/'+timeslotId,{newFrom:newFrom.format(),newTo:newTo.format()})
      if(response.status!=200){

          this.refreshTimeslots()
          return
        }
      await this.refreshTimeslots()
    },

    async showTimeslot(event){
      const timeslotId =  event.event._def.publicId
      this.$refs.timeslotmodal.showModal(timeslotId)
    },  
    async getTimeslotsForTime(info,successCallback,failureCallback,){
        var response = await BackendConnection.get('/timeslots/week',
        { params:
          {from: this.$moment(info.startStr).format(),to: this.$moment(info.endStr).format()}
        })

        if(response.status!=200)
        {
          failureCallback(response)
          return 
        } 

        var timeslots = []
        response.data.forEach(element=>{
          var timeslot = {
            id:element.id,
            start: this.$moment(element.from).format(),
            end:this.$moment(element.to).format(),
            overlap:false,
            editable:element.isMoveable,
            backgroundColor: element.full ? 'red' : 'green',
            title:TypeConverter.getOrderPickupTypeDetailById(element.pickupType).title,
            data: element
          }
           
          timeslots.push(timeslot)
        })
        this.showedTimeslots = timeslots
        successCallback(timeslots)
    }
  },
  filters: { 
    formatAmount (unit) {
      return parseFloat(unit.toString());
    },
     trayOpen(open){
      if(open)
        return "geöffnet"
      return "geschlossen"
    }   
  }
};
</script>
