<template>
  <div class="sidebar small" style="z-index: 100; position: relative">
    <div class="logo-sidebar line-bottom">
      <a href="/" class="logo-sidebar_menu wrap-logo-nav-left">
        <img
          class="logo-nav-left"
          src="../../assets/image/logo-white.png"
          alt=""
        />
      </a>
    </div>
    <div class="menu-sidebar">
      <div v-for="(item, index) in listMenuItem" class="menu-items">
        <router-link
          :to="item.url"
          v-if="!item.child?.length"
          @click="changeUrl(item, true)"
          class="menu-sidebar_item"
          :class="{ selected: checkActiveUrl(item) }"
        >
          <div
            class="menu-sidebar_icon d-flex justify-content-center align-center"
          >
            <i :class="item.icon" style="font-size: 24px !important"></i>
          </div>
          <div class="menu-sidebar_item-info text-uppercase">
            {{ $t(`i18nMenu.sub_system_code.${item.menu_code}`) }}
          </div>
        </router-link>
        <div
          v-else
          @click="changeUrl(item)"
          class="menu-sidebar_item"
          :class="{ selected: checkActiveUrl(item) }"
        >
          <div
            class="menu-sidebar_icon d-flex justify-content-center align-center"
          >
            <i :class="item.icon" style="font-size: 24px !important"></i>
          </div>
          <div class="menu-sidebar_item-info text-uppercase">
            {{ $t(`i18nMenu.sub_system_code.${item.menu_code}`) }}
          </div>
        </div>
      </div>
    </div>
    <the-change-language :settingApp="settingApp"></the-change-language>
  </div>
  <div
    :class="['nav-trans', { active: settingApp.showSidebar }]"
    style="position: relative; overflow: hidden"
  >
    <div
      :style="{
        position: 'relative',
        height: '100%',
      }"
      class="sidebar-transition"
    >
      <div class="menu-items">
        <div
          :style="{ position: 'absolute', width: '240px', height: '100%' }"
          :class="[
            'trans-nav nav-1 rounded-full',
            { active: settingApp.showSidebar },
          ]"
        >
          <div class="overflow-hidden">
            <h2 class="ml-3 px-5 border-line-bottom py-14px text-uppercase">
              {{ $t(`i18nMenu.sub_system_code.${listchildView.menu_code}`) }}
            </h2>
          </div>
          <div
            v-for="child in listchildView"
            class="px-4"
            style="width: 240px; min-width: 240px; overflow: hidden"
          >
            <div class="custom-expansion-panels">
              <div
                class="custom-expansion-panel"
              >
                <div class="custom-panel-header" :class="{ active: child.child.height ? true: false }" @click="toggleChild(child)">
                  <div class="d-flex justify-space-between pointer nav-item flex-center">
                    <div class="d-flex flex-center">
                      <i class="mx-6px color-icon-dark" :class="child.icon"></i>
                      <h4
                        class="font-normal over-text"
                        style="min-width: 140px; max-width: 140px"
                      >
                        {{ $t(`i18nMenu.sub_system_code.${child.menu_code}`) }}
                      </h4>
                    </div>
                    <span v-if="child.child.length > 0">
                      <i
                        :class="{ 'rotate-icon': child.child.height ? true: false }"
                        class="fa-solid fa-chevron-down color-icon-dark mr-1"
                        style="font-size: 11px"
                      ></i>
                    </span>
                  </div>
                </div>
                <div class="custom-panel-content" :style="{ maxHeight: child.child.height ? child.child.height + 'px': 0 }">
                  <div :id="`collapse-${child.menu_code}-id`">
                    <router-link
                      v-for="childItem in child.child"
                      :to="childItem.url"
                      class="d-flex align-center pointer nav-item py-2 mb-1"
                    >
                      <i class="fa-regular fa-circle mr-2 color-icon-primary" style="font-size: 10px"></i>
                      <div class="item-link" :class="{ active: fullPath === childItem.url }">
                        <p>
                          {{ $t(`i18nMenu.sub_system_code.${childItem.menu_code}`) }}
                        </p>
                      </div>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, getCurrentInstance, onMounted, ref } from "vue";
import TheChangeLanguage from "@/components/layout/TheChangeLanguage.vue";
import menuAPI from "@/apis/sys/menuAPI";
import authService from "@/commons/authService";
import { onBeforeRouteUpdate, useRoute } from 'vue-router';

