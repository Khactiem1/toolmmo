<template>
  <ms-dynamic-popup
    :width="650"
    :height="480"
    :title="`${
      editMode ? $ms.commonFn.getEnumResource(editMode, 'FormState') : ''
    } ${$t('i18nPaymentMethod.Title')}`"
    @beforeOpen="beforeOpen"
  >
    <template v-slot:content="{ close }">
      <div ref="slot-content" class="form-content-popup">
        <div class="form-container mt-4">
          <div class="form-detail">
            <div class="flex form-group gap-8">
              <ms-input
                :maxLength="30"
                :rules="[{ name: 'required' }]"
                :label="$t('i18nPaymentMethod.Detail.payment_method_code')"
                v-model="model.payment_method_code"
              ></ms-input>
              <ms-input
                :maxLength="100"
                :rules="[{ name: 'required' }]"
                :label="$t('i18nPaymentMethod.Detail.payment_method_name')"
                v-model="model.payment_method_name"
              ></ms-input>
            </div>
            <div class="flex form-group gap-8">
              <ms-number
                style="width: 50%;"
                :label="$t('i18nPaymentMethod.Detail.sort')"
                v-model="model.sort"
              ></ms-number>
              <div class="form-detail flex form-select-option">
              <div class="form-item select-image">
                <label class="select-title">{{
                  $t("i18nPaymentMethod.Detail.icon")
                }}</label>
                <ms-file-image
                  v-model="model.icon"
                  :path="'/payment_method/icon'"
                ></ms-file-image>
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
import { defineComponent, getCurrentInstance, ref } from "vue";
import BaseDetail from "@/views/base/BaseDetail";
import MsFileImage from "@/components/file/MsFileImage.vue";
import useModulePaymentMethod from "@/stores/bus/modulePaymentMethod";
import paymentMethodAPI from "@/apis/bus/paymentMethodAPI";

export default defineComponent({
  mixins: [],
  components: {
    MsFileImage,
  },
  extends: BaseDetail,
  setup() {
    const { proxy }: any = getCurrentInstance(); // Instance của component
    const storeModule: any = useModulePaymentMethod(); // Cấu hình store
    const api = ref(paymentMethodAPI); // Cấu hình api
    const subSystemCode = ref("payment_method"); // Cấu hình phân quyền

    return {
      api,
      storeModule,
      subSystemCode,
    };
  },
});
</script>

<style lang="scss" scoped>
.select-image {
  .select-title {
    font-family: "notosans-semibold";
    margin-bottom: 8px;
    font-size: 12px;
    white-space: nowrap;
    display: block;
  }
}
.form-item_input {
  width: 50%;
  &:last-child {
    padding-left: 12px;
  }
}
:deep(.data-input) {
  width: 100%;
}
.form-detail {
  padding-bottom: 0;
}
</style>