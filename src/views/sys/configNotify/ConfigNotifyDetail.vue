<template>
  <ms-dynamic-popup
    :width="900"
    :height="800"
    :title="`${
      editMode ? $ms.commonFn.getEnumResource(editMode, 'FormState') : ''
    } ${$t('i18nConfigNotify.Title')}`"
    @beforeOpen="beforeOpen"
  >
    <template v-slot:content="{ close }">
      <div ref="slot-content" class="form-content-popup">
        <div class="form-container mt-4">
          <div class="form-item_input">
            <div class="form-group">
              <ms-input
                :maxLength="50"
                :rules="[{ name: 'required' }]"
                :label="$t('i18nConfigNotify.Detail.config_notify_code')"
                v-model="model.config_notify_code"
              ></ms-input>
            </div>
            <div class="form-group">
              <ms-input
                :maxLength="250"
                :rules="[{ name: 'required' }]"
                :label="$t('i18nConfigNotify.Detail.config_notify_name')"
                v-model="model.config_notify_name"
              ></ms-input>
            </div>
          </div>
          <div class="form-item_input">
            <div class="form-group">
              <ms-input
                :maxLength="50"
                :label="$t('i18nConfigNotify.Detail.paramerter')"
                v-model="model.paramerter"
              ></ms-input>
            </div>
            <div class="form-group">
              <ms-input
                :maxLength="50"
                :label="$t('i18nConfigNotify.Detail.sound')"
                v-model="model.sound"
              ></ms-input>
            </div>
          </div>
          <div class="form-item_input">
            <div class="form-group">
              <ms-combobox-v2
                :label="$t('i18nConfigNotify.Detail.channel_name')"
                valueField="channel_code"
                displayField="channel_name"
                :data="dataCombobox.list_channel"
                :buildFilter="buildFilterComboboxChannel"
                :initText="model.channel_name"
                @comboboxLoadData="(payload) => comboboxLoadData(payload, dictionaryAPI, dataCombobox, 'list_channel')"
                :rules="[{ name: 'forceSelection' }, { name: 'required' }]"
                queryMode="remote"
                :remoteFilter="true"
                v-model="model.channel_code"
                v-model:display="model.channel_name"
            ></ms-combobox-v2>
            </div>
            <div class="form-group">
              <ms-combobox-v2 
                :label="$t('i18nConfigNotify.Detail.notify_type')"
                valueField="dictionary_value"
                displayField="dictionary_name" 
                :data="dataCombobox.notify_type"
                :initText="model.notify_type_name"
                @comboboxLoadData="(payload) => comboboxLoadData(payload, dictionaryAPI, dataCombobox, 'notify_type')"
                :buildFilter="filterType"
                queryMode="remote"
                :remoteFilter="true" 
                v-model="model.notify_type"
                v-model:display="model.notify_type_name"
              >
              </ms-combobox-v2>
            </div>
          </div>
          <div class="form-item_input">
            <div class="form-group">
              <ms-combobox-v2 
                :label="$t('i18nConfigNotify.Detail.screen_name')"
                valueField="dictionary_value"
                displayField="dictionary_name" 
                :data="dataCombobox.screen_code"
                :initText="model.screen_name"
                @comboboxLoadData="(payload) => comboboxLoadData(payload, dictionaryAPI, dataCombobox, 'screen_code')"
                :buildFilter="filterScreen"
                queryMode="remote"
                :remoteFilter="true" 
                v-model="model.screen_code"
                v-model:display="model.screen_name"
              >
              </ms-combobox-v2>
            </div>
            <div class="form-group">
              <ms-combobox-v2 
                :label="$t('i18nConfigNotify.Detail.function_name')"
                valueField="dictionary_value"
                displayField="dictionary_name" 
                :data="dataCombobox.function"
                :initText="model.function_name"
                @comboboxLoadData="(payload) => comboboxLoadData(payload, dictionaryAPI, dataCombobox, 'function')"
                :buildFilter="filterFunction"
                queryMode="remote"
                :remoteFilter="true" 
                v-model="model.function"
                v-model:display="model.function_name"
              >
              </ms-combobox-v2>
            </div>
          </div>
          <div class="form-item_input">
            <div class="form-group">
              <ms-textarea
                :maxLength="400"
                :label="$t('i18nConfigNotify.Detail.description')"
                v-model="model.description"
              ></ms-textarea>
            </div>
            <div class="form-group">
              <ms-textarea
                :maxLength="400"
                :label="$t('i18nConfigNotify.Detail.note')"
                v-model="model.note"
              ></ms-textarea>
            </div>
          </div>
          <div class="form-item_input">
            <div class="form-group">
              <div>
                <label class="select-title"> {{ $t("i18nReceiveNotify.Detail.receiver_ids") }}</label>
                <div v-if="model.ReceiverDetail?.length" class="lst-user">
                  <div class="user-item flex justify-between" v-for="user in model.ReceiverDetail" :key="user.user_id">
                    <span>{{ user.user_name }} - {{ user.user_full_name }} - {{ user.phone_number }}</span>
                    <div @click="deleteRow(user)" :title="$t('i18nCommon.delete')" class="fa-solid fa-xmark color-icon-primary"></div>
                  </div>
                </div>
                <div class="flex lst-btn gap-8">
                  <ms-button @click="openSelectUser">
                    {{ $t("i18nReceiveNotify.Detail.selected_user") }}
                  </ms-button>
                  <ms-button @click="deleteAllRow" :disabled="!model.receiver_ids">
                    {{ $t("i18nCommon.crud.delete_all_row") }}
                  </ms-button>
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
import useModuleConfigNotify from "@/stores/sys/moduleConfigNotify";
import configNotifyAPI from "@/apis/sys/configNotifyAPI";
import BaseDetail from "@/views/base/BaseDetail";
import { useRemoteCombobox } from '@/setup/remoteCombobox';
import dictionaryAPI from "@/apis/sys/dictionaryAPI";
import popupUtil from "@/commons/popupUtil";
import { showAlert } from '@/commons/globalMessage';
import userAPI from "@/apis/sys/userAPI";

export default defineComponent({
  mixins: [],
  extends: BaseDetail,
  setup() {
    const { proxy }: any = getCurrentInstance(); // Instance của component
    const storeModule: any = useModuleConfigNotify(); // Cấu hình store
    const api = ref(configNotifyAPI); // Cấu hình api
    const subSystemCode = ref("notify_config"); // Cấu hình phân quyền
    const { comboboxLoadData } = useRemoteCombobox();
    const dataCombobox = reactive({
      list_channel : [],
      notify_type: [],
      screen_code: [],
      function: [],
    });

    /**
     * Custom build filter combobox channel
     */
    const buildFilterComboboxChannel = (payload) => {
			const me: any = proxy;
			if(!payload.CustomParam){
				payload.CustomParam = {};
			}
			payload.CustomParam.ViewName = '"SYS".channel';
			payload.CustomParam.columns = 'channel_code,channel_name';
		}

    /**
     * Filter bản ghi đang kích hoạt ở mode add
     */
    const filterInactive = (payload) => {
      const me: any = proxy;
      if (me.editMode == me.$ms.constant.FormState.Add) {
        const filterIsActive = ["is_active", "=", true];
        me.$ms.commonFn.concatFilter(payload, filterIsActive);
      }
    };

    /**
     * Build filter tham số type
     */
    const filterType = (payload) => {
      const me: any = proxy;
      filterInactive(payload);
      const filter = ["dictionary_list_code", "=", "LoaiGuiNotify"]; // fix cứng lọc theo LoaiGuiNotify trong danh mục từ điển của a Sang
      me.$ms.commonFn.concatFilter(payload, filter);
    };

    /**
     * Build filter tham số filterScreen
     */
    const filterScreen = (payload) => {
      const me: any = proxy;
      filterInactive(payload);
      const filter = ["dictionary_list_code", "=", "ManHinhNotify"]; // fix cứng lọc theo ManHinhNotify trong danh mục từ điển của a Sang
      me.$ms.commonFn.concatFilter(payload, filter);
    };

    /**
     * Build filter tham số filterFunction
     */
    const filterFunction = (payload) => {
      const me: any = proxy;
      filterInactive(payload);
      const filter = ["dictionary_list_code", "=", "ChucNang"]; // fix cứng lọc theo ChucNang trong danh mục từ điển của a Sang
      me.$ms.commonFn.concatFilter(payload, filter);
    };

    /**
     * Xử lý chọn hoàng loạt user
     */
     const selectedUser = (users: any []) => {
      const me: any = proxy;
      me.model.receiver_ids = users.map((_) => _.user_id).join(';');
      reLoadUsers();
    };

    /**
     * Reload lại thông tin user được chọn
     */
    const reLoadUsers = async () => {
      const me: any = proxy;
      if(!me.model.receiver_ids){
        me.model.ReceiverDetail = [];
        return;
      }
      const filter = ['user_id', 'in', me.model.receiver_ids.split(';')];
      const payload = {
        PageIndex: 0,
        PageSize: 0,
        Columns: "user_id,user_name,user_code,user_full_name,phone_number",
        Filter: JSON.stringify(filter),
      };
      me.$ms.commonFn.mask();
      let result = await userAPI.getList(payload);
      me.$ms.commonFn.unmask();
      if(result?.Data?.PageData?.length){
        me.model.ReceiverDetail = result.Data.PageData;
      }
    };

    /**
     * Xử lý sau khi bind xong data
     */
    const afterBindData = async () => {
      reLoadUsers();
    };

    /**
     * Xoá 1 dòng
     */
    const deleteRow = (row) => {
      const me: any = proxy;
      me.model.ReceiverDetail = me.model.ReceiverDetail.filter(_ => _.user_id != row.user_id);
      me.model.receiver_ids = me.model.ReceiverDetail.map((_) => _.user_id).join(';');
    };

    /**
     * Xoá hết dòng
     */
    const deleteAllRow = async () => {
      const me: any = proxy;
      const result = await showAlert(me.$t('i18nCommon.AskDeleteRecord'));
      if(result){
        me.model.receiver_ids = '';
        me.model.ReceiverDetail = [];
      }
    };

    /**
     * Mở form chọn user nhận thông báo
     */
    const openSelectUser = () => {
      const me: any = proxy;
      const param = {
        selectedUser: selectedUser,
        receiver_ids: me.model.receiver_ids,
      };
      popupUtil.show('ReceiveSelectUser', param);
    };

    return {
      api,
      storeModule,
      subSystemCode,
      dataCombobox,
      dictionaryAPI,
      comboboxLoadData,
      buildFilterComboboxChannel,
      filterType,
      filterScreen,
      filterFunction,
      openSelectUser,
      deleteAllRow,
      afterBindData,
      deleteRow,
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
  gap: 12px;
}
.lst-btn{
  :deep(.btn){
    height: 24px;
  }
}
.lst-user{
  margin-bottom: 8px;
}
.user-item{
  border: 1px solid var(--primary__color);
  border-radius: 2px;
  background-color: #00666824;
  color: var(--primary__color);;
  padding: 6px;
  margin: 6px 0;
  align-items: center;
  .color-icon-primary{
    margin-right: 4px;
    cursor: pointer;
  }
}
</style>