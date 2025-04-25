<template>
  <ms-dynamic-popup
    :width="800"
    :height="600"
    :title="`${
      editMode ? $ms.commonFn.getEnumResource(editMode, 'FormState') : ''
    } ${$t('i18nSystemConfig.Title')}`"
    @beforeOpen="beforeOpen"
  >
    <template v-slot:content="{ close }">
      <div ref="slot-content" class="form-content-popup">
        <div class="form-container mt-4">
          <div class="form-item_input">
            <div class="form-group">
              <ms-input
                :maxLength="30"
                :rules="[{ name: 'required' }]"
                :label="$t('i18nSystemConfig.Detail.system_config_code')"
                v-model="model.system_config_code"
              ></ms-input>
            </div>
            <div class="form-group">
              <ms-input
                :maxLength="150"
                :rules="[{ name: 'required' }]"
                :label="$t('i18nSystemConfig.Detail.system_config_name')"
                v-model="model.system_config_name"
              ></ms-input>
            </div>
          </div>
          <div class="form-item_input">
            <div class="form-group">
              <ms-combobox-v2
                :label="$t('i18nSystemConfig.Detail.config_type')"
                valueField="dictionary_value"
                displayField="dictionary_name"
                :data="dataCombobox.dictionary"
                :initText="model.config_type_name"
                @comboboxLoadData="(payload) => comboboxLoadData(payload, dictionaryAPI, dataCombobox, 'dictionary')"
                :buildFilter="filterConfigType"
                queryMode="remote"
                :remoteFilter="true"
                v-model="model.config_type"
                v-model:display="model.config_type_name"
              ></ms-combobox-v2>
              <ms-datepicker
                class="mt-3"
                :label="$t('i18nSystemConfig.Detail.date_value')"
                v-model="model.date_value"
              >
              </ms-datepicker>
              <ms-input
                class="mt-3"
                :maxLength="150"
                :label="$t('i18nSystemConfig.Detail.text_value')"
                v-model="model.text_value"
              ></ms-input>
              <ms-number
                class="mt-3"
                :label="$t('i18nSystemConfig.Detail.number_value')"
                v-model="model.number_value"
              ></ms-number>
            </div>
            <div class="form-group flex">
              <div class="flex">
                <div>
                  <label class="select-title"> {{ $t("i18nSystemConfig.Detail.picture_value") }}</label>
                  <ms-file-image
                    v-model="model.picture_value"
                    :path="'/system_config/picture_value'"
                    :isUploadKeepNameFile="true"
                  ></ms-file-image>
                </div>
                <div>
                  <label class="select-title"> {{ $t("i18nSystemConfig.Detail.boolean_value") }}</label>
                  <ms-switch
                    v-model="model.boolean_value"
                  />
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
import { defineComponent, getCurrentInstance, ref, reactive } from "vue";
import useModuleSystemConfig from "@/stores/sys/moduleSystemConfig";
import systemConfigAPI from "@/apis/sys/systemConfigAPI";
import BaseDetail from "@/views/base/BaseDetail";
import MsFileImage from "@/components/file/MsFileImage.vue";
import dictionaryAPI from "@/apis/sys/dictionaryAPI";
import { useRemoteCombobox } from '@/setup/remoteCombobox';

export default defineComponent({
  mixins: [],
  components: {
    MsFileImage,
  },
  extends: BaseDetail,
  setup() {
    const { proxy }: any = getCurrentInstance(); // Instance của component
    const storeModule: any = useModuleSystemConfig(); // Cấu hình store
    const api = ref(systemConfigAPI); // Cấu hình api
    const subSystemCode = ref("langusystem_configage"); // Cấu hình phân quyền
    const { comboboxLoadData } = useRemoteCombobox();
    const dataCombobox = reactive({
      dictionary: [],
    });

    /**
     * Custom build filter combobox DictionaryList
     * Chỉ load lên những bản ghi đang được active ở mode add, mode edit thì load all
     */
    const filterInactive = (payload) => {
      const me: any = proxy;
      if (me.editMode == me.$ms.constant.FormState.Add) {
        const filterIsActive = ["is_active", "=", true];
        me.$ms.commonFn.concatFilter(payload, filterIsActive);
      }
    };

    /**
     * Custom filter combobobx new type
     */
    const filterConfigType = (payload) => {
      const me: any = proxy;
      filterInactive(payload);
      const filterNewsType = ["dictionary_list_code", "=", "LoaiCauHinh"]; // fix cứng lọc theo LoaiCauHinh trong danh mục từ điển của a Sang
      me.$ms.commonFn.concatFilter(payload, filterNewsType);
    };

    return {
      api,
      storeModule,
      subSystemCode,
      dictionaryAPI,
      dataCombobox,
      filterConfigType,
      comboboxLoadData,
    };
  },
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/detailStyle" as style;
.form-group{
  padding-left: 0 !important;
}
.form-item_input{
  gap: 16px;
}
</style>