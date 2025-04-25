<template>
  <ms-dynamic-popup
    :width="500"
    :height="450"
    :title="$t('i18nCommon.ChangePass')"
    @beforeOpen="beforeOpen"
  >
    <template v-slot:content="{ close }">
      <div ref="slot-content" class="form-content-popup">
        <div class="form-container mt-4">
          <div class="form-group">
            <ms-input
              :rules="[{ name: 'required' }]"
              :label="$t('i18nUser.Detail.password')"
              v-model="model.password"
              :type="typePass"
            ></ms-input>
            <i class="eye" :class="typePass" @click="() => {
              if(typePass === 'password'){
                typePass = 'text';
              }
              else{
                typePass = 'password';
              }
            }"></i>
          </div>
          <div class="form-group">
            <ms-input
              :rules="[{ name: 'required' }]"
              :label="$t('i18nUser.Detail.password_new')"
              v-model="model.password_new"
              :type="typePassNew"
            ></ms-input>
            <i class="eye" :class="typePassNew" @click="() => {
              if(typePassNew === 'password'){
                typePassNew = 'text';
              }
              else{
                typePassNew = 'password';
              }
            }"></i>
          </div>
          <div class="form-group">
            <ms-input
              :rules="[{ name: 'required' }]"
              :label="$t('i18nUser.Detail.password_new_confirm')"
              v-model="model.password_new_confirm"
              :type="typePassNewConfirm"
            ></ms-input>
            <i class="eye" :class="typePassNewConfirm" @click="() => {
              if(typePassNewConfirm === 'password'){
                typePassNewConfirm = 'text';
              }
              else{
                typePassNewConfirm = 'password';
              }
            }"></i>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer="{ close }">
      <div class="form-action">
        <div class="form-action_container">
          <div class="form-action_item">
            <ms-button @click="close">
              {{ $t("i18nCommon.Close") }}
            </ms-button>
          </div>
          <div class="form-action_item">
            <ms-button @click="save" class="primary">
              {{ $t("i18nCommon.crud.save") }}
            </ms-button>
          </div>
        </div>
      </div>
    </template>
  </ms-dynamic-popup>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref } from "vue";
import { validateComponent } from '@/mixins/component/validateComponent';
import { showError } from "@/commons/globalMessage";
import userAPI from "@/apis/sys/userAPI";

export default defineComponent({
  mixins: [validateComponent],
  props: {},
  setup() {
    const { proxy }: any = getCurrentInstance();
    const typePass = ref("password");
    const typePassNew = ref("password");
    const typePassNewConfirm = ref("password");
    const model = ref({
      user_id: null,
      password: null,
      password_new: null,
      password_new_confirm: null,
    });

    /**
     * Lưu đổi mk
     */
    const save = async () => {
      const me: any = proxy;
      if(await validateSave()){
        me.$ms.commonFn.mask();
        const result = await userAPI.changePassword(model.value);
        me.$ms.commonFn.unmask();
        if(result?.Success && result?.Data){
          me.$ms.commonFn.pushNotification({
            type: me.$ms.constant.ENotificationType.Success,
            message: me.$t('i18nUser.Detail.change_password_success'),
          });
          hide();
        }
        else{
          showError(me.$t('i18nUser.Detail.is_valid_password'));
        }
      }
    };

    /**
     * Validate dữ liệu trước khi save
     */
    const validateSave = async () => {
      const me: any = proxy;
      if(!(await me.validateComponents())){
        return false;
      }
      if(model.value.password_new != model.value.password_new_confirm){
        showError(me.$t('i18nUser.Detail.not_access_password'));
        return false;
      }
      return true;
    };

    /**
     * Xử lý khi mở popup
     */
     const beforeOpen = (e: any) => {
      const me: any = proxy;
      setTimeout(() => {
        me.$ms.commonFn.focusFirstControl(me.$refs['slot-content']);
      }, 100);
      me._popup = me.$vfm.dynamicModals[me.$vfm.dynamicModals.length - 1];
      me._formParam = e.ref.params._rawValue
        ? e.ref.params._rawValue
        : e.ref.params;
      if(me._formParam?.user_id){
        model.value.user_id = me._formParam.user_id;
      }
      else{
        const user = me.$ms.commonFn.getUser();
        if(user?.user_id){
          model.value.user_id = user.user_id;
        }
      }
     };

     /**
     * Đóng form
     */
    const hide = () => {
      try {
        const me: any = proxy;
        me._popup.value = false;
        me.$nextTick(() => {
          delete me._popup;
        });
      } catch (ex) {
        console.error(ex);
      }
    };

    return {
      model,
      typePass,
      typePassNew,
      typePassNewConfirm,
      save,
      beforeOpen,
    };
  },
});
</script>

<style lang="scss" scoped>
.eye{
	display: block;
	width: 16px;
	height: 16px;
	position: absolute;
	top: 41px;
	cursor: pointer;
	transform: translateY(-50%);
	right: 8px;
}
.form-group{
  position: relative;
}
.eye.password{
	background: url('../../assets/image/white-icon-hide-pass.svg') center no-repeat;
}
.eye.text{
	background: url('../../assets/image/white-icon-show-pass.svg') center no-repeat;
}
</style>
