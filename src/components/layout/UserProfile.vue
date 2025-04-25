<template>
  <ms-dynamic-popup
    :width="1000"
    :height="600"
    :title="$t('i18nUser.UpdateInfo')"
    @beforeOpen="beforeOpen"
  >
    <template v-slot:content="{ close }">
      <div ref="slot-content" class="form-content-popup">
        <div class="form-container mt-4">
          <div class="form-detail flex flex-center">
            <ms-file-image
              v-model="model.avartar"
              :path="'/user/avatar'"
            ></ms-file-image>
          </div>
          <div class="form-detail flex">
            <div class="form-item">
              <div class="form-item_input">
                <div class="form-group ms-small">
                  <ms-input
                    :disabled="true"
                    :maxLength="30"
                    :rules="[{ name: 'required' }]"
                    :label="$t('i18nUser.Detail.user_name')"
                    v-model="model.user_name"
                  ></ms-input>
                </div>
                <div class="form-group ms-big">
                  <ms-input
                    :disabled="true"
                    :maxLength="150"
                    :rules="[{ name: 'required' }]"
                    :label="$t('i18nUser.Detail.user_full_name')"
                    v-model="model.user_full_name"
                  ></ms-input>
                </div>
              </div>
              <div class="form-item_input">
                <div class="form-group ms-small">
                  <ms-input
                    :maxLength="13"
                    :rules="[{ name: 'pattern', compareValue: 'phone' }]"
                    :label="$t('i18nUser.Detail.phone_number')"
                    v-model="model.phone_number"
                  ></ms-input>
                </div>
                <div class="form-group ms-big">
                  <ms-input
                    :maxLength="50"
                    :rules="[{ name: 'pattern', compareValue: 'email' }]"
                    :label="$t('i18nUser.Detail.email')"
                    v-model="model.email"
                  ></ms-input>
                </div>
              </div>
            </div>
            <div class="form-item">
              <div class="form-item_input">
                <div class="form-group ms-small">
                  <ms-datepicker
                    :label="$t('i18nUser.Detail.date_of_birth')"
                    :max="new Date()"
                    v-model="model.date_of_birth"
                  >
                  </ms-datepicker>
                </div>
                <div style="padding-left: 16px" class="form-group ms-big">
                  <label>{{ $t("i18nUser.Detail.gender") }}</label>
                  <div class="ms-radio_item">
                    <ms-radio
                      :label="$t('i18nEnum.Gender.Male')"
                      :value="$ms.constant.Gender.Male"
                      v-model.number="model.gender"
                    ></ms-radio>
                    <ms-radio
                      :label="$t('i18nEnum.Gender.Female')"
                      :value="$ms.constant.Gender.Female"
                      v-model.number="model.gender"
                    ></ms-radio>
                    <ms-radio
                      :label="$t('i18nEnum.Gender.Other')"
                      :value="$ms.constant.Gender.Other"
                      v-model.number="model.gender"
                    ></ms-radio>
                  </div>
                </div>
              </div>
              <div class="form-item_input">
                <div class="form-group ms-big">
                  <ms-input
                    :maxLength="255"
                    :label="$t('i18nUser.Detail.address')"
                    v-model="model.address"
                  ></ms-input>
                </div>
              </div>
            </div>
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
import { defineComponent, getCurrentInstance, reactive, ref } from "vue";
import useModuleUser from "@/stores/sys/moduleUser";
import userAPI from "@/apis/sys/userAPI";
import BaseDetail from "@/views/base/BaseDetail";
import MsFileImage from "@/components/file/MsFileImage.vue";

export default defineComponent({
  mixins: [],
  components: {
    MsFileImage,
  },
  extends: BaseDetail,
  setup() {
    const { proxy }: any = getCurrentInstance(); // Instance của component
    const storeModule: any = useModuleUser(); // Cấu hình store
    const api = ref(userAPI); // Cấu hình api
    const subSystemCode = ref("user"); // Cấu hình phân quyền
    const hideAfterSave = ref(false); // Có đóng form sau khi save hay ko

    /**
		 * Xử lý sau khi cất thành công
		 */
    const afterSaveSuccess = (result) => {
      const me: any = proxy;
      if(typeof me._formParam.reloadUpdateUser === 'function'){
        me._formParam.reloadUpdateUser(result.Data);
      }
    };

    return {
      api,
      storeModule,
      hideAfterSave,
      subSystemCode,
      afterSaveSuccess,
    };
  },
});
</script>

<style lang="scss" scoped>
.form-detail:first-child {
  padding-bottom: 0;
}
:deep(.ms-file-image){
  .image-form{
    max-width: 120px;
    width: 120px;
    max-height: 120px;
    height: 120px;
    border-radius: 50%;
    img {
      border-radius: 50%;
    }
    .upload-image{
      background-position: -608px -1140px;
      border-radius: 50%;
    }
  }
}
</style>
