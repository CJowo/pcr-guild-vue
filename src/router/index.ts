import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import { logout } from '@/utils/http'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/box'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/box',
    name: 'Box',
    component: () => import('@/views/Box.vue'),
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/member',
    name: 'Member',
    component: () => import('@/views/Member.vue'),
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import('@/views/Order.vue'),
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings.vue'),
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/http404',
    name: 'Http404',
    component: () => import('@/views/Http404.vue')
  },
  {
    path: '/logout',
    name: 'Logout',
    component: () => import('@/views/Logout.vue')
  },
  {
    path: '*',
    redirect: '/http404'
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  let islogin_str = localStorage.getItem('islogin')
  let islogin = Boolean(Number(islogin_str))

  if (to.path === '/login') {
    if (islogin) {
      next('/')
    } else {
      next()
    }
  } else {
    if (to.meta.requireAuth) {
      if (islogin) {
        next()
      } else {
        next('/login')
      }
    } else {
      next()
    }
  }
})

export default router
