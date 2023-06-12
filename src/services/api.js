import axios from 'axios';


export const HTTP = axios.create({
    baseURL:  process.env.VUE_APP_BACKEND_SERVER,
    headers: {'Content-Type': 'application/json'},
    validateStatus: function (status) {
        return status
      }
})

