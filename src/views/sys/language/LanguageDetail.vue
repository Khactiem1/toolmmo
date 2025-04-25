<template>
  <ms-dynamic-popup
    :width="750"
    :height="480"
    :title="`${
      editMode ? $ms.commonFn.getEnumResource(editMode, 'FormState') : ''
    } ${$t('i18nLanguage.Title')}`"
    @beforeOpen="beforeOpen"
  >
    <template v-slot:content="{ close }">
      <div ref="slot-content" class="form-content-popup">
        <div class="form-container mt-4">
          <div class="form-item_input">
            <div class="form-group ms-small">
              <ms-input
                :maxLength="30"
                :rules="[{ name: 'required' }]"
                :label="$t('i18nLanguage.Detail.language_code')"
                v-model="model.language_code"
              ></ms-input>
            </div>
            <div class="form-group ms-big">
              <ms-input
                :maxLength="100"
                :rules="[{ name: 'required' }]"
                :label="$t('i18nLanguage.Detail.language_name')"
                v-model="model.language_name"
              ></ms-input>
            </div>
          </div>
          <div class="form-item_input">
            <div class="form-group ms-small">
              <ms-number
                :label="$t('i18nLanguage.Detail.sort')"
                v-model="model.sort"  
              ></ms-number>
            </div>
            <div class="form-group ms-big flex flex-center">
              <div>
                <label class="select-title"> {{ $t("i18nLanguage.Detail.icon") }}</label>
                <ms-file-image
                  v-model="model.icon"
                  :path="'/language/icon'"
                ></ms-file-image>
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
import useModuleLanguage from "@/stores/sys/moduleLanguage";
import languageAPI from "@/apis/sys/languageAPI";
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
    const storeModule: any = useModuleLanguage(); // Cấu hình store
    const api = ref(languageAPI); // Cấu hình api
    const subSystemCode = ref("language"); // Cấu hình phân quyền

    return {
      api,
      storeModule,
      subSystemCode,
    };
  },
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/detailStyle" as style;
</style>