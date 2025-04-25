<template>
    <div class="container-table">
      <div class="container-table_header border-line-bottom">
        <div class="name-table text-uppercase">
          <h1>{{ $t("i18nDataControl.Title") }}</h1>
        </div>
      </div>
      <div class="table-function sticky">
        <div class="form-fix">
          <div class="action-left flex">
            <button
                style="margin-right: 8px"
                class="table-function_series toggle-list"
            >
                <span>{{ $t("i18nCommon.batch_execution") }}</span>
                <div class="table-function_series-icon"></div>
                <div
                    class="table-list_action"
                    v-if="gridInfo.selected?.length"
                >
                    <div
                        class="list_action-item"
                        v-if="checkActionPermission('Delete')"
                        @click="deleteMultiple('delete')"
                    >
                        <font-awesome-icon :icon="['fas', 'trash']" class="mr-2" />
                        {{ $t("i18nEnum.ModelState.Delete") }}
                    </div>
                    <div
                        class="list_action-item"
                        v-if="checkActionPermission('Edit')"
                        @click="deleteMultiple('restore')"
                    >
                        <i class="fa fa-refresh mr-2" aria-hidden="true"></i>
                        {{ $t("i18nCommon.crud.restore") }}
                    </div>
                </div>
            </button>
            <div style="width: 320px">
              <ms-input @input="debounceSearch" v-model="searchText" :placeholder="$t('i18nCommon.search')" :styleCustom="{
                paddingLeft: '32px',
              }">
                <template #iconCustom>
                  <div class="icon-wrapper">
                    <i class="fa fa-search" :style="{
                      color: '#b6b7b7',
                      position: 'relative',
                      top: '2px',
                    }"></i>
                  </div>
                </template>
              </ms-input>
            </div>
          </div>
          <list-condition-filter :grid="$refs[viewRef]" @loadData="loadData"></list-condition-filter>
        </div>
        <div style="min-width: 320px" class="table-function_search">
          <div class="action-render_table reload-table" @click="loadData" :content="$t('i18nCommon.load_data')"></div>
          <div class="action-render_table export-data" @click="exportData" :content="$t('i18nCommon.export_excel')"></div>
        </div>
      </div>
      <div style="padding-top: 0; z-index: 5;" class="table-function">
        <div class="flex badge-container">
          <div @click="handleFilterType(filterDate.all, 'all')" class="badge" :class="{ 'active': typeActive.type == 'all' }">
            {{ $t('i18nDataControl.List.All') }}
          </div>
          <div @click="handleFilterType(filterDate.today, 'today')" class="badge" :class="{ 'active': typeActive.type == 'today' }">
            {{ $t('i18nDataControl.List.Today') }}
          </div>
          <div @click="handleFilterType(filterDate.thisWeek, 'thisWeek')" class="badge" :class="{ 'active': typeActive.type == 'thisWeek' }">
            {{ $t('i18nDataControl.List.ThisWeek') }}
          </div>
          <div @click="handleFilterType(filterDate.thisMonth, 'thisMonth')" class="badge" :class="{ 'active': typeActive.type == 'thisMonth' }">
            {{ $t('i18nDataControl.List.ThisMonth') }}
          </div>
          <div @click="handleFilterType(filterDate.thisYear, 'thisYear')" class="badge" :class="{ 'active': typeActive.type == 'thisYear' }">
            {{ $t('i18nDataControl.List.thisYear') }}
          </div>
        </div>
      </div>
      <ms-grid-viewer 
        :ref="viewRef" 
        :columns="columns" 
        :data="storeModule.items" 
        :pageTotal="storeModule.total"
        :loading="storeModule.loading" 
        :idField="'table_name'" 
        :gridInfo="gridInfo" 
        :loadData="loadData"
        @handleDoubleClickRow="edit"
      >
        <template #widget-body="{ record }">
          <div class="widget-container">
            <button 
              v-if="checkActionPermission('Edit')" 
              @click="edit(record)" 
              class="action-table action-table_left"
              :title="$t('i18nEnum.ModelState.Update')"
            >
              <div class="action-default pr-1">
                <font-awesome-icon :icon="['fas', 'file-pen']" />
              </div>
            </button>
            <button
                v-if="checkActionPermission('Delete')"
                @click="deleteRow(record, 'delete')"
                :title="$t('i18nEnum.ModelState.Delete')"
                class="action-table action-table_left"
            >
                <div class="action-default pr-1 danger-color">
                    <font-awesome-icon :icon="['fas', 'trash']" class="mr-2" />
                </div>
            </button>
            <button
                :title="$t('i18nCommon.crud.restore')"
                v-if="checkActionPermission('Edit')"
                @click="deleteRow(record, 'restore')"
                class="action-table action-table_left primary-color"
            >
                <i class="fa fa-refresh" aria-hidden="true"></i>
            </button>
          </div>
        </template>
      </ms-grid-viewer>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, getCurrentInstance, ref } from "vue";
  import MsGridViewer from "@/components/msGridViewer/MsGridViewer.vue";
  import ListConditionFilter from "@/components/msGridViewer/ListConditionFilter.vue";
  import BaseList from "@/views/base/BaseList";
  import useModuleDataControl from "@/stores/sys/moduleDataControl";
  import dataControlAPI from "@/apis/sys/dataControlAPI";
  import moment from "moment";
  import popupUtil from '@/commons/popupUtil';
