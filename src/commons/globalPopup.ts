import { type App, defineAsyncComponent } from "vue";

/** Phần popup phân hệ */

/** Business */
const BannerDetail = defineAsyncComponent(() => import('@/views/bus/banner/BannerDetail.vue'));
const NewsDetail = defineAsyncComponent(() => import('@/views/bus/news/NewsDetail.vue'));
const NewsListDetail = defineAsyncComponent(() => import('@/views/bus/newsList/NewsListDetail.vue'));
const FooterDetail = defineAsyncComponent(() => import('@/views/bus/footer/FooterDetail.vue'));
const MenuFontendDetail = defineAsyncComponent(() => import('@/views/bus/menuFrontend/MenuFontendDetail.vue'));
const QuickLinkDetail = defineAsyncComponent(() => import('@/views/bus/quickLink/QuickLinkDetail.vue'));
const BankDetail = defineAsyncComponent(() => import('@/views/bus/bank/BankDetail.vue'));
const DepartmentDetail = defineAsyncComponent(() => import('@/views/bus/department/DepartmentDetail.vue'));
const AnoucementDetail = defineAsyncComponent(() => import('@/views/bus/anoucement/AnoucementDetail.vue'));
const SupportListDetail = defineAsyncComponent(() => import('@/views/bus/supportList/SupportListDetail.vue'));
const PositionDetail = defineAsyncComponent(() => import('@/views/bus/position/PositionDetail.vue'));
const SupportDetail = defineAsyncComponent(() => import('@/views/bus/support/SupportDetail.vue'));
const ContactDetail = defineAsyncComponent(() => import('@/views/bus/contact/ContactDetail.vue'));
const CompanyInfoDetail = defineAsyncComponent(() => import('@/views/bus/companyInfo/CompanyInfoDetail.vue'));
const ProvinceDetail = defineAsyncComponent(() => import('@/views/bus/province/ProvinceDetail.vue'));
const DistrictDetail = defineAsyncComponent(() => import('@/views/bus/district/DistrictDetail.vue'));
const WardDetail = defineAsyncComponent(() => import('@/views/bus/ward/WardDetail.vue'));
const CategoryDetail = defineAsyncComponent(() => import('@/views/bus/category/CategoryDetail.vue'));
const PaymentMethodDetail = defineAsyncComponent(() => import('@/views/bus/paymentMethod/PaymentMethodDetail.vue'));
const BrandDetail = defineAsyncComponent(() => import('@/views/bus/brand/BrandDetail.vue'));
const StaffDetail = defineAsyncComponent(() => import('@/views/bus/staff/StaffDetail.vue'));
const ContractTemplateDetail = defineAsyncComponent(() => import('@/views/bus/contractTemplate/ContractTemplateDetail.vue'));
const FeaturePackageDetail = defineAsyncComponent(() => import('@/views/bus/featurePackage/FeaturePackageDetail.vue'));
const MembershipPlanDetail = defineAsyncComponent(() => import('@/views/bus/membershipPlan/MembershipPlanDetail.vue'));
//#IMPORT_POUP_BUSINESS#

/** System */
const UserDetail = defineAsyncComponent(() => import('@/views/sys/user/UserDetail.vue'));
const RoleDetail = defineAsyncComponent(() => import('@/views/sys/role/RoleDetail.vue'));
const MenuDetail = defineAsyncComponent(() => import('@/views/sys/menu/MenuDetail.vue')); 
const DictionaryListDetail = defineAsyncComponent(() => import('@/views/sys/dictionaryList/DictionaryListDetail.vue'));
const DictionaryDetail = defineAsyncComponent(() => import('@/views/sys/dictionary/DictionaryDetail.vue'));
const ErrorReportDetail = defineAsyncComponent(() => import('@/views/sys/errorReport/ErrorReportDetail.vue'));
const JobDefinitionDetail = defineAsyncComponent(() => import('@/views/sys/jobDefinition/JobDefinitionDetail.vue'));
const LanguageDetail = defineAsyncComponent(() => import('@/views/sys/language/LanguageDetail.vue'));
const SystemConfigDetail = defineAsyncComponent(() => import('@/views/sys/systemConfig/SystemConfigDetail.vue'));
const ConfigNotifyDetail = defineAsyncComponent(() => import('@/views/sys/configNotify/ConfigNotifyDetail.vue'));
const ReceiveNotifyDetail = defineAsyncComponent(() => import('@/views/sys/receiveNotify/ReceiveNotifyDetail.vue'));
const ReceiveSelectUser = defineAsyncComponent(() => import('@/views/sys/receiveNotify/ReceiveSelectUser.vue'));
const KeywordDetail = defineAsyncComponent(() => import('@/views/sys/keyword/KeywordDetail.vue'));
const FunctionConfigDetail = defineAsyncComponent(() => import('@/views/sys/functionConfig/FunctionConfigDetail.vue'));
const CountryDetail = defineAsyncComponent(() => import('@/views/sys/country/CountryDetail.vue'));
const DataControlDetail = defineAsyncComponent(() => import('@/views/sys/dataControl/DataControlDetail.vue'));
//#IMPORT_POUP_SYSTEM#

