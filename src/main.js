import { createApp } from 'vue'
import App from './App.vue'

import stores from './stores';

// load utils
import router from './router'

// load external library
// loader library
import {LoadingPlugin} from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

// sweetalert library
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// toast library
import Toast, {useToast} from "vue-toastification";
import "vue-toastification/dist/index.css";

// load assets
import './assets/css/bootstrap.min.css'
import './assets/css/icons.min.css'
import './assets/css/app.min.css'
import './assets/css/custom.css'

import 'bootstrap'

// import components for global
import Pagination from './components/Pagination.vue'

import VueTheMask from 'vue-the-mask'

import {useLoading} from 'vue-loading-overlay';

const app = createApp(App)

app.use(router)
app.use(stores)
app.use(VueSweetalert2)
app.use(VueTheMask)
app.use(LoadingPlugin, {
    color: '#fff',
    zIndex: 99999999,
    backgroundColor: '#000',
});
app.use(Toast, {
    transition: "Vue-Toastification__bounce",
    maxToasts: 1,
    newestOnTop: true,
    pauseOnHover: false,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnFocusLoss: false,
    timeout: 2000,
    position: "top-right",
});

app.config.globalProperties.$loading = useLoading({
    color: '#fff',
    zIndex: 99999999,
    backgroundColor: '#000',
});

app.component(Pagination.name, Pagination)

// global variables
app.config.globalProperties.$toast = useToast()

// global functions
app.config.globalProperties.$toCurrency =  function (value) {
    if (typeof value !== "number") {
        return value;
    }

    return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
}

app.mount('#app')