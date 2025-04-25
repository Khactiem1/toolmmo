const router: any [] = [
  //#ROUTER#
  {
    path: '/lists/banner',
    name: 'banner',
    component: () => import('@/views/bus/banner/BannerList.vue'),
    meta: { title: 'i18nBanner.Title', sub_system_code: "banner" }
  },
  {
    path: '/news/news-all',
    name: 'news',
    component: () => import('@/views/bus/news/NewsList.vue'),
    meta: { title: 'i18nNews.Title', sub_system_code: "news" }
  },
  {
    path: '/news/news-list',
    name: 'news_list',
    component: () => import('@/views/bus/newsList/NewsListList.vue'),
    meta: { title: 'i18nNewsList.Title', sub_system_code: "news_list" }
  },
  {
    path: '/lists/footer',
    name: 'footer',
    component: () => import('@/views/bus/footer/FooterList.vue'),
    meta: { title: 'i18nFooter.Title', sub_system_code: "footer" }
  },
  {
    path: '/lists/menu-frontend',
    name: 'menu_frontend',
    component: () => import('@/views/bus/menuFrontend/MenuFontendList.vue'),
    meta: { title: 'i18nMenuFontend.Title', sub_system_code: "menu_frontend" }
  },
  {
    path: '/lists/quick-link',
    name: 'quick_link',
    component: () => import('@/views/bus/quickLink/QuickLinkList.vue'),
    meta: { title: 'i18nQuickLink.Title', sub_system_code: "quick_link" }
  },
  {
    path: '/lists/bank',
    name: 'bank',
    component: () => import('@/views/bus/bank/BankList.vue'),
    meta: { title: 'i18nBank.Title', sub_system_code: "bank" }
  },
  {
    path: '/lists/department',
    name: 'department',
    component: () => import('@/views/bus/department/DepartmentList.vue'),
    meta: { title: 'i18nDepartment.Title', sub_system_code: "department" }
  },
  {
    path: '/lists/anoucement',
    name: 'anoucement',
    component: () => import('@/views/bus/anoucement/AnoucementList.vue'),
    meta: { title: 'i18nAnoucement.Title', sub_system_code: "anoucement" }
  },
  {
    path: '/lists/support-list',
    name: 'supportList',
    component: () => import('@/views/bus/supportList/SupportListList.vue'),
    meta: { title: 'i18nSupportList.Title', sub_system_code: "support_list" }
  },
  {
    path: '/lists/position',
    name: 'position',
    component: () => import('@/views/bus/position/PositionList.vue'),
    meta: { title: 'i18nPosition.Title', sub_system_code: "position" }
  },
  {
    path: '/lists/support-center',
    name: 'support_center',
    component: () => import('@/views/bus/support/SupportList.vue'),
    meta: { title: 'i18nSupport.Title', sub_system_code: "support_center" }
  },
  {
    path: '/customer/contact',
    name: 'customer_contact',
    component: () => import('@/views/bus/contact/ContactList.vue'),
    meta: { title: 'i18nContact.Title', sub_system_code: "customer_contact" }
  },
  {
    path: '/lists/company-info',
    name: 'company_info',
    component: () => import('@/views/bus/companyInfo/CompanyInfoList.vue'),
    meta: { title: 'i18nCompanyInfo.Title', sub_system_code: "company_info" }
  },
  {
    path: '/lists/province',
    name: 'province',
    component: () => import('@/views/bus/province/ProvinceList.vue'),
    meta: { title: 'i18nProvince.Title', sub_system_code: "province" }
  },
  {
    path: '/lists/district',
    name: 'district',
    component: () => import('@/views/bus/district/DistrictList.vue'),
    meta: { title: 'i18nDistrict.Title', sub_system_code: "district" }
  },
  {
    path: '/lists/ward',
    name: 'ward',
    component: () => import('@/views/bus/ward/WardList.vue'),
    meta: { title: 'i18nWard.Title', sub_system_code: "ward" }
  },
  {
    path: '/lists/product-category',
    name: 'category_list',
    component: () => import('@/views/bus/category/CategoryList.vue'),
    meta: { title: 'i18nCategory.Title', sub_system_code: "category" }
  },
  {
    path: '/lists/payment-method',
    name: 'payment_method',
    component: () => import('@/views/bus/paymentMethod/PaymentMethodList.vue'),
    meta: { title: 'i18nPaymentMethod.Title', sub_system_code: "payment_method" }
  },
  {
    path: '/lists/brand',
    name: 'brand',
    component: () => import('@/views/bus/brand/BrandList.vue'),
    meta: { title: 'i18nBrand.Title', sub_system_code: "brand" }
  },
  {
    path: '/lists/staff',
    name: 'staff',
    component: () => import('@/views/bus/staff/StaffList.vue'),
    meta: { title: 'i18nStaff.Title', sub_system_code: "staff" }
  },
  {
    path: '/lists/contract-template',
    name: 'contract_template',
    component: () => import('@/views/bus/contractTemplate/ContractTemplateList.vue'),
    meta: { title: 'i18nContractTemplate.Title', sub_system_code: "contract_template" }
  },
  {
    path: '/lists/feature-package',
    name: 'feature_package',
    component: () => import('@/views/bus/featurePackage/FeaturePackageList.vue'),
    meta: { title: 'i18nFeaturePackage.Title', sub_system_code: "feature_package" }
  },
  {
    path: '/lists/membership-plan',
    name: 'membership_plan',
    component: () => import('@/views/bus/membershipPlan/MembershipPlanList.vue'),
    meta: { title: 'i18nMembershipPlan.Title', sub_system_code: "membership_plan" }
  },
]

export default router;