/** Customer */
const VoucherEventDetail = defineAsyncComponent(() => import('@/views/cust/voucherEvent/VoucherEventDetail.vue'));
const VoucherDetail = defineAsyncComponent(() => import('@/views/cust/voucher/VoucherDetail.vue'));
const MemberTypeDetail = defineAsyncComponent(() => import('@/views/cust/memberType/MemberTypeDetail.vue'));
const EmoticonDetail = defineAsyncComponent(() => import('@/views/cust/emoticon/EmoticonDetail.vue'));
const RechargeDetail = defineAsyncComponent(() => import('@/views/cust/recharge/RechargeDetail.vue'));
const RegisterPackageDetail = defineAsyncComponent(() => import('@/views/cust/registerPackage/RegisterPackageDetail.vue'));
const ProductGroupDetail = defineAsyncComponent(() => import('@/views/cust/productGroup/ProductGroupDetail.vue'));
const SupplierDetail = defineAsyncComponent(() => import('@/views/cust/supplier/SupplierDetail.vue'));
const WarehouseDetail = defineAsyncComponent(() => import('@/views/cust/warehouse/WarehouseDetail.vue'));
const ViewSupplierDetail = defineAsyncComponent(() => import('@/views/cust/warehouse/ViewSupplierDetail.vue'));
const ChatsDetail = defineAsyncComponent(() => import('@/views/cust/chats/ChatsDetail.vue'));

//#IMPORT_POUP_CUSTOMER#

/** Phần popup hệ thống system */
const MsConfigLayoutList = defineAsyncComponent(() => import('@/components/layout/MsConfigLayoutList.vue'));
const ChangePassword = defineAsyncComponent(() => import('@/components/layout/ChangePassword.vue'));
const TheSettingClamp = defineAsyncComponent(() => import('@/components/system/TheSettingClamp.vue'));
const UserProfile = defineAsyncComponent(() => import('@/components/layout/UserProfile.vue'));

export const register = (app: App<Element>) => {
  app.component('UserDetail', UserDetail);
  app.component('RoleDetail', RoleDetail);
  app.component('MenuDetail', MenuDetail);
  app.component('MenuFontendDetail', MenuFontendDetail);
  app.component('QuickLinkDetail', QuickLinkDetail);
  app.component('BannerDetail', BannerDetail);
  app.component('ErrorReportDetail', ErrorReportDetail);
  app.component('JobDefinitionDetail', JobDefinitionDetail);
  app.component('LanguageDetail', LanguageDetail);
  app.component('SystemConfigDetail', SystemConfigDetail);
  app.component('ConfigNotifyDetail', ConfigNotifyDetail);
  app.component('ReceiveNotifyDetail', ReceiveNotifyDetail);
  app.component('ReceiveSelectUser', ReceiveSelectUser);
  app.component('NewsDetail', NewsDetail);
  app.component('NewsListDetail', NewsListDetail);
  app.component('DictionaryListDetail', DictionaryListDetail);
  app.component('DictionaryDetail', DictionaryDetail);
  app.component('MsConfigLayoutList', MsConfigLayoutList);
  app.component('ChangePassword', ChangePassword);
  app.component('TheSettingClamp', TheSettingClamp);
  app.component('BankDetail', BankDetail);
  app.component('UserProfile', UserProfile);
  app.component('FooterDetail', FooterDetail);
  app.component('AnoucementDetail', AnoucementDetail);
  app.component('DepartmentDetail', DepartmentDetail);
  app.component('SupportListDetail', SupportListDetail);
  app.component('PositionDetail', PositionDetail);
  app.component('SupportDetail', SupportDetail);
  app.component('ContactDetail', ContactDetail);
  app.component('KeywordDetail', KeywordDetail);
  app.component('CompanyInfoDetail', CompanyInfoDetail);
  app.component('FunctionConfigDetail', FunctionConfigDetail);
  app.component('FeaturePackageDetail', FeaturePackageDetail);
  app.component('MembershipPlanDetail', MembershipPlanDetail);
  app.component('ProvinceDetail', ProvinceDetail);
  app.component('DistrictDetail', DistrictDetail);
  app.component('WardDetail', WardDetail);
  app.component('VoucherEventDetail', VoucherEventDetail);
  app.component('VoucherDetail', VoucherDetail);
  app.component('CategoryDetail', CategoryDetail);
  app.component('MemberTypeDetail', MemberTypeDetail);
  app.component('PaymentMethodDetail', PaymentMethodDetail);
  app.component('EmoticonDetail', EmoticonDetail);
  app.component('ContractTemplateDetail', ContractTemplateDetail);
  app.component('BrandDetail', BrandDetail);
  app.component('RegisterPackageDetail', RegisterPackageDetail);
  app.component('ProductGroupDetail', ProductGroupDetail);
  app.component('SupplierDetail', SupplierDetail);
  app.component('CountryDetail', CountryDetail);
  app.component('DataControlDetail', DataControlDetail);
  app.component('WarehouseDetail', WarehouseDetail);
  app.component('ViewSupplierDetail', ViewSupplierDetail);
  app.component('StaffDetail', StaffDetail);
  app.component('RechargeDetail', RechargeDetail);
  app.component('ChatsDetail', ChatsDetail);

  //#REGIS_POUP#

}