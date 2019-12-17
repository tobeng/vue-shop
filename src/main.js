// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI, { MessageBox } from 'element-ui'
// 引入全局样式
import './assets/css/global.css'
// 引入第三方样式
import './assets/fonts/iconfont.css'
// 引入elementUI样式
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
// 配置 axios
axios.defaults.baseURL = 'https://renoblog.xyz/api/private/v1/'
// axios 增加请求路径
axios.interceptors.request.use(config => {
  console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
})
Vue.prototype.$http = axios;
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$confirm = MessageBox.confirm

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
