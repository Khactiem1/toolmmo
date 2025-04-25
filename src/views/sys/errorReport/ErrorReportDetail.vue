<template>
  <ms-dynamic-popup :width="750" :height="450" :title="`${editMode ? $ms.commonFn.getEnumResource(editMode, 'FormState') : ''
      } ${$t('i18nErrorReport.Title')}`" @beforeOpen="beforeOpen">
      <template v-slot:content="{ close }">
          <div ref="slot-content" class="form-content-popup">
              <div class="form-container pd-t-4">
                  <div class="flex" style="gap: 8px;">
                      <div class="form-group">
                          <ms-input
                            :label="$t('i18nErrorReport.Detail.function')" 
                            v-model="model.function"
                            :disabled="true"
                          >
                          </ms-input>
                      </div>
                      <div class="form-group">
                          <ms-combobox-v2 
                            :label="$t('i18nErrorReport.Detail.process_status')" 
                            valueField="dictionary_value"
                            displayField="dictionary_name" 
                            :data="dataCombobox.dictionary"
                            :initText="model.process_status_name"
                            @comboboxLoadData="(payload) => comboboxLoadData(payload, dictionaryAPI, dataCombobox, 'dictionary')"
                            :buildFilter="filterNewType" 
                            queryMode="remote" 
                            :remoteFilter="true"
                            v-model="model.process_status" 
                            v-model:display="model.process_status_name"
                          >
                          </ms-combobox-v2>
                      </div>
                  </div>
                  <div class="flex" style="gap: 8px;">
                      <div class="form-group">
                          <ms-input
                            :label="$t('i18nErrorReport.Detail.customer_name')" 
                            v-model="model.customer_name"
                            :disabled="true"
                          >
                          </ms-input>
                      </div>
                      <div class="form-group">
                          <ms-input
                            :label="$t('i18nErrorReport.Detail.error_url')" 
                            v-model="model.error_url"
                            :disabled="true"
                          >
                          </ms-input>
                      </div>
                  </div>
                  <div class="form-detail">
                    <div class="form-group">
                      <ms-textarea
                        :label="$t('i18nErrorReport.Detail.content_error')"
                        v-model="model.content_error"
                        :disabled="true"
                      ></ms-textarea>
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
import useModuleErrorReport from "@/stores/sys/moduleErrorReport";
import errorReportAPI from "@/apis/sys/errorReportAPI";
import dictionaryAPI from "@/apis/sys/dictionaryAPI";
import BaseDetail from "@/views/base/BaseDetail";
import { useRemoteCombobox } from '@/setup/remoteCombobox';

export default defineComponent({
  mixins: [],
  extends: BaseDetail,
  setup() {
      const { proxy }: any = getCurrentInstance(); // Instance của component
      const storeModule: any = useModuleErrorReport(); // Cấu hình store
      const api = ref(errorReportAPI); // Cấu hình api
      const subSystemCode = ref("error_report"); // Cấu hình phân quyền
      const { comboboxLoadData } = useRemoteCombobox();

      const dataCombobox = reactive({
          dictionary: [],
      });
      const filterNewType = (payload) => {
          const me: any = proxy;
          const filterNewsType = ["dictionary_list_code", "=", "TrangThaiXuLy"]; // fix cứng lọc theo TrangThaiXuLy trong danh mục từ điển của a Sang
          me.$ms.commonFn.concatFilter(payload, filterNewsType);
      };
      return {
          api,
          storeModule,
          subSystemCode,
          dataCombobox,
          dictionaryAPI,
          filterNewType,
          comboboxLoadData
      };
  },
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/detailStyle" as style;
</style>