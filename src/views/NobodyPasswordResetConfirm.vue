 <template>
    <div>
        <b-container fluid>
        <b-row style="height: 80vh;" align-v="center" align-h="center">
            <div>
            <b-img style="width: 30vw;" :src="require(`../assets/logoekaufa.png`)" />
            <div v-if="!IsDone">
                <h1 >Passwort-Änderung</h1>             
            </div>
            <b-row style="width: 60vw;">
                <b-col cols="8">
                    <div v-if="!IsLoading">
                        <div v-if="!IsDone">
                        <b-alert :show="feedback.length>0" variant="warning">{{feedback}}</b-alert>      
                            <b-row class="mb-2">
                                <b-col>
                                    <b-form-input placeholder="Passwort" type="password" v-model="password" :state="validatePassword" id="feedback-password" />
                                    <b-form-invalid-feedback :state="validatePassword">
                                        Mindestens 8 Zeichen lang
                                    </b-form-invalid-feedback>
                                </b-col>
                                <b-col>
                                    <b-form-input placeholder="Passwort wiederholen" type="password" v-model="passwordRepeat" :state="validatePassword" id="feedback-passwordRepeat" />
                                    <b-form-invalid-feedback :state="validatePassword">
                                        Bitte wiederholen Sie das Passwort nocheinmal
                                    </b-form-invalid-feedback>
                                </b-col>
                            </b-row>    
                            <b-row>
                                <b-col>
                                    <b-button variant="primary" data-cy="submit" @click="submit" class="mt-2">Absenden</b-button>
                                </b-col>
                            </b-row>          
                        </div>
                        <!-- Success Message -->
                        <div v-if="IsDone">
                            <h2>Gratuliere <b-icon icon="emoji-wink" variant="success"/></h2>
                            <p>Dein Passwort wurde erfolgreich geändert!</p>                      
                        </div>
                    </div>               

                    <!-- Loading Spinner -->
                    <loading-spinner v-if="IsLoading"/>
                </b-col>

                <!-- Sidebar -->
                <b-col cols="4">
                    <side-navigation/>
                </b-col>
            </b-row>
            </div>
        </b-row>
        </b-container>
    </div>
</template>

<script>
import LoadingSpinner from '../components/LoadingSpinner.vue';
import {HTTP} from '../services/api';
import SideNavigation from '../components/navigation/TheNobodySideNavigation.vue';
export default {
  components: {SideNavigation, LoadingSpinner },
  name: "PasswordResetConfirm",
  data(){
    return{   
    password:"",
    passwordRepeat:"",
    IsLoading:false,
    IsDone:false,
    feedback:""
    }
  },
  computed: {
        validatePassword(){
            if(this.password == "" || this.passwordRepeat=="")
                return false

            if(this.password!=this.passwordRepeat)
                return false
            
            if(this.password.length<9)
                return false

            return true
        }
    },
  methods:{   
    async submit(){
            var parameter = this.$route.query.token
        
            if(parameter == "" || parameter == undefined)
            {
                this.feedback="Kein Reset-Token vorhanden!"
                return  
            }

            if(!this.validatePassword){
                this.feedback="Bitte legen Sie Ihr neues Passwort fest!"
                return 
            }
            
            this.IsLoading=true      
            var response = await HTTP.put("/user/resetPassword/confirm",{"password": this.password,"passwordResetToken":parameter}) 
            this.IsLoading=false
            
             //email already in use
            if(response.status==433)
            {
                this.feedback="Reset-Token ist nicht valide!"
                return
            }
            
            if(response.status!=200){            
                this.feedback="Fehler aufgetreten"
                return
            }

            this.IsDone=true
        }
  }
    
};
</script>