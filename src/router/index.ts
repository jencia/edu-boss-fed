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

      // 广告
      {
        path: '/Advertise',
        name: 'Advertise',
        component: () => import(/* webpackChunkName: "Advertise" */ '../views/Advertise.vue')
      },
      {
        path: '/addAdvertise',
        name: 'AddAdvertise',
        component: () => import(/* webpackChunkName: "AddAdvertise" */ '../views/AddAdvertise.vue')
      },
      {
        path: '/updateAdvertise',
        name: 'UpdateAdvertise',
        component: () => import(/* webpackChunkName: "UpdateAdvertise" */ '../views/UpdateAdvertise.vue')
      },

      // 广告位
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

      // 菜单
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

      // 资源
      {
        path: '/Resource',
        name: 'Resource',
        component: () => import(/* webpackChunkName: "Resource" */ '../views/Resource.vue')
      },
      {
        path: '/resourceCategory',
        name: 'ResourceCategory',
        component: () => import(/* webpackChunkName: "ResourceCategory" */ '../views/ResourceCategory.vue')
      },

      // 角色
      {
        path: '/Role',
        name: 'Role',
        component: () => import(/* webpackChunkName: "Role" */ '../views/Role.vue')
      },
      {
        path: '/allocMenu',
        name: 'AllocMenu',
        component: () => import(/* webpackChunkName: "AllocMenu" */ '../views/AllocMenu.vue')
      },
      {
        path: '/allocResource',
        name: 'AllocResource',
        component: () => import(/* webpackChunkName: "AllocResource" */ '../views/AllocResource.vue')
      },

      // 用户管理
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
