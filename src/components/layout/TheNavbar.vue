<template>
  <div class="header">
    <div class="content-header_info">
      <div
        class="wrap-icon_toggle mr-3 pa-2"
        @click="handleClickToggleLeftMenu"
      >
        <i
          v-if="settingApp.showSidebar"
          class="fa-solid fa-chevron-left icon-toggle"
          style="width: 16px; height: 16px; cursor: pointer; text-align: center"
        ></i>
        <i
          v-else
          class="fa-solid fa-bars icon-toggle"
          style="width: 16px; height: 16px; cursor: pointer; text-align: center"
        ></i>
      </div>
      <div class="header-text text-uppercase">
        {{ $t("i18nCommon.PortManageHuntjob") }}
      </div>
    </div>
    <div class="content-header_info">
      <button class="header-bell_setting">
        <ul class="rounded-top-left-4 rounded-top-right-4">
          <li
            @click="openSettingClamp"
            class="p-2 mx-1 rounded-4"
            style="width: 180px"
          >
            <i class="fa-solid fa-sliders mr-2 color-icon-primary"></i>
            {{ $t("i18nCommon.SettingDisplay") }}
          </li>
        </ul>
      </button>
      <button class="header-user">
        <div class="image-container" v-if="!user.avartar" style="width: 32px; height: 32px"></div>
        <div class="image-user-profile" v-else style="width: 32px; height: 32px">
          <img style="width: 100%; height: 100%; border-radius: 50%;" :src="fileAPI.getFileViewUrl(user.avartar)" alt="">
        </div>

        <!-- <div class="header-user_name text-color-primary">
          {{ user.user_full_name }}
        </div>
        <div class="header-user_icon"></div> -->
        <ul style="min-width: 120px" class="pa-0 shadow-xl">
          <li class="flex pb-2" style="background-color: var(--primary__color)">
            <div v-if="!user.avartar" class="image-container" style="width: 40px; height: 40px"></div>
            <div class="image-user-profile" v-else style="width: 40px; height: 40px">
              <img style="width: 100%; height: 100%; border-radius: 50%;" :src="fileAPI.getFileViewUrl(user.avartar)" alt="">
            </div>

            <div class="header-user_name ml-3" style="flex-grow: 1">
              <h4
                style="
                  text-align: left;
                  color: white;
                  font-size: 16px !important;
                "
              >
                {{ user.user_full_name }}
              </h4>
              <p class="subtitle_user mt-1" style="font-size: 14px !important">
                {{ user.email }}
              </p>
            </div>
          </li>
          <li class="py-2 my-1" @click="changePassword">
            <div class="icon-svg-container mr-2">
              <svg
                width="18px"
                height="18px"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M8.67928 4.49258C11.6694 1.50247 16.5173 1.50247 19.5074 4.49258C22.4975 7.48269 22.4975 12.3306 19.5074 15.3207C17.5214 17.3068 14.716 17.9728 12.1823 17.3221C12.0324 17.2836 11.9181 17.3287 11.8623 17.3845L8.14989 21.0968C7.67087 21.5759 7.00007 21.8112 6.32678 21.7364L4.23819 21.5043C3.84626 21.4607 3.48082 21.2851 3.20197 21.0063L2.99376 20.798C2.71491 20.5192 2.53927 20.1537 2.49572 19.7618L2.26365 17.6732C2.18884 16.9999 2.42415 16.3291 2.90317 15.8501L6.61526 12.138C6.67127 12.082 6.7163 11.9672 6.67789 11.8177C6.02725 9.28401 6.69321 6.47865 8.67928 4.49258ZM18.4468 5.55324C16.0424 3.14892 12.1443 3.14892 9.73994 5.55324C8.14413 7.14906 7.60656 9.4033 8.13075 11.4446C8.28182 12.0329 8.15857 12.716 7.67592 13.1987L3.96383 16.9108C3.80702 17.0676 3.72999 17.2872 3.75448 17.5076L3.98655 19.5962C3.99248 19.6496 4.01642 19.6994 4.05442 19.7374L4.26263 19.9456C4.30063 19.9836 4.35043 20.0075 4.40384 20.0135L6.49243 20.2455C6.71284 20.27 6.93242 20.193 7.08923 20.0362L7.79638 19.329L6.58351 18.1294C6.28901 17.8382 6.2864 17.3633 6.57768 17.0688C6.86896 16.7743 7.34382 16.7717 7.63832 17.063L8.85705 18.2684L10.8016 16.3238C11.2845 15.8409 11.9675 15.7183 12.5554 15.8693C14.5967 16.3934 16.851 15.8559 18.4468 14.2601C20.8511 11.8557 20.8511 7.95756 18.4468 5.55324ZM12.0555 8.05546C13.1294 6.98151 14.8706 6.98151 15.9445 8.05546C17.0185 9.1294 17.0185 10.8706 15.9445 11.9445C14.8706 13.0185 13.1294 13.0185 12.0555 11.9445C10.9815 10.8706 10.9815 9.1294 12.0555 8.05546ZM14.8839 9.11612C14.3957 8.62796 13.6043 8.62796 13.1161 9.11612C12.628 9.60427 12.628 10.3957 13.1161 10.8839C13.6043 11.372 14.3957 11.372 14.8839 10.8839C15.372 10.3957 15.372 9.60427 14.8839 9.11612Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            {{ $t("i18nCommon.ChangePass") }}
          </li>
          <li class="py-2 my-1" @click="openUserProfile">
            <i
              class="fa-solid fa-info mr-2 color-icon-primary border-solid-icon icon-size-small"
            ></i>
            {{ $t("i18nCommon.UpdateInfo") }}
          </li>
          <div class="mb-1 border-line-top btn-logout">
            <div
              class="px-3 mt-1 d-flex align-center py-2"
              style="width: 180px"
              @click="handleLogout"
            >
              <div class="icon-svg-container mr-2">
                <svg
                  width="18px"
                  height="18px"
                  viewBox="0 0 24.00 24.00"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#000000"
                  stroke-width="0.00024000000000000003"
                  transform="rotate(0)matrix(1, 0, 0, 1, 0, 0)"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M2 6.5C2 4.01472 4.01472 2 6.5 2H12C14.2091 2 16 3.79086 16 6V7C16 7.55228 15.5523 8 15 8C14.4477 8 14 7.55228 14 7V6C14 4.89543 13.1046 4 12 4H6.5C5.11929 4 4 5.11929 4 6.5V17.5C4 18.8807 5.11929 20 6.5 20H12C13.1046 20 14 19.1046 14 18V17C14 16.4477 14.4477 16 15 16C15.5523 16 16 16.4477 16 17V18C16 20.2091 14.2091 22 12 22H6.5C4.01472 22 2 19.9853 2 17.5V6.5ZM18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289L22.7071 11.2929C23.0976 11.6834 23.0976 12.3166 22.7071 12.7071L19.7071 15.7071C19.3166 16.0976 18.6834 16.0976 18.2929 15.7071C17.9024 15.3166 17.9024 14.6834 18.2929 14.2929L19.5858 13L11 13C10.4477 13 10 12.5523 10 12C10 11.4477 10.4477 11 11 11L19.5858 11L18.2929 9.70711C17.9024 9.31658 17.9024 8.68342 18.2929 8.29289Z"
                      fill="currentColor"
                    ></path>
                  </g>
                </svg>
              </div>

              {{ $t("i18nCommon.Logout") }}
            </div>
          </div>
        </ul>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, onBeforeMount, ref } from "vue";
