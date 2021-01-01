import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/Login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "Login" */ '../views/Login.vue')
  },
  {
    path: '/',
    name: 'DefaultLayout',
    component: () => import(/* webpackChunkName: "DefaultLayout" */ '../layouts/default.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import(/* webpackChunkName: "home" */ '../views/Courses.vue')
      },
      {
        path: '/Advertise',
        name: 'Advertise',
        component: () => import(/* webpackChunkName: "Advertise" */ '../views/Advertise.vue')
      },
      {
        path: '/AdvertiseSpace',
        name: 'AdvertiseSpace',
        component: () => import(/* webpackChunkName: "AdvertiseSpace" */ '../views/AdvertiseSpace.vue')
      },
      {
        path: '/Courses',
        name: 'Courses',
        component: () => import(/* webpackChunkName: "Courses" */ '../views/Courses.vue')
      },
      {
        path: '/Menu',
        name: 'Menu',
        component: () => import(/* webpackChunkName: "Menu" */ '../views/Menu.vue')
      },
      {
        path: '/addMenu',
        name: 'AddMenu',
        component: () => import(/* webpackChunkName: "AddMenu" */ '../views/AddMenu.vue')
      },
      {
        path: '/updateMenu',
        name: 'UpdateMenu',
        component: () => import(/* webpackChunkName: "UpdateMenu" */ '../views/UpdateMenu.vue')
      },
      {
        path: '/Resource',
        name: 'Resource',
        component: () => import(/* webpackChunkName: "Resource" */ '../views/Resource.vue')
      },
      {
        path: '/Role',
        name: 'Role',
        component: () => import(/* webpackChunkName: "Role" */ '../views/Role.vue')
      },
      {
        path: '/Users',
        name: 'Users',
        component: () => import(/* webpackChunkName: "Users" */ '../views/Users.vue')
      }
    ]
  },
  {
    path: '*',
    name: '404',
    component: () => import(/* webpackChunkName: "404" */ '../views/404.vue')
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, _from, next) => {
  const { user } = store.state
  const isLogin = user && user.access_token

  if (to.name === 'Login') {
    if (isLogin) {
      next('/')
    } else {
      next()
    }
  } else if (to.matched.some(v => v.meta.requiresAuth)) {
    if (!isLogin) {
      next({
        path: '/Login',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
