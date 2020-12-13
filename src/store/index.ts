import Vue from 'vue'
import Vuex from 'vuex'
import store from 'store'
import { getUserPermissions } from '@/services/permission'

Vue.use(Vuex)

const STORE_COLLAPSE_KEY = '__storejs_lagou_edu_boss_sidebar_collapse'
const STORE_USER_KEY = '__storejs_lagou_edu_boss_session'

export default new Vuex.Store({
  state: {
    collapse: store.get(STORE_COLLAPSE_KEY) ?? false,
    user: store.get(STORE_USER_KEY) ?? {},
    menuList: [],
    resourceList: []
  },
  mutations: {
    setCollapse: (state, payload) => {
      const bool = payload ?? !state.collapse

      state.collapse = bool
      store.set(STORE_COLLAPSE_KEY, bool)
    },
    setUser: (state, payload) => {
      let data = {}

      if (typeof payload === 'string') {
        try {
          data = JSON.parse(payload)
        } catch {}
      }
      state.user = data
      store.set(STORE_USER_KEY, data)
    },
    setMenuList: (state, payload) => (state.menuList = payload),
    setResourceList: (state, payload) => (state.resourceList = payload)
  },
  actions: {
    async getUserPermissionsData (context) {
      const { menuList, resourceList } = await getUserPermissions()

      context.commit('setMenuList', menuList)
      context.commit('setResourceList', resourceList)
    }
  },
  modules: {
  }
})
