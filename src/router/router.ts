import { createRouter, createWebHistory } from 'vue-router'
import authService from '@/commons/authService';
import commonFn from '@/commons/commonFunction';
import i18n from '@/i18n/i18n';
import routerBusiness from '@/router/routerBus';
import routerSystem from '@/router/routerSys';
import routerHome from '@/router/routerHome';
import routerCustomer from '@/router/routerCust';

const main: any [] = [
  {
    path: '/',
    component: () => import('@/page/MainPage.vue'),
    children: [
      ...routerHome,
      // ...routerBusiness,
      // ...routerSystem,
      // ...routerCustomer,
      {
        path: '/not-found',
        name: 'notFound',
        component: () => import('@/views/home/dashboard/HomeDashboard.vue'),
      },
      {
        path: '/not-permission',
        name: 'notPermission',
        component: () => import('@/page/NotPermission.vue'),
      },
      {
        path: '/demoControl',
        name: 'demoControl',
        component: () => import('@/views/demo/DemoControl.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/page/LoginPage.vue'),
    meta: { title: 'i18nCommon.LoginTitle' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/not-found'
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: main,
  linkActiveClass: "active",
})

router.beforeEach(async (to: any, from: any, next: any) => {
  document.title = i18n.global.t(to.meta.title ? to.meta.title : 'i18nCommon.TitleDefault') // Đặt tiêu đề trang theo ngôn ngữ hiện tại
  let user = commonFn.getUser();
  // await authService.getAllPermission();
  // // Thực hiện check quyền người dùng
  // if(to.path != '/not-permission' && to.meta.sub_system_code){
  //   if(!(await authService.checkActionPermisson('View', to.meta.sub_system_code))){
  //     next({ name: "notPermission" });
  //   }
  // }

  // Thực hiện chuyển đến trang mong muốn
  user = {};
  user.access_token = '123';
  if(to.name !== 'login'){
    if(user?.access_token){
      if (to.path == '/'){
        next({ name: "dashboard" });
      }
      next();
    }
    else{
      next({ name: "login" });
    }
  }
  else{
    if(user?.access_token){
      next({ name: "dashboard" });
    }
    next();
  }
})

export default router;