import { showAlert } from "@/commons/globalMessage";
  
  export default defineComponent({
    components: {
      MsGridViewer,
      ListConditionFilter,
    },
    extends: BaseList,
    setup: () => {
      const { proxy }: any = getCurrentInstance(); // Instance của component
      const storeModule: any = useModuleDataControl(); // Cấu hình store
      const formDetailName = ref("DataControlDetail"); // Cấu hình tên form detail
      const api = ref(dataControlAPI); // Cấu hình api
      const subSystemCode = ref("monitoring_del_data"); // Cấu hình phân quyền
      const isLoadActiveColumn = ref(false);
      const filterDate = ref({
        all: {
          fromDate: moment('1972-01-01').startOf('day').format("YYYY-MM-DDTHH:mm:ss"),
          toDate: moment('2100-12-31').endOf('day').format("YYYY-MM-DDTHH:mm:ss"),
        },
        today: {
          fromDate: moment().startOf('day').format("YYYY-MM-DDTHH:mm:ss"),
          toDate: moment().endOf('day').format("YYYY-MM-DDTHH:mm:ss"),
        },
        thisWeek: {
          fromDate: moment().startOf('week').format("YYYY-MM-DDTHH:mm:ss"),
          toDate: moment().endOf('week').format("YYYY-MM-DDTHH:mm:ss"),
        },
        thisMonth: {
          fromDate: moment().startOf('month').format("YYYY-MM-DDTHH:mm:ss"),
          toDate: moment().endOf('month').format("YYYY-MM-DDTHH:mm:ss"),
        },
        thisYear: {
          fromDate: moment().startOf('year').format('YYYY-MM-DDTHH:mm:ss'),
          toDate: moment().endOf('year').format('YYYY-MM-DDTHH:mm:ss'),
        }
      });
      const typeActive = ref({
        ...filterDate.value.all,
        type: 'all',
      });
  
      /**
       * Layout grid
       */
      const columns: any[] = [
        {
          lock: false,
          width: 200,
          header: "i18nDataControl.Detail.schema_name",
          dataField: "schema_name",
          formatType: 12,
          headerCustom: "",
          visible: true,
        },
        {
          lock: false,
          width: null,
          header: "i18nDataControl.Detail.table_name",
          dataField: "table_name",
          formatType: 12,
          headerCustom: "",
          visible: true,
        },
        {
          lock: false,
          width: 160,
          header: "i18nDataControl.Detail.total_deleted",
          dataField: "total_deleted",
          formatType: 20,
          headerCustom: "",
          visible: true,
        },
      ];

      /**
       * filter theo ngày
       */
      const handleFilterType = async (dateParam, type) => {
        const me: any = proxy;
        if(typeActive.value != type){
          typeActive.value = {
            ...dateParam,
            type: type,
          };
          me.storeModule.items = [];
          if (typeof me.$refs[me.viewRef]?.loadPageIndex === "function") {
            me.$refs[me.viewRef].loadPageIndex(1);
          }
        }
      };
      
      /**
       * Custom tham số trước khi load data
       */
      const customParamLoadData = async (param: any) => {
        if(!param.CustomParam){
          param.CustomParam = {};
        }
        param.Columns = "*";
        param.CustomParam.fromDate = typeActive.value.fromDate;
        param.CustomParam.toDate = typeActive.value.toDate;
      };

      /**
       * Mở form sửa một bản ghi
       * @param record
       */
      const edit = async (record: any) => {
        const me: any = proxy;
        if(me.subSystemCode && !me.checkActionPermission("Edit")){
          return;
        }
        me.$ms.commonFn.mask();
        let res = await me.api.getRecordByTableName(record);
        me.$ms.commonFn.unmask();
        if (res?.Success){
          let param = {
            dataRow: record,
            infoTable: res.Data,
            typeActive: typeActive.value,
          }
          popupUtil.show(me.formDetailName, param);
        }
      };

      /**
       * Xoá một bản ghi trên danh sách
       * @param record
       * @override
       */
      const deleteRow = async (record: any, type: string) => {
          const me: any = proxy;
          const result = await showAlert(me.$t(type == 'delete' ? 'i18nCommon.AskDeleteRecord' : 'i18nCommon.AskRestoreRecord'));
          if(result){
              me.$ms.commonFn.mask();
              let res = null;
              if(type == 'delete'){
                  res = await me.storeModule.deleteDataControlBySchema(record);
              }
              else {
                  res = await me.storeModule.restoreDataBySchema(record);
              }
              me.$ms.commonFn.unmask();
              if (res?.Success){
                  if(!me.storeModule.items.length){
                      if(typeof me.$refs[me.viewRef]?.loadPageIndex === 'function'){
                          me.$refs[me.viewRef].loadPageIndex(1);
                      }
                  }
                  me.$ms.commonFn.pushNotification({
                      type: me.$ms.constant.ENotificationType.Success,
                      message: me.$t(type == 'delete' ? 'i18nCommon.crud.delete_success' : 'i18nCommon.crud.restore_success'),
                  });
              }
          }
      };

      /**
       * Xoá nhiều bản ghi 1 lúc
       * @author nktiem 05.12.2024
       * @override
       */
      const deleteMultiple = async (type: string) => {
          const me: any = proxy;
          const result = await showAlert(me.$t(type == 'delete' ? 'i18nCommon.AskDeleteRecord' : 'i18nCommon.AskRestoreRecord'));
          if(result){
              const lstID: any [] = me.gridInfo.selected.map((_: any) => _[me.storeModule._config.field.key]);
              me.$ms.commonFn.mask();
              let res = null;
              if(type == 'delete'){
                  res = await dataControlAPI.deleteDataControlBySchema(me.gridInfo.selected);
              }
              else {
                  res = await dataControlAPI.restoreDataBySchema(me.gridInfo.selected);
              }
              me.$ms.commonFn.unmask();
              if (res?.Success){
                  lstID.forEach((_: any) => {
                      let idxRemove = me.storeModule.items.findIndex((row: any) => row[me.storeModule._config.field.key] === _);
                      if (idxRemove !== -1){
                          me.storeModule.items.splice(idxRemove, 1);
                          me.storeModule.total -= 1;
                      }
                  });
                  me.gridInfo.selected = [];
                  if(!me.storeModule.items.length){
                      if(typeof me.$refs[me.viewRef]?.loadPageIndex === 'function'){
                          me.$refs[me.viewRef].loadPageIndex(1);
                      }
                  }
                  me.$ms.commonFn.pushNotification({
                      type: me.$ms.constant.ENotificationType.Success,
                      message: me.$t(type == 'delete' ? 'i18nCommon.crud.delete_success' : 'i18nCommon.crud.restore_success'),
                  });
              }
          }
      };
  
      return {
        api,
        columns,
        subSystemCode,
        storeModule,
        formDetailName,
        filterDate,
        typeActive,
        isLoadActiveColumn,
        edit,
        deleteRow,
        deleteMultiple,
        handleFilterType,
        customParamLoadData,
      };
    },
  });
</script>
  
<style lang="scss" scoped>
@use "@/assets/scss/listStyle" as style;
.badge-container .badge.active {
  background-color: var(--primary__color);
  border-color: var(--primary__color);
  color: var(--while__color);
}
</style>