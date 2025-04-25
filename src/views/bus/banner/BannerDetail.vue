<template>
  <ms-dynamic-popup :width="800" :height="720" :title="`${editMode ? $ms.commonFn.getEnumResource(editMode, 'FormState') : ''
    } ${$t('i18nBanner.Title')}`" @beforeOpen="beforeOpen">
    <template v-slot:content="{ close }">
      <div ref="slot-content" class="form-content-popup">
        <div class="form-container mt-4">
          <div class="form-detail">
            <div class="flex form-group">
              <div class="form-item_input">
                <ms-input :maxLength="100" :rules="[{ name: 'required' }]" :label="$t('i18nBanner.Detail.banner_name')"
                  v-model="model.banner_name"></ms-input>
              </div>
              <div class="form-item_input">
                <ms-number :label="$t('i18nBanner.Detail.sort')" v-model="model.sort"></ms-number>
              </div>
            </div>
            <div class="flex form-group">
              <div class="form-item_input">
                <ms-datepicker :label="$t('i18nBanner.Detail.from_date')" v-model="model.from_date">
                </ms-datepicker>
              </div>
              <div class="form-item_input">
                <ms-datepicker :label="$t('i18nBanner.Detail.to_date')" v-model="model.to_date">
                </ms-datepicker>
              </div>
            </div>
            <div class="form-group">
              <ms-combobox-v2 
                :label="$t('i18nBanner.Detail.type_banner')" 
                valueField="dictionary_value"
                displayField="dictionary_name" 
                :data="dataCombobox.type_banner" 
                :initText="model.type_banner"
                @comboboxLoadData="(payload) => comboboxLoadData(payload, dictionaryAPI, dataCombobox, 'type_banner')"
                :buildFilter="filterTypeBanner" 
                queryMode="remote" 
                :remoteFilter="true" 
                v-model="model.type"
                v-model:display="model.type_banner"
              >
              </ms-combobox-v2>
            </div>
            <div class="form-group">
              <ms-combobox-v2 
                :label="$t('i18nBanner.Detail.position_banner')" 
                valueField="dictionary_value"
                displayField="dictionary_name" 
                :data="dataCombobox.position_banner" 
                :initText="model.position_banner"
                @comboboxLoadData="(payload) => comboboxLoadData(payload, dictionaryAPI, dataCombobox, 'position_banner')"
                :buildFilter="filterPositionBanner" 
                queryMode="remote" 
                :remoteFilter="true" 
                v-model="model.position"
                v-model:display="model.position_banner"
              >
              </ms-combobox-v2>
            </div>
            <div class="form-group">
              <ms-input :maxLength="255" :rules="[{ name: 'required' }]" :label="$t('i18nBanner.Detail.url')"
                v-model="model.url"></ms-input>
            </div>
          </div>
          <div class="form-detail flex form-select-option">
            <div class="form-item select-image">
              <label class="select-title">{{
                $t("i18nBanner.Detail.picture")
              }} (1750px - 438px)</label>
              <ms-file-image v-model="model.picture" :path="'/banner/picture'"></ms-file-image>
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
import useModuleBanner from "@/stores/bus/moduleBanner";
import bannerAPI from "@/apis/bus/bannerAPI";
import BaseDetail from "@/views/base/BaseDetail";
import MsFileImage from "@/components/file/MsFileImage.vue";
import { useRemoteCombobox } from "@/setup/remoteCombobox";
import dictionaryAPI from "@/apis/sys/dictionaryAPI";

export default defineComponent({
  mixins: [],
  components: {
    MsFileImage,
  },
  extends: BaseDetail,
  setup() {
    const { proxy }: any = getCurrentInstance(); // Instance của component
    const storeModule: any = useModuleBanner(); // Cấu hình store
    const api = ref(bannerAPI); // Cấu hình api
    const subSystemCode = ref("banner"); // Cấu hình phân quyền
    const { comboboxLoadData } = useRemoteCombobox();
    const dataCombobox = reactive({
      type_banner: [],
      position_banner: [],
    });
    /**
     * Xử lý dữ liệu trước khi binding
     * @override
     */
    const beforeBindData = async () => {
      const me: any = proxy;
      await me.super("beforeBindData", BaseDetail);
    };
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
    const filterTypeBanner = (payload) => {
      const me: any = proxy;
      filterInactive(payload);
      const filterNewsType = ["dictionary_list_code", "=", "LoaiBanner"]; // fix cứng lọc theo ChucNang trong danh mục từ điển của a Sang
      me.$ms.commonFn.concatFilter(payload, filterNewsType);
    };
    const filterPositionBanner = (payload) => {
      const me: any = proxy;
      filterInactive(payload);
      const filterNewsType = ["dictionary_list_code", "=", "ViTriBanner"]; // fix cứng lọc theo ChucNang trong danh mục từ điển của a Sang
      me.$ms.commonFn.concatFilter(payload, filterNewsType);
    };
    return {
      api,
      storeModule,
      subSystemCode,
      dataCombobox,
      dictionaryAPI,
      beforeBindData,
      comboboxLoadData,
      filterTypeBanner,
      filterPositionBanner
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