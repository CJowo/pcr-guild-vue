import { RouteConfig } from 'vue-router'

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'login', component: () => import('pages/Login.vue') },
      { path: 'register', component: () => import('pages/Register.vue') },
      { path: 'logout', component: () => import('pages/Logout.vue') },
      {
        path: 'guild',
        component: () => import('pages/Guild/Guild.vue'),
        meta: { requireAuth: true },
        children: [
          { path: 'list', component: () => import('pages/Guild/children/GuildList.vue'), meta: { requireAuth: true } },
          { path: 'detail', component: () => import('pages/Guild/children/GuildDetail.vue'), meta: { requireAuth: true } }
        ]
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
