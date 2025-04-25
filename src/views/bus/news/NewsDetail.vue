<template>
  <ms-dynamic-popup
		:width="stylePopup.width"
		:height="stylePopup.height"
    :title="`${
      editMode ? $ms.commonFn.getEnumResource(editMode, 'FormState') : ''
    } ${$t('i18nNews.Title')}`"
    @beforeOpen="beforeOpen"
  >
    <template v-slot:content="{ close }">
      <div ref="slot-content" class="form-content-popup">
        <div class="form-container pd-t-4">
          <div class="form-detail flex">
            <div class="form-item">
              <div class="form-item_input"> 
                <div class="form-group">
                  <ms-input
                    :maxLength="250"
										:rules="[{ name: 'required' }, ]"
                    :label="$t('i18nNews.Detail.news_title')"
                    v-model="model.news_title"
                  ></ms-input>
                </div>
              </div>
              <div class="form-group">
                <ms-input
                  :maxLength="150"
                  :label="$t('i18nNews.Detail.meta_keyword')"
                  v-model="model.meta_keyword"
                ></ms-input>
              </div>
              <div class="form-group">
                <ms-textarea
                  :maxLength="500"
                  :rules="[{ name: 'required' }, ]"
                  :label="$t('i18nNews.Detail.news_desc')"
                  v-model="model.news_desc"
                ></ms-textarea>
              </div>
            </div>
            <div class="form-item">
              <div class="form-item_input flex">
                <div class="meta-content" style="flex: 1;">
                  <div class="form-group">
                    <ms-datepicker
                      :label="$t('i18nNews.Detail.date_publish')"
                      v-model="model.date_publish"
                    >
                    </ms-datepicker>
                  </div>
                  <div class="form-group" style="padding-left: 0;">
                    <ms-input
                      :maxLength="250"
                      :label="$t('i18nNews.Detail.meta_title')"
                      v-model="model.meta_title"
                    ></ms-input>
                  </div>
                  <div class="form-group" style="padding-left: 0;">
                    <ms-combobox-v2
                      :label="$t('i18nNewsList.Title')"
                      valueField="news_list_id"
                      displayField="news_list_name"
                      :data="dataCombobox.news_list"
                      :initText="model.news_list_name"
                      @comboboxLoadData="(payload) => comboboxLoadData(payload, newsListAPI, dataCombobox, 'news_list')"
                      @selected="selectedNewsListList"
                      :buildFilter="filterInactive"
                      queryMode="remote"
                      :remoteFilter="true"
                      v-model="model.news_list_id"
                      v-model:display="model.news_list_name"
                    ></ms-combobox-v2>
                  </div>
                  <div class="form-group" style="padding-left: 0;">
                    <ms-combobox-v2
                      :label="$t('i18nNews.Detail.news_type')"
                      valueField="dictionary_value"
                      displayField="dictionary_name"
                      :data="dataCombobox.dictionary"
                      :initText="model.news_type_name"
                      @comboboxLoadData="(payload) => comboboxLoadData(payload, dictionaryAPI, dataCombobox, 'dictionary')"
                      @selected="selectedNewsType"
                      :buildFilter="filterNewType"
                      queryMode="remote"
                      :remoteFilter="true"
                      v-model="model.news_type"
                      v-model:display="model.news_type_name"
                    ></ms-combobox-v2>
                  </div>
                </div>
                <div style="margin-left: 20px;" class="select-image">
                  <label class="select-title"
                    >{{ $t("i18nNews.Detail.picture") }} (600px - 330px )</label
                  >
                  <ms-file-image
                    v-model="model.picture"
                    :path="'/news/picture'"
                  ></ms-file-image>
                </div>
              </div>
            </div>
          </div>
          <div class="form-detail form-group">
            <ms-froala
              :label="$t('i18nNews.Detail.content')"
              v-model="model.content"
              :pathMedia="`/news/content/${model.news_id}`"
            />
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
            <ms-button @click="saveWithStatus(news_status.LuuTam)" class="mr-2">
              {{ $t("i18nCommon.crud.save") }}
            </ms-button>
            <ms-button 
              v-if="model.news_status == news_status.LuuTam.news_status || model.news_status == news_status.TuChoi.news_status" 
              @click="saveWithStatus(news_status.ChoDuyet)" class="primary mr-2"
            >
              {{ $t('i18nNews.Detail.post_news') }}
            </ms-button>
            <ms-button 
              v-if="model.news_status == news_status.ChoDuyet.news_status" 
              @click="saveWithStatus(news_status.TuChoi)" 
              class="danger mr-2"
            >
              {{ $t('i18nNews.Detail.reject') }}
            </ms-button>
            <ms-button v-if="model.news_status == news_status.ChoDuyet.news_status" 
              @click="saveWithStatus(news_status.DaDuyet)" 
              class="primary"
            >
              {{ $t('i18nNews.Detail.approved') }}
            </ms-button>
          </div>
        </div>
      </div>
    </template>
  </ms-dynamic-popup>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, reactive, ref } from "vue";
import moduleNews from "@/stores/bus/moduleNews";
import newsAPI from "@/apis/bus/newsAPI";
import newsListAPI from "@/apis/bus/newsListAPI";
import BaseDetail from "@/views/base/BaseDetail";
import MsFileImage from "@/components/file/MsFileImage.vue";
import MsFroala from '@/components/froala/MsFroala.vue';
import { useRemoteCombobox } from '@/setup/remoteCombobox';
import dictionaryAPI from "@/apis/sys/dictionaryAPI";
import { useNewsConfig } from "@/views/bus/news/newsConfig"
import { showError } from "@/commons/globalMessage";

export default defineComponent({
  mixins: [],
  components: {
    MsFileImage,
    MsFroala,
  },
  extends: BaseDetail,
  setup() {
    const { proxy }: any = getCurrentInstance(); // Instance của component
    const storeModule: any = moduleNews(); // Cấu hình store
    const api = ref(newsAPI); // Cấu hình api
    const subSystemCode = ref("news"); // Cấu hình phân quyền
    const hideAfterSave = ref(false); // Có đóng form sau khi save hay ko
    const stylePopup = {
      width: Math.round(window.innerWidth * 0.8),
      height: Math.round(window.innerHeight * 0.8),
    }
    const { comboboxLoadData } = useRemoteCombobox();
    const dataCombobox = reactive({
      news_list: [],
      dictionary: [],
    });
    const { news_status, loadMappingNewStatus } = useNewsConfig();
    
    /**
     * Xử lý trước khi bind dữ liệu
     */
    const beforeBindData = async () => {
      const me: any = proxy;
      await loadMappingNewStatus();
      if (me.editMode == me.$ms.constant.FormState.Add){
        // nếu là mode add thì gán news_status mặc định
        me._formParam.dataRow.news_status = news_status.value.LuuTam.news_status;
        me._formParam.dataRow.news_status_name = news_status.value.LuuTam.news_status_name;
      }
      await me.super("beforeBindData", BaseDetail);
    };

    /**
     * Sau khi bind data thì gán id để thêm sửa xoá editor lưu ảnh theo thư mục id
     */
    const afterBindData = () => {
      const me = proxy;
      if (me.editMode == me.$ms.constant.FormState.Add){
        me.model.news_id = me.$ms.commonFn.generateUUID();
      }
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

    /**
     * Custom filter combobobx new type
     */
    const filterNewType = (payload) => {
      const me: any = proxy;
      filterInactive(payload);
      const filterNewsType = ["dictionary_list_code", "=", "LoaiTin"]; // fix cứng lọc theo LoaiTin trong danh mục từ điển của a Sang
      me.$ms.commonFn.concatFilter(payload, filterNewsType);
    };

    /**
     * Xử lý chọn danh mục combobox new list
     */
    const selectedNewsListList = (metaData) => {
      const me: any = proxy;
      me.model.news_list_name = metaData.newData ? metaData.newData.news_list_name : null;
    };

    /**
     * Xử lý chọn danh mục combobox new type
     */
    const selectedNewsType = (metaData) => {
      const me: any = proxy;
      me.model.news_type_name = metaData.newData ? metaData.newData.dictionary_name : null;
    };

    /**
     * Lưu cập nhật trạng thái tin
     */
    const newsStatusSave = ref(null);
    const saveWithStatus = (news_status: any) => {
      const me: any = proxy;
      newsStatusSave.value = news_status;
      me.save();
    };

    /**
		 * Hàm validate custom trước khi save
		 */
    const validateSaveCustom = async (model) => {
      const me: any = proxy;
      if(model.news_status == news_status.value.DaDuyet.news_status || model.news_status == news_status.value.ChoDuyet.news_status){
        if(!model.date_publish){ // validate trống Ngày đăng
          showError(me.$t('i18nValidate.messages.required', { field: me.$t('i18nNews.Detail.date_publish') }))
          return false;
        }
        if(!model.news_list_id){ // validate trống Danh mục tin
          showError(me.$t('i18nValidate.messages.required', { field: me.$t('i18nNewsList.Title') }))
          return false;
        }
        if(!model.news_type){ // validate trống loại tin
          showError(me.$t('i18nValidate.messages.required', { field: me.$t('i18nNews.Detail.news_type') }))
          return false;
        }
        if(!model.picture){ // validate trống Hình ảnh
          showError(me.$t('i18nValidate.messages.required', { field: me.$t('i18nNews.Detail.picture') }))
          return false;
        }
      }
      return true;
    };

    /**
     * Xử lý trước khi save
     */
    const beforeSave = async (model) => {
      if(newsStatusSave.value){
        model.news_status = newsStatusSave.value.news_status;
        model.news_status_name = newsStatusSave.value.news_status_name;
        newsStatusSave.value = null;
      }
    };

    /**
		 * Xử lý sau khi cất thành công
		 */
    const afterSaveSuccess = async (resultSave) => {
      const me: any = proxy;
      if(resultSave?.Data){
        me.model.news_status = resultSave.Data.news_status;
        me.model.news_status_name = resultSave.Data.news_status_name;
      }
    };

    return {
      api,
      stylePopup,
      hideAfterSave,
      news_status,
      storeModule,
      subSystemCode,
      newsListAPI,
      dictionaryAPI,
      dataCombobox,
      afterBindData,
      beforeSave,
      saveWithStatus,
      filterNewType,
      comboboxLoadData,
      filterInactive,
      selectedNewsListList,
      selectedNewsType,
      beforeBindData,
      afterSaveSuccess,
      validateSaveCustom,
    };
  },
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/detailStyle" as style;
.form-container{
  display: flex;
  flex-direction: column;
  .form-detail:last-child{
    flex: 1;
    flex-grow: 1;
    max-height: 100%;
  }
}
.select-image {
  .select-title {
    font-family: "notosans-semibold";
    margin-bottom: 8px;
    font-size: 12px;
    white-space: nowrap;
    display: block;
  }
}
.form-detail:first-child {
  padding-bottom: 0;
}
.form-item{
  &:last-child{
    width: 520px;
  }
  &:first-child{
    flex: 1;
  }
}
</style>