<template>
  <div class="background">
    <div class="container-login">
      <form @submit.prevent="handleLogin()" class="form form_user_in">
        <div class="logo-container">
          <img
            src="../assets/image/logo.png"
            alt="Logo" class="logo"
          />
        </div>
        <div class="form-header-login">
          <div class="title-login">
            <h2 style="font-weight: 500">{{ $t("i18nCommon.huntJob") }}</h2>
            <p style="color:rgb(89 78 78)">{{ $t("i18nCommon.login_title") }}</p>
          </div>
        </div>
        <div class="form-container-login">
          <div class="form-item_input">
            <div class="form-group pa-0">
              <ms-input
                :placeholder="$t('i18nUser.Detail.user_name')"
                v-model="user.user_name"
                :styleCustom="{
                  paddingLeft: '32px',
                  height: '36px',
                  backgroundColor: '#404b6569',
                  borderColor: '#495c85',
                  borderRadius: '5px',
                  color: '#f0f2f5',
                }"
              >
                <template #iconCustom>
                  <div class="icon-wrapper">
                    <i
                      :class="['fa-solid', 'fa-envelope']"
                      class="left-inner"
                      :style="{ color: '#b6b7b7' }"
                    ></i>
                  </div>
                </template>
              </ms-input>
            </div>
          </div>
          <div class="form-item_input">
            <div class="form-group pass">
              <ms-input
                :placeholder="$t('i18nUser.Detail.password')"
                :type="typePass"
                v-model="user.password"
                :styleCustom="{
                  paddingLeft: '32px',
                  height: '36px',
                  backgroundColor: '#404b6569',
                  borderColor: '#495c85',
                  borderRadius: '5px',
                  color: '#f0f2f5',
                }"
              >
                <template #iconCustom>
                  <div class="icon-wrapper">
                    <i
                      :class="['fa-solid', 'fa-key']"
                      class="left-inner"
                      :style="{ color: '#b6b7b7' }"
                    ></i>
                  </div>
                </template>
              </ms-input>
              <i class="eye" :class="typePass" @click="handleShowPass"></i>
            </div>
          </div>
        </div>
        <div class="form-action action-btn mt-4">
          <div class="form-action_container-login">
            <div style="width: 100%" class="form-action_item">
              <ms-button
                style="width: 100%"
                type="submit"
                class="btn btn-login primary"
              >
                {{ $t("i18nCommon.Login") }}
              </ms-button>
            </div>
          </div>
        </div>
        <div :style="{ padding: '24px 0px', fontSize: '12px' }">
          
          <a
            href="https://hugreen24h.vn"
            target="_blank"
            rel="noopener"
            style="color:rgb(89, 78, 78);"
            >©www.green24h.vn - All right reserved 2024</a
          >
          
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import userAPI from "@/apis/sys/userAPI";
import { defineComponent, getCurrentInstance, reactive, ref } from "vue";

export default defineComponent({
  components: {},
  setup: () => {
    const { proxy }: any = getCurrentInstance(); // Instance của component
    const user = reactive({
      user_name: "",
      password: "",
    });
    const typePass = ref("password");

    /**
     * Xử lý toggle xem password
     */
    const handleShowPass = () => {
      if (typePass.value === "password") {
        typePass.value = "text";
      } else {
        typePass.value = "password";
      }
    };

    /**
     * Hàm xử lý login
     */
    const handleLogin = async () => {
      const me: any = proxy;
      me.$ms.commonFn.mask();
      const result = await userAPI.login(user);
      me.$ms.commonFn.unmask();
      if (result?.Data?.access_token) {
        me.$ms.commonFn.setUser(result.Data);
        window.location.reload();
      } else {
        me.$ms.commonFn.pushNotification({
          type: me.$ms.constant.ENotificationType.Error,
          message: me.$t( result?.UserMessage ? result.UserMessage : "i18nCommon.is_valid_user"),
        });
      }
    };

    return {
      user,
      typePass,
      handleLogin,
      handleShowPass,
    };
  },
});
</script>

<style lang="scss" scoped>
.background {
  display: flex;
  justify-content: center;  
  align-items: center;
  height: 100vh;
  width: 100%;
  background: url(/src/assets/image/bg-03.jpg) top no-repeat;
  background-size: cover;
}
.logo {
  position: relative;
  width:75px;
  align:center;
}
.container-login {
  position: relative;
  display: flex;
}
.title-login {
  margin: 24px 0px;
}
.title-login h2 {
  color: #454649;
  font-size: 22px;
}
.form_user_in {
  background-color:rgb(219 221 227 / 86%);
  color: #fff;
  height: 60%;
  width: 340px;
  padding: 36px 42px;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.5);
  text-align: center;
}
.pass {
  position: relative;
}
.action-btn {
  margin-top: 24px;
}
.btn-login {
  color: #f0f2f5;
  border: none;
  width: 100%;
  font-size: 14px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
}
.eye {
  display: block;
  width: 16px;
  height: 16px;
  position: absolute;
  top: 56%;
  cursor: pointer;
  transform: translateY(-50%);
  right: 8px;
}
.eye.password {
  background: url("../assets/image/icon-hide-pass.svg") center no-repeat;
}
.eye.text {
  background: url("../assets/image/icon-show-pass.svg") center no-repeat;
}
// :deep(.ms-input){
//   background-color: red;
// }
.left-inner {
  position: absolute;
  z-index: 1;
  color: black;
  top: -11px;
  left: 7px;
}
.right-inner {
  position: absolute;
  z-index: 1;
  color: black;
  top: -11px;
  right: 7px;
}

.icon-wrapper {
  left: -124px;
  top: 27px;
  position: relative;
  display: inline-block;
}

.hover-content {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  top: -50px; /* Đặt tooltip phía trên icon */
  left: 30px;
  transform: translateX(-50%);
  background-color: #333;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 10;
  transition: opacity 0.3s;
}
.icon-wrapper:hover .hover-content {
  visibility: visible;
  opacity: 1;
}
:deep(input) {
  border: solid 0.4px var(--border__input);
}
</style>
