<template>
    <ms-dynamic-popup
        :maximum="true"
        :title="$t('i18nDataControl.Title')"
        @beforeOpen="beforeOpen"
    >
        <template v-slot:content="{ close }">
            <div ref="slot-content" class="form-content-popup">
                <div class="form-container">
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
                        <div style="min-width: 320px" class="table-function_search">
                            <div class="action-render_table reload-table" @click="loadData" :title="$t('i18nCommon.load_data')"></div>
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
                        :idField="idField"
                        :gridInfo="gridInfo"
                        :loadData="loadData"
                    >
                        <template #widget-body="{ record }">
                            <div class="widget-container">
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
            </div>
        </template>
        <template v-slot:footer="{ close }">
        <div class="form-action">
            <div class="form-action_container">
                <div class="form-action_item">

                </div>
                <div class="form-action_item">
                    <ms-button @click="close">
                        {{ $t("i18nCommon.Close") }}
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
import useModuleDataControlDetail from "@/stores/sys/moduleDataControlDetail";
import dataControlAPI from "@/apis/sys/dataControlAPI";
import moment from "moment";
import { showAlert } from "@/commons/globalMessage";

export default defineComponent({
components: {
    MsGridViewer,
    ListConditionFilter,
},
extends: BaseList,
setup() {
    const { proxy }: any = getCurrentInstance(); // Instance của component
    const storeModule: any = useModuleDataControlDetail(); // Cấu hình store
    const api = ref(dataControlAPI); // Cấu hình api
    const idField = ref('');
    const subSystemCode = ref("monitoring_del_data"); // Cấu hình phân quyền
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
     * Layout
     */
    const columns = reactive(
        []
    );

    /**
     * filter theo ngày
     */
    const handleFilterType = async (dateParam, type) => {
        const me: any = proxy;
        if(typeActive.value.type != type){
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
     * Xử lý khi mở popup
     * @override
     */
    const beforeOpen = (e: any) => {
        const me: any = proxy;
        me._popup = me.$vfm.dynamicModals[me.$vfm.dynamicModals.length - 1];
        me._formParam = e.ref.params._rawValue
            ? e.ref.params._rawValue
            : e.ref.params;
        if(me._formParam?.infoTable){
            if(me._formParam.typeActive){
                typeActive.value = {
                    ...filterDate.value[me._formParam.typeActive.type],
                    type: me._formParam.typeActive.type,
                };
            }
            initColumns(me._formParam.infoTable);
        }
    };

    /**
     * Init layout động cho grid
     */
    const initColumns = (infoTable: []) => {
        const me = proxy;
        if(infoTable.length){
            infoTable.forEach((col: any) => {
                if(col.data_type == "uuid" && col.is_primary_key){ // khoá chính
                    idField.value = col.column_name;
                    me.storeModule._config.field.key = idField.value;
                }
                const column = {
                    "lock": false,
                    "width": 300,
                    "header": "",
                    "dataField": col.column_name,
                    "formatType": null,
                    "headerCustom": col.column_name,
                    "visible": true,
                    "enum": null,
                }
                switch (col.data_type) {
                    case "character varying":
                        column.formatType = 12;
                        break;
                    case "timestamp without time zone":
                    case "date":
                        column.formatType = 14;
                        break;
                    case "boolean":
                        column.formatType = 100;
                        column.enum = 'EnumYesNo';
                        break;
                    case "numeric":
                    case "decimal":
                    case "double":
                    case "integer":
                        column.formatType = 20;
                        break;
                    default:
                        break;
                }
                if(column.dataField == 'is_active'){
                    column.formatType = 100;
                    column.enum = 'EnumInactive';
                }
                else if(column.dataField == 'deleted_date'){
                    column.lock = true;
                }
                columns.push(column);
            });
            if(me.$refs[me.viewRef] && typeof me.$refs[me.viewRef].initColumns === 'function'){
                me.$refs[me.viewRef].initColumns(columns);
			}
        }
    };

    /**
     * Xử lý custom tham số load data trước khi call lên serve lấy dữ liệu
     * @override
     */
    const customParamLoadData = async (param: any) => {
        const me = proxy;
        const filterDeletedDate = [
            ["deleted_date", ">=", typeActive.value.fromDate],
            "and",
            ["deleted_date", "<=", typeActive.value.toDate],
        ];
        if(!param.CustomParam){
            param.CustomParam = {};
        }
        param.CustomParam.ViewName = `"${me._formParam.dataRow.schema_name}".${me._formParam.dataRow.table_name}`;
        param.CustomParam.isPagingDetail = true;
        param.CustomParam.columnKey = idField.value;
        me.$ms.commonFn.concatFilter(param, filterDeletedDate);
        param.Columns = "*";
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
            const model = {
                schema_name: me._formParam.dataRow.schema_name,
                table_name: me._formParam.dataRow.table_name,
                ColumnKey: idField.value,
                ValueKey: record[idField.value],
                [idField.value]: record[idField.value],
            };
            if(type == 'delete'){
                res = await me.storeModule.deleteDataControl(model);
            }
            else {
                res = await me.storeModule.restoreData(model);
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
            const dataControls = lstID.map(_ => {
                return {
                    schema_name: me._formParam.dataRow.schema_name,
                    table_name: me._formParam.dataRow.table_name,
                    ColumnKey: idField.value,
                    ValueKey: _,
                    [idField.value]: _,
                }
            });
            if(type == 'delete'){
                res = await dataControlAPI.deleteDataControl(dataControls);
            }
            else {
                res = await dataControlAPI.restoreData(dataControls);
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
        idField,
        columns,
        storeModule,
        filterDate,
        typeActive,
        subSystemCode,
        handleFilterType,
        beforeOpen,
        deleteMultiple,
        deleteRow,
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
.form-content-popup{
    height: 100%;
}
.form-container{
    padding: 0 0px 0 0;
    height: 100%;
    display: flex;
    flex-direction: column;
}
:deep(.ms-grid-viewer){
    flex: 1;
}
</style>