import popupUtil from "@/commons/popupUtil";
import userAPI from "@/apis/sys/userAPI";
import fileAPI from "@/apis/file/fileAPI";

export default defineComponent({
  props: {
    settingApp: {
      type: Object,
      default: {},
    },
  },
  setup() {
    const { proxy }: any = getCurrentInstance();
    const user = ref<any>({});

    onBeforeMount(async () => {
      const userStore = await getUserByID();
      if (userStore) {
        user.value = userStore;
      }
    });

    /**
     * Get ra user để bind dữ liệu
     */
    const getUserByID = async () => {
      // const me: any = proxy;
      // const userStore = me.$ms.commonFn.getUser();
      // me.$ms.commonFn.mask();
      // let payload = { id: userStore.user_id }
      // let res = await userAPI.getEdit(payload);
      // me.$ms.commonFn.unmask();
      // if (res?.Success){
      //   return res.Data;
      // }
      // return {};
    };

    /**
     * Xử lý toggle LeftMenu
     */
    const handleClickToggleLeftMenu = () => {
      const me = proxy;
      me.settingApp.showSidebar = !me.settingApp.showSidebar;
    };

    /**
     * Mở setting grid
     */
    const openSettingClamp = () => {
      popupUtil.show("TheSettingClamp");
    };

    /**
     * Đăng xuất
     */
    const handleLogout = async () => {
      const me = proxy;
      me.$ms.commonFn.logout();
    };

    /**
     * mở form đổi mật khẩu
     */
    const changePassword = () => {
      popupUtil.show("ChangePassword");
    };

    /**
     * Thực hiện update lại thông tin user
     */
    const reloadUpdateUser = (userStore) => {
      if(userStore){
        user.value = userStore;
      }
    };

    /**
     * Mở form user profile
     */
    const openUserProfile = async () => {
      const me: any = proxy;
      const userStore = await getUserByID();
      if(userStore){
        let param = {
          formState: me.$ms.constant.FormState.Edit,
          dataRow: userStore,
          reloadUpdateUser: reloadUpdateUser,
        }
        popupUtil.show("UserProfile", param);
      }
    };

    return {
      user,
      fileAPI,
      changePassword,
      handleLogout,
      openSettingClamp,
      handleClickToggleLeftMenu,
      openUserProfile,
    };
  },
});
</script>

