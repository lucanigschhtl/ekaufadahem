import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import * as Sentry from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import router from './router'
import store from './store'
import('./assets/styles.css')
import moment from 'moment'
import VueMomentLib from 'vue-moment-lib';
import VCalendar from 'v-calendar';
import './registerServiceWorker'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import VueHtmlToPaper from 'vue-html-to-paper'

if(!process.env.VUE_APP_PRODUCTION=='true')
  Vue.config.productionTip = true

moment.locale('de')
Vue.use(VueMomentLib, { moment: moment });
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VCalendar)
Vue.use(VueSweetalert2)

const options = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    'titlebar=yes',
    'scrollbars=yes'
  ],
  styles: [
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css'
  ],
  timeout: 1000, // default timeout before the print window appears
  autoClose: true, // if false, the window will not close after printing
  windowTitle: window.document.title, // override the window title
}


Vue.use(VueHtmlToPaper,options)



if(process.env.VUE_APP_PRODUCTION=='true')
{
  Sentry.init({
    Vue,
    dsn: "https://cd984647bbe542c9865d54a4f697de35@o1089513.ingest.sentry.io/4504078535032832",
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        tracingOrigins: ["localhost", "ekaufa.konsum-sonntag.at", /^\//],
      }),
    ],
    beforeSend(event) {
      // Check if it is an exception, and if so, show the report dialog
      if (event.exception) {
        Sentry.showReportDialog({ eventId: event.event_id });
      }
      return event;
    },
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

const app = new Vue({
  
  router,
  store,
  components: { App },  
  render: h => h(App)
})

app.$mount('#app')
window.app = app

