<template>
    <div>
        <h4>Zeitraumauswahl</h4>
        <b-list-group class="mb-2" v-if="!isLoading">
         <small>Wähle ein Abholtyp aus.</small>
            <b-list-group-item v-if="isPickupTypeAvailable(0)">
                <b-btn >
                    Abholung im Laden
                </b-btn>
            </b-list-group-item>

            <b-list-group-item v-if="isPickupTypeAvailable(1)">
                <b-btn  @click="setPickupType(1)">
                    Abholschrank
                </b-btn>
            </b-list-group-item>

            <b-list-group-item v-if="isPickupTypeAvailable(2)">
                <b-btn @click="setPickupType(2)">
                    Lieferung
                </b-btn>
            </b-list-group-item>

        </b-list-group>

        <b-row v-if="error.length==0&&selectedPickupType!=null">
            <b-col>
                <v-calendar locale="de" :attributes='attributes' @dayclick="selectDay" is-range/>
            </b-col>
            <b-col  class="mt-2">
                <div v-if="showedTimeslots!=null">
                    <b-list-group >
                        <b-list-group-item button v-for="timeslot in showedTimeslots" @click="setTimeSlot(timeslot.timeslotId)"    :class="[getTimeslot==timeslot.timeslotId ? 'active' : '']"  :key="timeslot.id">
                            <div  v-if="$moment(timeslot.from).isSame(timeslot.to,'date')">
                                  <h5 >{{$moment(timeslot.from).format("dddd, LL")}}</h5>  <p>{{$moment(timeslot.from).format("HH:mm")}}-{{$moment(timeslot.to).format("HH:mm")}}</p>
                            </div>
                            <div v-else>
                                <h5>{{$moment(timeslot.from).format("dddd, LL")}}</h5><p>{{$moment(timeslot.from).format("HH:mm")}}</p><h4>bis</h4><h5>{{$moment(timeslot.to).format("dddd, LL")}}</h5><p> {{$moment(timeslot.to).format("HH:mm")}}</p>
                            </div>
                        </b-list-group-item>
                    </b-list-group>
                </div>
                <div v-if="showedTimeslots.length==0 || showedTimeslots==undefined" style="width:200px">
                    <b-list-group >
                        <b-list-group-item>
                            <b-skeleton animation="wave" width="85%"></b-skeleton>
                            <b-skeleton animation="wave" width="55%"></b-skeleton>
                        </b-list-group-item>
                        <b-list-group-item>
                            <b-skeleton animation="wave" width="85%"></b-skeleton>
                            <b-skeleton animation="wave" width="55%"></b-skeleton>
                        </b-list-group-item>
                        <b-list-group-item>
                            <b-skeleton animation="wave" width="85%"></b-skeleton>
                            <b-skeleton animation="wave" width="55%"></b-skeleton>
                        </b-list-group-item>
                    </b-list-group>
                    <small>Wähle ein Datum aus.</small>
                </div>

          </b-col>
       </b-row>
       <p data-cy="timestatusmessage" v-else>
           {{error}}
       </p>
    </div>


</template>


<script>
import BackendConnection from '../services/authorizedapi';
import {mapActions,mapGetters} from 'vuex'
export default {
  name: "OrderingTime",
  data(){
    return{
           isLoading:false,
           timeslotGroups:[],
           selectedDay:null,
           error:"",
           selectedPickupType:null,
           showedDays:[],
           showedTimeslots:[]
    }
  },
  methods: {
      ...mapActions(['setTimeSlot']),
      setPickupType(pickupTypeId){
        this.setTimeSlot(null)
        this.selectedPickupType=null
        this.showedDays = this.timeslotGroups[pickupTypeId]
        this.selectedPickupType=pickupTypeId
      },
      isPickupTypeAvailable(pickupTypeId){
        try{
            if(this.timeslotGroups[pickupTypeId].length==0)
                return false
        }
        catch(err){
            return false
        }
        return true
      },
      async getTimeslots(){
            var response = await BackendConnection.get("/timeslots/availablePlaces")

            if(response.status==404)
                {
                    this.error="Im Moment ist leider kein Zeitraum frei. Bitte versuchen Sie es später nocheinmal :)"
                    return
                }

            if(response.status!=200)
            {
                this.error="Ein Fehler ist aufgetreten. Bitte lade die Seite neu."
                return
            }
            if(Object.keys(response.data).length==0)
            {
                this.error="Im Moment ist leider kein Zeitraum frei. Bitte versuchen Sie es später nocheinmal :)"
                return
            }

            this.timeslotGroups = response.data

      },
    getTimeslotsByDay(selectedDay) {
        const selectedDate = new Date(selectedDay);
        return Object.entries(this.showedDays)
            .filter(([dayRange]) => {
                const [startDay, endDay] = dayRange.split(" - ");
                const startDate = new Date(startDay);
                const endDate = new Date(endDay);
                return (
                    (selectedDate.setHours(0,0,0,0) >= startDate.setHours(0,0,0,0) && selectedDate.setHours(0,0,0,0) <= endDate.setHours(0,0,0,0)) ||
                    (selectedDate.setHours(0,0,0,0) > startDate.setHours(0,0,0,0) && selectedDate.setHours(0,0,0,0) < endDate.setHours(0,0,0,0))
                );
            })
            .flatMap(([, timeslots]) => timeslots)
            .filter(timeslot => {
                const timeslotStartDate = new Date(timeslot.from);
                const timeslotEndDate = new Date(timeslot.to);
                return (
                    timeslotStartDate.toDateString() === selectedDate.toDateString() ||
                    (timeslotStartDate < selectedDate && timeslotEndDate > selectedDate)
                );
            });
        },
       selectDay(day){
           this.setTimeSlot(null)
           this.showedTimeslots = this.getTimeslotsByDay(day.date)
   },

  },
   computed:{
    ...mapGetters(["getTimeslot"]),
    attributes() {
        return Object.values(this.showedDays)
        .flat()
        .map(function (showedDay) {
        const fromDate = new Date(showedDay.from);
        const toDate = new Date(showedDay.to);
        const type =
            fromDate.getFullYear() === toDate.getFullYear() &&
            fromDate.getMonth() === toDate.getMonth() &&
            fromDate.getDate() === toDate.getDate()
            ? "oneday"
            : "multiday";
        if (type === "oneday") {
            return { highlight: true, dates: showedDay.from };
        }

        return {
            highlight: true,
            dates: { start: showedDay.from, end: showedDay.to },
        };
        });
    },



  },
  filters: {

  },
  async created() {
    this.isLoading=true
    await this.getTimeslots()
    this.isLoading=false
  }
};
</script>