<style lang="scss" scoped>
/* phần header công ty */
img{
  border: 1px solid #e0e0e0;
}
.header {
  height: var(--height__header);
  min-height: var(--height__header);
  background-color: var(--while__color);
  padding: 10px 24px;
  margin: 0px 5px;
  display: flex;
  justify-content: space-between;
  font-family: "notosans-semibold";
}
.content-header_info {
  display: flex;
  align-items: center;
  height: 100%;
}
.header-icon_left {
  width: 16px;
  height: 14px;
  cursor: pointer;
  margin-right: 24px;
  background: var(--url__icon) no-repeat -847px -35px;
}
.header-text {
  text-transform: uppercase;
  font-size: 14px;
}
.header-icon_right {
  background: var(--url__icon) no-repeat -84px -361px;
  width: 8px;
  height: 14px;
  transform: rotate(90deg);
  cursor: pointer;
  margin-left: 14px;
}
/* Phần header người dùng */
/* Phần header thông báo */
.header-bell_notification {
  background: var(--url__icon) no-repeat -788px -30px;
  width: 24px;
  height: 24px;
  margin-right: 24px;
  cursor: pointer;
}
/* header thao tác người dùng */
.header-user_avatar {
  background: var(--url__avatar) no-repeat;
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.image-container {
  background-image: url("../../assets/image/imageAvatar.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 100%;
}
.header-user {
  display: flex;
  align-items: center;
  outline: none;
  z-index: 10;
  border: none;
  position: relative;
  background-color: var(--while__color);
  cursor: pointer;
}
.header-user_name {
  margin-left: 5px;
  font-family: "notosans-semibold";
}
.subtitle_user {
  color: #dedede;
  font-weight: 300;
  font-size: 12px;
  text-align: left;
  overflow-wrap: break-word;
  word-wrap: break-word;
  white-space: normal;
  word-break: break-word;
}
.header-user_icon {
  background: var(--url__icon) no-repeat -1078px -38px;
  width: 9px;
  height: 6px;
  cursor: pointer;
  margin-left: 6px;
}
.header-bell_setting {
  position: relative;
  background: var(--url__icon) no-repeat;
  width: 24px;
  height: 24px;
  cursor: pointer;
  margin-right: 24px;
  background-position: -675px -30px;
  outline: none;
  border: none;
}
.header-bell_setting ul,
.header-user ul {
  background-color: var(--while__color);
  z-index: 1;
  position: absolute;
  right: 0;
  top: 50px;
  // box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.25);
  transition: all ease-in-out 0.15s;
  padding: 3px 0;
  color: var(--text__color);
  font-family: "notosans-regular";
  border-radius: 2px;
  border: solid 1px var(--border__input);
  opacity: 0;
  visibility: hidden;
}
.header-bell_setting ul li,
.header-user ul li {
  list-style: none;
  white-space: nowrap;
  display: flex;
  width: 290px;
  align-items: center;
  text-align: left;
  padding: 5px 10px;
  cursor: pointer;
  transition: all ease 0.15s;
  color: inherit;
}
.header-user ul li:hover,
ul li:hover {
  color: var(--primary__color-hover);
}

.header-user ul li:hover i.fa-info {
  color: var(--primary__color-hover);
  border: 1px solid var(--primary__color-hover);
}

.header-user ul li:hover i,
ul li:hover i {
  color: var(--primary__color-hover);
}

.header-bell_setting:focus ul,
.header-user:focus ul {
  opacity: 1;
  visibility: visible;
  top: 38px;
}
.wrap-icon_toggle {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  transition: background 0.3s ease, color 0.3s ease;
}
.wrap-icon_toggle:hover {
  background: var(--primary__color-hover);
  color: white;
}
.btn-logout:hover div,
.btn-logout:hover p {
  color: var(--primary__color-hover);
}
.icon-toggle::before {
  position: relative;
  top: 2px;
}

.text-icon-svg {
  margin-left: 4px;
  width: 16px;
  height: 16px;
  min-width: 16px;
  min-height: 16px;
  cursor: pointer;
  background: var(--url__test) no-repeat;
  background-position: center;
  background-size: contain;
}
.svg-icon {
  width: 50px;
  height: 50px;
}

.svg-path {
  stroke: #000; /* Đặt màu mặc định */
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-opacity: 0.5; /* Điều chỉnh độ sáng (opacity) */
  transition: stroke-opacity 0.3s ease; /* Hiệu ứng chuyển mượt */
}

/* Tăng sáng khi hover */
.svg-icon:hover .svg-path {
  stroke-opacity: 1;
}
</style>
