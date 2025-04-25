<template>
    <ms-dynamic-popup
      :width="700"
      :min-height="420"
      :title="`${
        editMode ? $ms.commonFn.getEnumResource(editMode, 'FormState') : ''
      } ${$t('i18nDictionary.Title')}`"
      @beforeOpen="beforeOpen"
    >
      <template v-slot:content="{ close }">
        <div ref="slot-content" class="form-content-popup">
          <div class="form-container mt-4">
            <div class="form-detail flex-center">
              <div class="form-item">
                <div class="form-item_input">
                  <div class="form-group ms-small">
                    <ms-input
                      :maxLength="30"
                      :rules="[{ name: 'required' }, ]"
                      :label="$t('i18nDictionary.Detail.dictionary_code')"
                      v-model="model.dictionary_code"
                    ></ms-input>
                  </div>
                  <div class="form-group ms-big">
                    <ms-input
                      :maxLength="150"
                      :rules="[{ name: 'required' }, ]"
                      :label="$t('i18nDictionary.Detail.dictionary_name')"
                      v-model="model.dictionary_name"
                    ></ms-input>
                  </div>
                </div>
                <div class="form-item_input">
                  <div class="form-group ms-small">
                    <ms-input
                      :maxLength="30"
                      :rules="[{ name: 'required' }, ]"
                      :label="$t('i18nDictionary.Detail.dictionary_value')"
                      v-model="model.dictionary_value"
                    ></ms-input>
                  </div>
                  <div class="form-group ms-big">
                    <ms-combobox-v2
                      :label="$t('i18nDictionary.Detail.dictionary_list_name')"
                      valueField="dictionary_list_id"
                      displayField="dictionary_list_name"
                      :data="dataCombobox.dictionary_list"
                      :initText="model.dictionary_list_name"
                      @comboboxLoadData="(payload) => comboboxLoadData(payload, dictionaryListAPI, dataCombobox, 'dictionary_list')"
                      @selected="selectedDictionaryList"
                      :buildFilter="filterInactive"
                      :dropdownWidth="400"
                      :rules="[{ name: 'required' }, { name: 'forceSelection' }]"
                      :columns="[
                        { title: $t('i18nDictionaryList.Detail.dictionary_list_code'), dataField: 'dictionary_list_code', width: 160, filterOperator: $ms.constant.FilterOperator.Contains, },
                        { title: $t('i18nDictionaryList.Detail.dictionary_list_name'), dataField: 'dictionary_list_name', width: 220, filterOperator: $ms.constant.FilterOperator.Contains, },
                      ]"
                      queryMode="remote"
                      :remoteFilter="true"
                      v-model="model.dictionary_list_id"
                      v-model:display="model.dictionary_list_name"
                    ></ms-combobox-v2>
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
  import useModuleDictionary from "@/stores/sys/moduleDictionary";
  import dictionaryAPI from "@/apis/sys/dictionaryAPI";
  import dictionaryListAPI from "@/apis/sys/dictionaryListAPI";
  import BaseDetail from "@/views/base/BaseDetail";
  import { useRemoteCombobox } from '@/setup/remoteCombobox';
  
  export default defineComponent({
    mixins: [],
    extends: BaseDetail,
    setup() {
        const { proxy }: any = getCurrentInstance(); // Instance của component
        const storeModule: any = useModuleDictionary(); // Cấu hình store
        const api = ref(dictionaryAPI); // Cấu hình api
        const subSystemCode = ref("dictionary_list"); // Cấu hình phân quyền
        const dataCombobox = reactive({
          dictionary_list: [],
        });
        const { comboboxLoadData } = useRemoteCombobox();

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
         * Xử lý chọn danh mục combobox
         */
        const selectedDictionaryList = (metaData) => {
          const me: any = proxy;
          me.model.dictionary_list_name = metaData.newData ? metaData.newData.dictionary_list_name : null;
          me.model.dictionary_list_code = metaData.newData ? metaData.newData.dictionary_list_code : null;
        };
  
        return {
            api,
            storeModule,
            subSystemCode,
            dataCombobox,
            dictionaryListAPI,
            selectedDictionaryList,
            comboboxLoadData,
            filterInactive,
        };
    },
  });
  </script>
  
  <style lang="scss" scoped>
  .form-item {
    width: 100%;
  }
  </style>
  