export default defineComponent({
  components: {
    TheChangeLanguage,
  },
  props: {
    settingApp: {
      type: Object,
      default: {},
    },
  },
  setup() {
    const { proxy }: any = getCurrentInstance();
    const fullPath = ref(null);
    const route = useRoute();
    const listMenuItem: any [] = reactive([]); // Danh sách menu có thể nhìn thấy theo quyền hạn
    const listchildView = ref<any []>([]); // Danh sách các node child đang hiển thị

    // Hàm toggle xổ xuống
    const changeUrl = (menu: any, isColapse = false) => {
      const me = proxy;
      if(!menu.child?.length && isColapse){
        me.settingApp.showSidebar = false;
      }
      else{
        listchildView.value = menu.child;
        me.settingApp.showSidebar = true;
      }
    };
    const toggleChild = (child: any) => {
      listchildView.value.forEach(_ => {
        if(child.menu_id != _.menu_id){
          _.child.height = 0;
        }
      });
      if(child?.child?.length){
        const elmToggle = document.getElementById(`collapse-${child.menu_code}-id`);
        if(elmToggle){
          if(child.child.height){
            child.child.height = 0;
          }
          else
          {
            child.child.height = elmToggle.clientHeight;
          }
        }
      }
    };

    onBeforeRouteUpdate((to, from) => {
      fullPath.value = to.fullPath;
    });

    /**
     * Xử lý check active menu cấp cha cao nhất theo trang đang được active
     */
    const checkActiveUrl = (menu) => {
      if(menu.url == fullPath.value) return true;
      if(menu.child?.length){ // check đến 3 cấp
        for (let i = 0; i < menu.child.length; i++){
          let child = menu.child[i];
          if(child.child?.length){
            for (let j = 0; j < child.child.length; j++){
              if(child.child[j].url == fullPath.value){
                return true;
              }
            }
          }
        }
      }
      return false;
    };

    /**
     * Khởi tạo các màn hình có thể view
     */
    onMounted(async () => {
      // const me = proxy;
      // fullPath.value = route.fullPath;
      // await authService.getAllPermission();
      // const allMenu = await loadAllMenu();
      // allMenu.forEach((item) => {
      //   item.width = 600;
      //   item.isShowOneLine = false; // chỉ show lấy 1 dòng
      //   if (
      //     (!item.child.length && checkPermissionView(item.menu_code)) ||
      //     (item.child.length && processChildMenuItem(item))
      //   ) {
      //     listMenuItem.push(item);
      //   }
      // });
    });
    /**
     * Load toàn bộ menu về
     */
    const loadAllMenu = async () => {
      const me = proxy;
      let allMenu: any[] = [];
      const payload = {
        PageIndex: 0,
        PageSize: 0,
        Columns: "*",
        Filter: JSON.stringify([["is_active","=",true], 'and', ["menu_type", "=", 'web']]),
        Sort: "",
        CustomParam: {},
      };
      me.$ms.commonFn.mask();
      const result = await menuAPI.getList(payload);
      me.$ms.commonFn.unmask();
      if (result?.Success && result?.Data?.PageData?.length) {
        allMenu = sortMenuByParentChild(result.Data.PageData);
      }
      return allMenu;
    };

    /**
     * sắp xếp cha con và sort
     */
    const sortMenuByParentChild = (menus: any[]) => {
      const idMap = new Map();
      const roots: any[] = [];

      // Bước 1: Tạo Map để ánh xạ menu_id
      menus.forEach((menu: any) => {
        menu.child = []; // Khởi tạo danh sách con
        idMap.set(menu.menu_id, menu);
      });

      // Bước 2: Xây dựng cây cha-con
      menus.forEach((menu: any) => {
        if (menu.parent_id) {
          // Nếu có parent_id, thêm vào child của cha
          const parent = idMap.get(menu.parent_id);
          if (parent) {
            parent.child.push(menu);
          }
        } else {
          // Nếu không có parent_id, đó là nút gốc
          roots.push(menu);
        }
      });

      // Hàm sắp xếp các menu theo trường `sort`
      const sortMenus = (menuList: any[]) => {
        menuList.sort((a, b) => a.sort - b.sort);
        menuList.forEach((menu) => {
          if (menu.child && menu.child.length > 0) {
            sortMenus(menu.child); // Đệ quy sắp xếp danh sách con
          }
        });
      };
      // Bước 3: Sắp xếp danh sách gốc và con theo `sort`
      sortMenus(roots);
      return roots;
    };

    /**
     * Check quyền màn hình Child
     */
    const processChildMenuItem = (menuItem: any) => {
      if (menuItem.child?.length) {
        menuItem.child.forEach((item: any) => {
          item.child = item.child.filter((_: any) =>
            checkPermissionView(_.menu_code)
          );
        });
        menuItem.child = menuItem.child.filter((_: any) => {
          _.child.height = 0;
          return _.child.length;
        });
        menuItem.child.menu_code = menuItem.menu_code;
        if (menuItem.child.length) {
          return true;
        }
      }
      return false;
    };

    /**
     * Check quyền view màn hình theo sub_system_code
     */
    const checkPermissionView = (sub_system_code: string) => {
      if (!sub_system_code) return true;
      return authService.checkActionPermissonNotAsync("View", sub_system_code);
    };

    return {
      listMenuItem,
      listchildView,
      toggleChild,
      checkActiveUrl,
      changeUrl,
      fullPath,
    };
  },
});
</script>

