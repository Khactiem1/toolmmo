<template>
  <ms-dynamic-popup
    :width="800"
    :height="700"
    :title="`${
      editMode ? $ms.commonFn.getEnumResource(editMode, 'FormState') : ''
    } ${$t('i18nReceiveNotify.Title')}`"
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
                :label="$t('i18nReceiveNotify.Detail.receive_notify_code')"
                v-model="model.receive_notify_code"
              ></ms-input>
            </div>
            <div class="form-group">
              <ms-input
                :maxLength="100"
                :rules="[{ name: 'required' }]"
                :label="$t('i18nReceiveNotify.Detail.receive_notify_name')"
                v-model="model.receive_notify_name"
              ></ms-input>
            </div>
          </div>
          <div class="form-item_input">
            <div class="form-group">
              <ms-combobox-v2
                :label="$t('i18nReceiveNotify.Detail.config_notify_name')"
                valueField="config_notify_id"
                displayField="config_notify_name"
                :data="dataCombobox.config_notify"
                :initText="model.config_notify_name"
                @comboboxLoadData="(payload) => comboboxLoadData(payload, configNotifyAPI, dataCombobox, 'config_notify')"
                @selected="selectedConfigNotify"
                :buildFilter="filterInactive"
                :dropdownWidth="400"
                :columns="[
                  { title: $t('i18nConfigNotify.Detail.config_notify_code'), dataField: 'config_notify_code', width: 160, filterOperator: $ms.constant.FilterOperator.Contains, },
                  { title: $t('i18nConfigNotify.Detail.config_notify_name'), dataField: 'config_notify_name', width: 220, filterOperator: $ms.constant.FilterOperator.Contains, },
                ]"
                queryMode="remote"
                :remoteFilter="true"
                v-model="model.config_notify_id"
                v-model:display="model.config_notify_name"
              ></ms-combobox-v2>
            </div>
            <div class="form-group">
              <ms-input
                :disabled="true"
                :label="$t('i18nReceiveNotify.Detail.config_notify_code')"
                v-model="model.config_notify_code"
              ></ms-input>
            </div>
          </div>
          <div class="form-item_input">
            <div class="form-group">
              <ms-textarea
                :maxLength="250"
                :label="$t('i18nReceiveNotify.Detail.description')"
                v-model="model.description"
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
import useModuleReceiveNotify from "@/stores/sys/moduleReceiveNotify";
import receiveNotifyAPI from "@/apis/sys/receiveNotifyAPI";
import BaseDetail from "@/views/base/BaseDetail";
import configNotifyAPI from "@/apis/sys/configNotifyAPI";
import { useRemoteCombobox } from '@/setup/remoteCombobox';
import popupUtil from "@/commons/popupUtil";
import { showAlert } from '@/commons/globalMessage';
import userAPI from "@/apis/sys/userAPI";

export default defineComponent({
  mixins: [],
  extends: BaseDetail,
  setup() {
    const { proxy }: any = getCurrentInstance(); // Instance của component
    const storeModule: any = useModuleReceiveNotify(); // Cấu hình store
    const api = ref(receiveNotifyAPI); // Cấu hình api
    const subSystemCode = ref("config_recieve_notify"); // Cấu hình phân quyền
    const { comboboxLoadData } = useRemoteCombobox();
    const dataCombobox = reactive({
      config_notify: [],
    });

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

    /**
     * Custom build filter combobox
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
    const selectedConfigNotify = (metaData) => {
      const me: any = proxy;
      me.model.config_notify_code = metaData.newData ? metaData.newData.config_notify_code : null;
      me.model.config_notify_name = metaData.newData ? metaData.newData.config_notify_name : null;
    };

    return {
      api,
      storeModule,
      subSystemCode,
      dataCombobox,
      configNotifyAPI,
      comboboxLoadData,
      filterInactive,
      selectedConfigNotify,
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