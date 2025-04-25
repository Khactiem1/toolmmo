const router: any [] = [
  //#ROUTER#
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/home/dashboard/HomeDashboard.vue'),
    meta: {title: 'i18nCommon.TitleDashBoard', sub_system_code: "dashboard" }
  },
]

export default router;