<style lang="scss" scoped>
.pb-15px {
  padding-bottom: 15px;
}
/* chia sidebar
----------------------------
*/
.item-link {
  color: black;
}
.item-link.active {
  color: var(--primary__color-active) !important;
}
.item-link:hover {
  color: var(--primary__color-hover);
}

.sidebar-transition {
  transition: padding-left 0.3s ease-in-out;
}
.nav-trans {
  background-color: white;
  height: 100vh;
  width: 0px;
  transition: width 0.3s ease-in-out;
  left: 0px;
  box-shadow: 0 0 0 0 #0000, 0 0 0 0 #0000, 0 3px 10px 0 rgb(48 46 56 / 6%);
}

.nav-item.active {
  padding: 12px 0px;
  border-radius: 8px;
}

.nav-cher {
  position: absolute;
  border-radius: 100%;
  border: none;
  background-color: transparent;
  width: 36px;
  height: 36px;
  z-index: 99;
  transition: background-color 0.3s ease-in-out;
}
.nav-cher:hover {
  background-color: #efefef;
  cursor: pointer;
}

.trans-nav {
  transition: left 0.3s ease-in-out;
  left: -160px;
}
.trans-nav.nav-cher.active {
  top: 6px;
  left: 280px;
}

.trans-nav.nav-1.active {
  top: 0px;
  left: 0px;
}

.border-bottom {
  border-bottom: 0.4px solid #5b5b5b;
}

.nav-trans.active {
  min-width: 240px;
  width: 240px;
}
.sidebar {
  position: relative;
  width: 200px;
  min-width: 200px;
  background-color: var(--menu__color);
  height: 100vh;
  top: 0;
  left: 0;
  &.small {
    width: 80px;
    min-width: 80px !important;
  }
}

/* Phần logo sidebar */
.logo-sidebar {
  display: flex;
  align-items: center;
  padding: 10px 18px 18px;
  height: 48px;
  justify-content: center;
}
.logo-sidebar_home {
  width: 24px;
  height: 24px;
  margin-right: 12px;
  background: var(--url__icon) no-repeat -424px -86px;
}
.logo-sidebar_menu {
  margin-right: 6px;
}
.logo-sidebar_menu img {
  height: 32px;
  vertical-align: middle;
  max-width: 104px !important;
  transform: scale(1.15);
  max-height: 36px;
}
.logo-sidebar_active {
  background: var(--url__icon) no-repeat;
  background-position: -316px -37px;
  width: 16px;
  height: 14px;
  cursor: pointer;
}

/* Phần menu */
.menu-sidebar {
  padding-top: 14px;
}
.menu-sidebar_item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--while__color);
  height: 54px;
  padding: 0 12px;
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease;
}

.py-14px {
  padding-top: 14px;
  padding-bottom: 14px;
}

.menu-sidebar_item:hover .menu-sidebar_item-info {
  opacity: 1;
  visibility: visible;
}
.menu-sidebar_item-info {
  position: absolute;
  opacity: 0;
  visibility: hidden;
  background-color: var(--primary__color-hover);
  height: 40px;
  padding: 11px 16px;
  border-radius: 4px;
  white-space: nowrap;
  left: 84px;
  top: 2;
  z-index: 10;
}
.menu-sidebar_item-info::before {
  position: absolute;
  content: "";
  width: 0px;
  height: 0px;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid var(--primary__color-hover);
  transform: rotate(-90deg);
  top: 50%;
  margin-top: -4px;
  left: -8px;
}

