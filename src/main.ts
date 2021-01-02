import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import MeListForm from '@/components/MeListForm.vue'
import dayjs from 'dayjs'
import './styles/index.scss'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.component('MeListForm', MeListForm)
Vue.filter('date', (value: string) => {
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
