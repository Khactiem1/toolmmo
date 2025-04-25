<template>
  <ms-dynamic-popup
    :width="750"
    :height="450"
    :title="`${
      editMode ? $ms.commonFn.getEnumResource(editMode, 'FormState') : ''
    } ${$t('i18nJobDefinition.Title')}`"
    @beforeOpen="beforeOpen"
  >
    <template v-slot:content="{ close }">
      <div ref="slot-content" class="form-content-popup">
        <div class="form-container mt-4">
          <div class="form-detail">
            <div class="flex form-group" style="gap: 8px;">
              <ms-input
                :maxLength="30"
                :rules="[{ name: 'required' }]"
                :label="$t('i18nJobDefinition.Detail.job_definition_code')"
                v-model="model.job_definition_code"
              ></ms-input>
              <ms-input
                :maxLength="150"
                :rules="[{ name: 'required' }]"
                :label="$t('i18nJobDefinition.Detail.job_definition_name')"
                v-model="model.job_definition_name"
              ></ms-input>
            </div>
            <div class="flex form-group" style="gap: 8px;">
              <ms-time
                :label="$t('i18nJobDefinition.Detail.start_time')"
                v-model="model.start_time"
              ></ms-time>
              <ms-datepicker
                :label="$t('i18nJobDefinition.Detail.last_success_time')"
                v-model="model.last_success_time"
                :format="'DD/MM/YYYY HH:mm'"
              ></ms-datepicker>
            </div>
            <div class="flex form-group" style="gap: 8px;">
              <ms-combobox-v2 
                :label="$t('i18nJobDefinition.Detail.frequency')"
                valueField="dictionary_value"
                displayField="dictionary_name" 
                :data="dataCombobox.frequency"
                :initText="model.frequency_name"
                @comboboxLoadData="(payload) => comboboxLoadData(payload, dictionaryAPI, dataCombobox, 'frequency')"
                :buildFilter="filterFrequency" 
                queryMode="remote" 
                :remoteFilter="true"
                v-model="model.frequency" 
                v-model:display="model.frequency_name"
              >
              </ms-combobox-v2>
              <ms-combobox-v2 
                :label="$t('i18nJobDefinition.Detail.status')"
                valueField="dictionary_value"
                displayField="dictionary_name" 
                :data="dataCombobox.status"
                :initText="model.status_name"
                @comboboxLoadData="(payload) => comboboxLoadData(payload, dictionaryAPI, dataCombobox, 'status')"
                :buildFilter="filterStatus" 
                queryMode="remote" 
                :remoteFilter="true"
                v-model="model.status" 
                v-model:display="model.status_name"
              >
              </ms-combobox-v2>
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
import useModuleJobDefinition from "@/stores/sys/moduleJobDefinition";
import jobDefinitionAPI from "@/apis/sys/jobDefinitionAPI";
import BaseDetail from "@/views/base/BaseDetail";
import dictionaryAPI from "@/apis/sys/dictionaryAPI";
import { useRemoteCombobox } from '@/setup/remoteCombobox';
import MsTime from "@/components/datepicker/MsTime.vue";

export default defineComponent({
  mixins: [],
  extends: BaseDetail,
  components: {
    MsTime,
  },
  setup() {
    const { proxy }: any = getCurrentInstance(); // Instance của component
    const storeModule: any = useModuleJobDefinition(); // Cấu hình store
    const api = ref(jobDefinitionAPI); // Cấu hình api
    const subSystemCode = ref("job_definition"); // Cấu hình phân quyền
    const { comboboxLoadData } = useRemoteCombobox();
    const dataCombobox = reactive({
      frequency: [],
      status: [],
    });

    /**
     * Filter combobox filterFrequency
     */
    const filterFrequency = (payload) => {
      const me: any = proxy;
      const filter = ["dictionary_list_code", "=", "TanSuatJob"]; // fix cứng lọc theo TanSuatJob trong danh mục từ điển của a Sang
      me.$ms.commonFn.concatFilter(payload, filter);
    };

    /**
     * Filter combobox filterStatus
     */
    const filterStatus = (payload) => {
      const me: any = proxy;
      const filter = ["dictionary_list_code", "=", "TrangThaiChung"]; // fix cứng lọc theo TrangThaiJob trong danh mục từ điển của a Sang
      me.$ms.commonFn.concatFilter(payload, filter);
    };

    return {
      api,
      storeModule,
      subSystemCode,
      dataCombobox,
      dictionaryAPI,
      filterFrequency,
      filterStatus,
      comboboxLoadData,
    };
  },
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/detailStyle" as style;
</style>