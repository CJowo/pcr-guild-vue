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
      { path: 'box', component: () => import('pages/Box/Box.vue'), meta: { requireAuth: true } },
      {
        path: 'guild',
        component: () => import('pages/Guild/Guild.vue'),
        meta: { requireAuth: true },
        children: [
          { path: 'list', component: () => import('pages/Guild/children/GuildList.vue'), meta: { requireAuth: true } },
          { path: 'detail', component: () => import('pages/Guild/children/GuildDetail.vue'), meta: { requireAuth: true } }
        ]
      },
      {
        path: 'battle',
        component: () => import('pages/Battle/Battle.vue'),
        meta: { requireAuth: true },
        children: [
          { path: 'reports', component: () => import('pages/Battle/children/Reports.vue'), meta: { requireAuth: true } },
          { path: 'my', component: () => import('pages/Battle/children/My.vue'), meta: { requireAuth: true } }
        ]
      },
      {
        path: 'admin',
        component: () => import('pages/Admin/Admin.vue'),
        children: [
          { path: 'validate', component: () => import('pages/Admin/children/Validate.vue') },
          { path: 'detail', component: () => import('pages/Admin/children/Detail.vue') }
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
