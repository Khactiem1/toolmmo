<template>
  <ms-dynamic-popup
    :width="1100"
    :height="800"
    :title="$t('i18nReceiveNotify.Detail.receiver_ids')"
    @beforeOpen="beforeOpen"
  >
    <template v-slot:content="{ close }">
      <div ref="slot-content" class="form-content-popup">
        <div class="form-container">
          <div class="table-function sticky">
            <div class="form-fix">
              <div class="action-left flex">
                <div style="width: 200px">
                  <ms-input
                    @input="debounceSearch"
                    v-model="searchText"
                    :placeholder="$t('i18nCommon.search')"
                  >
                  </ms-input>
                </div>
              </div>
              <list-condition-filter
                :grid="$refs[viewRef]"
                @loadData="loadData"
              ></list-condition-filter>
            </div>
          </div>
          <ms-grid-viewer
            :ref="viewRef"
            :columns="columns"
            :data="storeModule.items"
            :pageTotal="storeModule.total"
            :loading="storeModule.loading"
            :idField="'user_id'"
            :gridInfo="gridInfo"
            :loadData="loadData"
            :showAction="false"
          >
            <template #avartar="{ record }">
              <div class="image-table">
                <img
                  v-if="record.avartar"
                  v-bind:src="fileAPI.getFileViewUrl(record.avartar)"
                />
              </div>
            </template>
          </ms-grid-viewer>
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
              {{ $t("i18nCommon.crud.chose") }}
            </ms-button>
          </div>
        </div>
      </div>
    </template>
  </ms-dynamic-popup>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref, reactive } from "vue";
import MsGridViewer from "@/components/msGridViewer/MsGridViewer.vue";
import ListConditionFilter from "@/components/msGridViewer/ListConditionFilter.vue";
import BaseList from "@/views/base/BaseList";
import fileAPI from "@/apis/file/fileAPI";
import useModuleUser from "@/stores/sys/moduleUser";
import userAPI from "@/apis/sys/userAPI";
import { showError } from "@/commons/globalMessage";

export default defineComponent({
  components: {
    MsGridViewer,
    ListConditionFilter,
  },
  extends: BaseList,
  setup() {
    const { proxy }: any = getCurrentInstance(); // Instance của component
    const storeModule: any = useModuleUser(); // Cấu hình store
    const api = ref(userAPI); // Cấu hình api

    /**
     * Thực hiện lưu
     */
    const save = () => {
      const me: any = proxy;
      if(me.gridInfo.selected?.length > 5){
        showError(me.$t('i18nReceiveNotify.ValidateSelectUser'));
        return;
      }
      if(typeof me._formParam?.selectedUser === 'function'){
        me._formParam.selectedUser(me.gridInfo.selected);
      }
      hide();
    };

    /**
     * Xử lý khi mở popup
     */
    const beforeOpen = (e: any) => {
      const me: any = proxy;
      me._popup = me.$vfm.dynamicModals[me.$vfm.dynamicModals.length - 1];
      me._formParam = e.ref.params._rawValue
        ? e.ref.params._rawValue
        : e.ref.params;
      if(me._formParam?.receiver_ids){
        const lstId = me._formParam.receiver_ids.split(';');
        lstId.forEach(_ => {
          if(_){
            me.gridInfo.selected.push({
              user_id: _,
            });
          }
        });
      }
    };

    const columns = reactive(
        [
          {
              "lock": true,
              "width": "150",
              "header": "i18nUser.Detail.user_name",
              "dataField": "user_name",
              "formatType": 12,
              "headerCustom": "",
              "visible": true
          },
          {
              "lock": true,
              "width": "120",
              "header": "i18nUser.Detail.user_code",
              "dataField": "user_code",
              "formatType": 12,
              "headerCustom": "",
              "visible": true
          },
          {
              "lock": false,
              "width": "",
              "header": "i18nUser.Detail.user_full_name",
              "dataField": "user_full_name",
              "formatType": 12,
              "headerCustom": "Họ tên",
              "visible": true
          },
          {
              "lock": false,
              "width": "150",
              "header": "i18nUser.Detail.manager",
              "dataField": "manager_name",
              "formatType": 12,
              "headerCustom": "",
              "visible": true
          },
          {
              "lock": false,
              "width": 180,
              "header": "i18nUser.Detail.department_name",
              "dataField": "department_name",
              "formatType": 12,
              "headerCustom": "",
              "visible": true
          },
          {
              "lock": false,
              "width": 180,
              "header": "i18nUser.Detail.position_name",
              "dataField": "position_name",
              "formatType": 12,
              "headerCustom": "",
              "visible": true
          },
          {
              "lock": false,
              "width": "130",
              "header": "i18nUser.Detail.date_joining",
              "dataField": "date_joining",
              "formatType": 14,
              "headerCustom": "",
              "visible": true
          },
          {
              "lock": false,
              "width": "120",
              "header": "i18nUser.Detail.date_of_birth",
              "dataField": "date_of_birth",
              "formatType": 14,
              "headerCustom": "",
              "visible": true
          },
          {
              "lock": false,
              "width": "120",
              "header": "i18nUser.Detail.gender",
              "dataField": "gender",
              "formatType": 100,
              "enum": "Gender",
              "headerCustom": "",
              "visible": true
          },
          {
              "lock": false,
              "width": "120",
              "header": "i18nUser.Detail.phone_number",
              "dataField": "phone_number",
              "formatType": 12,
              "headerCustom": "Điện thoại",
              "visible": true
          },
          {
              "lock": false,
              "width": "170",
              "header": "i18nUser.Detail.email",
              "dataField": "email",
              "formatType": 12,
              "headerCustom": "Email",
              "visible": true
          },
          {
              "lock": false,
              "width": "200",
              "header": "i18nUser.Detail.address",
              "dataField": "address",
              "formatType": 12,
              "headerCustom": "",
              "visible": false
          },
      ]
    );

    /**
     * Đóng form
     */
    const hide = () => {
      try {
        const me: any = proxy;
        me._popup.value = false;
        me.$nextTick(() => {
          delete me._popup;
        });
      } catch (ex) {
        console.error(ex);
      }
    };

    return {
      api,
      columns,
      fileAPI,
      storeModule,
      save,
      beforeOpen,
    };
  },
});
</script>

<style lang="scss" scoped>
.form-container{
  padding: 0 16px 0 0;
}
</style>
