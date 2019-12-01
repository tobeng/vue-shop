import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Home from '@/components/Home'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: "/login",
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    }
  ]
})
// 挂载路由导航身份验证
router.beforeEach((to, from, next) => {
  // to 将要访问的路径 from 来自哪个路径 next 放行函数
  // next() 表示放行 next('/login') 带参数表示强制跳转
  if(to.path === '/login') return next();
  const token = window.sessionStorage.getItem('token');
  if(!token) return next("/login");
  next();
})

export default router
