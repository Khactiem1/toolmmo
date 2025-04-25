const router: any[] = [
    //#ROUTER#
    {
      path: '/customer/voucher-events',
      name: 'customer_voucher_events',
      component: () => import('@/views/cust/voucherEvent/VoucherEventList.vue'),
      meta: { title: 'i18nVoucherEvent.Title', sub_system_code: "customer_voucher_events" }
    },
    {
      path: '/customer/customer-voucher',
      name: 'customer_voucher',
      component: () => import('@/views/cust/voucher/VoucherList.vue'),
      meta: { title: 'i18nVoucher.Title', sub_system_code: "customer_voucher" }
    },
    {
      path: '/lists/member-type',
      name: 'member_type',
      component: () => import('@/views/cust/memberType/MemberTypeList.vue'),
      meta: { title: 'i18nMemberType.Title', sub_system_code: "member_type" }
    },
    {
      path: '/lists/emoticon',
      name: 'emoticon',
      component: () => import('@/views/cust/emoticon/EmoticonList.vue'),
      meta: { title: 'i18nEmoticon.Title', sub_system_code: "emoticon" }
    },
    {
      path: '/customer/order-history',
      name: 'order_history',
      component: () => import('@/views/cust/orderHistory/OrderHistoryList.vue'),
      meta: { title: 'i18nOrderHistory.Title', sub_system_code: "order_history" }
    },
    {
      path: '/customer/recharge-refund',
      name: 'recharge_refund',
      component: () => import('@/views/cust/recharge/RechargeList.vue'),
      meta: { title: 'i18nRecharge.Title', sub_system_code: "recharge_refund" }
    },
    {
      path: '/customer/transaction-history',
      name: 'transaction_history',
      component: () => import('@/views/cust/transaction/TransactionList.vue'),
      meta: { title: 'i18nTransaction.Title', sub_system_code: "transaction_history" }
    },
    {
      path: '/supplier/register-package',
      name: 'register_package',
      component: () => import('@/views/cust/registerPackage/RegisterPackageList.vue'),
      meta: { title: 'i18nRegisterPackage.Title', sub_system_code: "register_package" }
    },
    {
      path: '/product/product-group',
      name: 'product_group',
      component: () => import('@/views/cust/productGroup/ProductGroupList.vue'),
      meta: { title: 'i18nProductGroup.Title', sub_system_code: "product_group" }
    },
    {
      path: '/supplier/supplier-info',
      name: 'supplier_info',
      component: () => import('@/views/cust/supplier/SupplierList.vue'),
      meta: { title: 'i18nSupplier.Title', sub_system_code: "supplier_info" }
    },
    {
      path: '/lists/warehouse',
      name: 'warehouse',
      component: () => import('@/views/cust/warehouse/WarehouseList.vue'),
      meta: { title: 'i18nWarehouse.Title', sub_system_code: "warehouse" }
    },
    {
      path: '/product/products-list',
      name: 'products_list',
      component: () => import('@/views/cust/product/ProductList.vue'),
      meta: { title: 'i18nProduct.Title', sub_system_code: "products_list" }
    },
    {
      path: '/customer/customer-message',
      name: 'customer_message',
      component: () => import('@/views/cust/chats/ChatsList.vue'),
      meta: { title: 'i18nChats.Title', sub_system_code: "customer_message" }
    },
  ]
  
  export default router;