.menu-sidebar_item.selected .menu-sidebar_icon {
  border-radius: 8px;
  background-color: var(--menu__color-active);
}
.menu-sidebar_item:hover .menu-sidebar_icon {
  border-radius: 8px;
  background-color: var(--menu__color-hover);
}
.menu-sidebar_item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 6px;
  height: 100%;
}
.menu-sidebar_item.selected::before {
  background-color: var(--while__color);
}
.menu-sidebar_text {
  margin-left: 12px;
}
.menu-sidebar_item.selected .menu-sidebar_text {
  font-family: "notosans-bold";
}
.child-menu {
  &::before {
    content: "";
    position: absolute;
    left: -40px;
    top: 0;
    width: 40px;
    height: 100%;
  }
  display: none;
  position: fixed;
  left: 202px;
  z-index: 10;
  padding: 18px 8px 6px 8px;
  background-color: var(--menu__color);
  flex-wrap: wrap;
  border-radius: 4px;
  .child-menu-item {
    width: 50%;
    padding: 0 8px;
    margin-bottom: 16px;
    .menu-sidebar_item {
      padding: 0 6px;
      height: 26px;
    }
    .group-title {
      background-color: #191919;
      border-radius: 4px;
      font-family: "notosans-semibold";
      font-weight: 700;
      cursor: unset;
      &::before {
        background-color: unset;
      }
    }
  }
  .contaner-child-menu-item {
    margin-top: 10px;
    margin-left: 24px;
    border-left: 0.4px solid white;
    .child-menu-item {
      width: 100%;
      height: 32px;
      margin-bottom: 0;
    }
  }
}
.is-show-one-line {
  .child-menu-item {
    width: 100% !important;
  }
}
/* Khi nav-item được hover hoặc active, thay đổi màu */
.nav-item {
  transition: color 0.2s ease-in-out; /* Thêm transition cho màu */
}

// .nav-item:hover i,
// .nav-item:hover a,
// .nav-item:hover h4 {
//   color: white !important; /* Màu khi hover hoặc active */
// }

.custom-panel-header {
  cursor: pointer;
  padding: 12px 8px 12px 5px;
  margin: 4px 0px;
  border-radius: 8px;
  background-color: var(--primary_color-notactive);
  transition: background 0.5s ease, color 0.3s ease;
}
.custom-panel-header.active {
  background-color: var(--primary__color-active) !important;
}

.custom-panel-header:hover {
  background-color: var(--primary__color-hover) !important;
}

.custom-panel-header:hover i,
.custom-panel-header:hover h4 {
  color: white !important;
}

.custom-panel-header.active i,
.custom-panel-header.active h4 {
  color: white !important;
}
.custom-expansion-panel.active .nav-item:hover i,
.custom-expansion-panel.active .nav-item:hover a,
.custom-expansion-panel.active .nav-item:hover .item-link,
.custom-expansion-panel.active .nav-item:hover h4 {
  color: var(--primary__color-hover) !important;
}

.custom-panel-content {
  padding: 0px 16px;
  overflow: hidden;
  transition: max-height 0.5s ease;
}

.custom-panel-content > div {
  padding: 8px 0px;
  background-color: #fff;
}
.rotate-icon {
  transform: rotate(180deg);
  transition: transform 0.5s;
}
.wrap-logo-nav-left {
  max-height: 38px;
  min-height: 38px;
  max-width: 44px;
  min-width: 44px;
  overflow: hidden;
}
.logo-nav-left {
  position: relative;
  top: 6px;
  left: 10px;
}
.custom-panel-content .nav-item:not(.active):hover i,
.custom-panel-content .nav-item:not(.active):hover h4,
.custom-panel-content .nav-item:not(.active):hover a {
  color: var(--primary__color-hover) !important;
}

.mx-6px {
  margin-left: 6px !important;
  margin-right: 6px !important;
}
.line-bottom {
  border-bottom: 1px solid var(--menu__color-hover);
}
.line-top {
  border-bottom: 1px solid var(--menu__color-hover);
}
</style>
