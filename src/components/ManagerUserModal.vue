<template>  
          <b-modal -v-if="isShown" v-model="isShown" scrollable header="Hello" size="lg" @hide="isShown=false"> 
              <template #modal-header>
                <h5>User</h5>
              </template>           
              <div v-if="isLoading">
                 <b-row>
                    <b-col>
                          <h1 v-if="this.activeUser!=null">@{{this.activeUser}}</h1>
                    </b-col>
                  </b-row>
                  <b-skeleton class="mb-3" type="button"></b-skeleton>
                  <b-row>
                    <b-col>
                      <b-form-group  label-size="lg" label="Name">
                        <b-row>
                          <b-col>
                             <b-skeleton type="input" width="30%"></b-skeleton>
                          </b-col>
                          <b-col>
                           <b-skeleton type="input" width="50%"></b-skeleton>
                          </b-col>
                        </b-row>
                      </b-form-group>                          
                    </b-col>
                  </b-row>
                   <b-row>
                        <b-col>
                            <b-form-group cols=2 class="w-50" label-size="lg" label="Rolle">
                                  <b-skeleton type="input" width="50%"></b-skeleton>
                            </b-form-group>
                        </b-col>
                         <b-col>
                            <b-form-group cols=2 class="w-50" label-size="lg" label="Status">
                                  <b-skeleton type="input" width="50%"></b-skeleton>
                            </b-form-group>
                        </b-col>
                  </b-row>
                  <b-row>
                      <b-col>
                          <b-form-group  label-size="lg" label="Email">
                               <b-skeleton type="input" width="100%"></b-skeleton>
                          </b-form-group>
                      </b-col>
                      <b-col>
                            <b-form-group  label-size="lg" label="Telefonnummer">
                                  <b-skeleton type="input" width="100%"></b-skeleton>
                            </b-form-group>
                      </b-col>
                  </b-row>
                  <b-row>
                      <b-col>
                            <b-form-group  label-size="lg" label="Ort">
                                <b-row>
                                    <b-col>
                                      <b-skeleton type="input" width="60%"></b-skeleton>
                                    </b-col>
                                    <b-col>
                                         <b-skeleton type="input" width="100%"></b-skeleton>
                                    </b-col>
                                 </b-row>
                            </b-form-group>
                      </b-col>
                      <b-col>
                          <b-form-group  label-size="lg" label="Straße">
                               <b-skeleton type="input" width="70%"></b-skeleton>
                            </b-form-group> 
                      </b-col>
                  </b-row> 
                  <b-row>
                    <b-col>
                      <b-form-group class="w-50"  label-size="lg" label="Iban">
                              <b-skeleton type="input" width="100%"></b-skeleton>
                      </b-form-group>                          
                    </b-col>
                  </b-row> 
              </div>
                <div v-else>
                
                  <b-row>
                   <b-col>
                      <h1>@{{userData.id}}</h1>
                    </b-col>
                  </b-row>
                  <b-btn class="mb-3"  @click="editMode=true">Bearbeiten</b-btn>
                  <b-row>
                     <b-col>
                              <b-form-group  label-size="lg" label="Name">
                                <b-row>
                                  <b-col>
                                    <b-form-input v-model="userData.firstName"   :disabled="!editMode"></b-form-input>
                                  </b-col>
                                  <b-col>
                                    <b-form-input v-model="userData.lastName"  :disabled="!editMode"></b-form-input>
                                  </b-col>
                                </b-row>
                              </b-form-group>                          
                        </b-col>
                  </b-row>
                   <b-row>
                        <b-col>
                            <b-form-group cols=2 class="w-50" label-size="lg" label="Rolle">
                                <b-form-select :options="roleOptions"  v-model="userData.role.id"  :disabled="!editMode"></b-form-select>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group cols=2 class="w-50" label-size="lg" label="Aktiviert">
                                <b-form-select :options="stateOptions"  v-model="userData.state"  :disabled="!editMode"></b-form-select>
                            </b-form-group>
                        </b-col>
                  </b-row>
                  <b-row>
                      <b-col>
                          <b-form-group  label-size="lg" label="Email">
                              <b-form-input v-model="userData.email" :disabled="!editMode"></b-form-input>
                          </b-form-group>
                      </b-col>
                      <b-col>
                            <b-form-group  label-size="lg" label="Telefonnummer">
                                  <b-form-input v-model="userData.tel" :disabled="!editMode"></b-form-input>
                            </b-form-group>
                      </b-col>
                  </b-row>
                  <b-row>
                      <b-col>
                            <b-form-group  label-size="lg" label="Ort">
                                <b-row>
                                    <b-col>
                                     <b-form-input v-model="userData.plz" width="20%" :disabled="!editMode"></b-form-input>
                                    </b-col>
                                    <b-col>
                                        <b-form-input v-model="userData.place" width="80%" :disabled="!editMode"></b-form-input>
                                    </b-col>
                                 </b-row>
                            </b-form-group>
                      </b-col>
                      <b-col>
                          <b-form-group  label-size="lg" label="Straße">
                             <b-form-input v-model="userData.street" :disabled="!editMode"></b-form-input>
                            </b-form-group> 
                      </b-col>
                  </b-row> 
                  <b-row>
                    <b-col>
                      <b-form-group class="w-50"  label-size="lg" label="Iban">
                            <b-form-input v-model="userData.iban" :disabled="!editMode"></b-form-input>
                      </b-form-group>                          
                    </b-col>
                  </b-row> 
                </div>
                <div v-if="editMode">
                <b-btn class="mr-2" variant="secondary" @click="refreshUserData()">Verwerfen</b-btn>
                <b-btn  variant="primary" @click="submitData()">Speichern</b-btn>
                </div>
                <template #modal-footer>  
                    <b-button
                    class="float-right"
                    variant="default"
                    @click="isShown=false"
                    >
                    Schließen
                    </b-button>                          
                </template>     
                        
            </b-modal> 
</template>
<script>
import BackendConnection from '../services/authorizedapi';

export default {
  components: {},
  name: 'ManagerUserModal',
  methods:{
      async refreshUserData(){
        await this.loadUserData(this.activeUser)
        this.editMode=false
      },
      async showUser(userId) {
        this.activeUser=userId
        await this.loadUserData(userId)
        this.isShown = true
        },
     async loadUserData(userId){
            this.isLoading=true
            var response = await BackendConnection.get("/manager/customer/"+userId)
            this.isLoading=false

            if(response.status!=200)
            {
                console.log("Fehler aufgetreten!")
                return
            }
          
            this.userData=response.data
     },
     async submitData(){
        this.isLoading=true
        var sendingObject = this.userData
        if(sendingObject.iban==null)
          sendingObject.iban=""
        sendingObject.role= sendingObject.role.id
        console.log(sendingObject)
        var response = await BackendConnection.put("/manager/customer/"+this.activeUser,sendingObject)
        this.isLoading=false
        if(response.status!=200)
          {
              console.log("Fehler aufgetreten!")
              return
          }
      
       this.refreshUserData()
      
     }
    },
  data(){
      return {
        activeUser:null,
        wantToBeUser:{},
        isShown:false,
        userData:null,
        isLoading:false,
        editMode:false,
        roleOptions:[
            { value: 1, text: 'Customer' },
            { value: 2, text: 'Picker' },
            { value: 3, text: 'Manager' },
        ],
        stateOptions:[
            { value: 1, text: 'aktiviert' },
            { value: 0, text: 'deaktiviert' },
        ],        
      }
  },
  filters: {
    formatAmount (unit) {
      return parseFloat(unit.toString());
    }
  }
}
</script>

