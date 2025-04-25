<template>
    <div class="container-table">
        <div class="container-table_header border-line-bottom">
            <div class="name-table text-uppercase">
                <h1>{{ $t("i18nSupplier.Title") }}</h1>
            </div>
            <div class="action-table">
                <div class="btn-add">
                    <ms-button v-if="checkActionPermission('Add')" @click="add" class="primary">
                        {{ $t("i18nEnum.FormState.Add") }}
                    </ms-button>
                </div>
            </div>
        </div>
        <div class="table-function sticky">
            <div class="form-fix">
                <div class="action-left flex">
                    <ms-button style="margin-right: 8px" class="table-function_series toggle-list">
                        <span>{{ $t("i18nCommon.batch_execution") }}</span>
                        <div class="table-function_series-icon"></div>
                        <div v-show="true" class="table-list_action" v-if="gridInfo.selected?.length">
                            <div class="list_action-item" v-if="checkActionPermission('Delete')"
                                @click="deleteMultiple">
                                <font-awesome-icon :icon="['fas', 'trash']" class="mr-2" />
                                {{ $t("i18nEnum.ModelState.Delete") }}
                            </div>
                            <div class="list_action-item" v-if="checkActionPermission('Edit')"
                                @click="toggleActive(gridInfo.selected, true)">
                                <i class="fa-solid fa-toggle-off mr-2 color-icon-primary"></i>
                                {{ $t("i18nEnum.FeatureRow.Active") }}
                            </div>
                            <div class="list_action-item" v-if="checkActionPermission('Edit')"
                                @click="toggleActive(gridInfo.selected, false)">
                                <font-awesome-icon :icon="['fas', 'toggle-on']" class="mr-2" />
                                {{ $t("i18nEnum.FeatureRow.Inactive") }}
                            </div>
                        </div>
                    </ms-button>
                    <div style="width: 320px">
                        <ms-input @input="debounceSearch" v-model="searchText" :placeholder="$t('i18nCommon.search')"
                            :styleCustom="{
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
                <div class="action-render_table reload-table" @click="loadData" :content="$t('i18nCommon.load_data')">
                </div>
                <div class="action-render_table export-data" @click="exportData"
                    :content="$t('i18nCommon.export_excel')"></div>
                <div class="action-render_table setting-table" v-if="checkActionPermission('ShowColumns')"
                    @click="configLayout" :content="$t('i18nCommon.customize_interface')"></div>
            </div>
        </div>
        <div style="padding-top: 0; z-index: 5;" class="table-function">
            <div class="flex badge-container">
                <div @click="handleFilterStatus({ supplier_status: 'all' })" class="badge"
                    :class="{ 'active': filterSupplierStatus == 'all' }">
                    {{ $t('i18nCommon.all') }}
                </div>
                <div @click="handleFilterStatus(supplier_status.LuuTam)"
                    :class="{ 'active': filterSupplierStatus == 'LuuTam' }" class="badge">
                    {{ supplier_status.LuuTam.supplier_status_name }}
                </div>
                <div style="color: #f87119;" @click="handleFilterStatus(supplier_status.ChoDuyet)"
                    :class="{ 'active': filterSupplierStatus == 'ChoDuyet' }" class="badge">
                    {{ supplier_status.ChoDuyet.supplier_status_name }}
                </div>
                <div style="color: #25aa0c;" @click="handleFilterStatus(supplier_status.DaDuyet)"
                    :class="{ 'active': filterSupplierStatus == 'DaDuyet' }" class="badge">
                    {{ supplier_status.DaDuyet.supplier_status_name }}
                </div>
                <div style="color: #ff0000;" @click="handleFilterStatus(supplier_status.TuChoi)"
                    :class="{ 'active': filterSupplierStatus == 'TuChoi' }" class="badge">
                    {{ supplier_status.TuChoi.supplier_status_name }}
                </div>
            </div>
        </div>
        <ms-grid-viewer :ref="viewRef" :data="storeModule.items" :pageTotal="storeModule.total"
            :loading="storeModule.loading" :idField="'supplier_id'" :gridInfo="gridInfo" :loadData="loadData"
            @handleDoubleClickRow="edit">
            <template #logo="{ record }">
                <div class="image-table">
                    <img v-if="record.logo" v-bind:src="fileAPI.getFileViewUrl(record.logo)" />
                </div>
            </template>
            <template #is_lock="{ record }">
                <div class="image-table">
                    <ms-switch :disabled="true" v-model="record.is_lock"></ms-switch>
                </div>
            </template>
            <template #widget-body="{ record }">
                <div class="widget-container">
                    <button v-if="checkActionPermission('Edit')" @click="edit(record)"
                        class="action-table action-table_left">
                        <div class="action-default pr-1">
                            <font-awesome-icon :icon="['fas', 'file-pen']" />
                        </div>
                    </button>
                    <button v-else-if="checkActionPermission('Delete')" @click="deleteRow(record)"
                        class="action-table action-table_left">
                        <div class="action-default pr-1">
                            <font-awesome-icon :icon="['fas', 'trash']" class="mr-2" />
                           
                        </div>
                    </button>
                    <menu-wrapper class="widget-more-container" :style="{ 'margin-left': '4px', cursor: 'pointer' }"
                        :usingClickoutSide="true">
                        <template #menu-button="{ toggleMenu }">
                            <div @click="toggleMenu" class="ml-1">
                                <i class="fa-solid fa-caret-down pa-1 color-icon-primary"></i>
                            </div>
                        </template>
                        <template #menu-content>
                            <menu-item v-if="checkActionPermission('Delete')"
                                class="menu-item-feture my-1 text-color-primary hover-primary"
                                @menu-item-click="deleteRow(record)">
                                <font-awesome-icon :icon="['fas', 'trash']" class="mr-2" />
                                <span>{{ $t("i18nEnum.FeatureRow.Delete") }}</span>
                            </menu-item>
                            <menu-item class="menu-item-feture my-1 text-color-primary hover-primary"
                                v-if="record.is_active && checkActionPermission('Edit')"
                                @menu-item-click="toggleActive([record], false)">
                                <font-awesome-icon :icon="['fas', 'toggle-on']" class="mr-2" />
                                <span>{{ $t("i18nEnum.FeatureRow.Inactive") }}</span>
                            </menu-item>
                            <menu-item class="menu-item-feture my-1 text-color-primary hover-primary"
                                v-else-if="checkActionPermission('Edit')"
                                @menu-item-click="toggleActive([record], true)">
                                <i class="fa-solid fa-toggle-off mr-2 color-icon-primary"></i>
                                <span>{{ $t("i18nEnum.FeatureRow.Active") }}</span>
                            </menu-item>
                        </template>
                    </menu-wrapper>
                </div>
            </template>
        </ms-grid-viewer>
    </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref, onBeforeMount, reactive } from "vue";
import MsGridViewer from "@/components/msGridViewer/MsGridViewer.vue";
import ListConditionFilter from "@/components/msGridViewer/ListConditionFilter.vue";
import BaseList from "@/views/base/BaseList";
import useModuleSupplier from "@/stores/cust/moduleSupplier";
import MenuItem from "@/components/dropdown/MenuItem.vue";
import MenuWrapper from "@/components/dropdown/MenuWrapper.vue";
import supplierAPI from "@/apis/cust/supplierAPI";
import fileAPI from "@/apis/file/fileAPI";
import { useSupplierConfig } from "./supplierConfig";

export default defineComponent({
    components: {
        MsGridViewer,
        ListConditionFilter,
        MenuItem,
        MenuWrapper,
    },
    extends: BaseList,
    setup: () => {
        const { proxy }: any = getCurrentInstance(); // Instance của component
        const storeModule: any = useModuleSupplier(); // Cấu hình store
        const layoutTag = ref("SupplierList"); // Cấu hình layout
        const formDetailName = ref("SupplierDetail"); // Cấu hình tên form detail
        const subSystemCode = ref("supplier_info"); // Cấu hình phân quyền
        const api = ref(supplierAPI); // Cấu hình api

        const { supplier_status, loadMappingSupplierStatus } = useSupplierConfig();
        const filterSupplierStatus = ref('all');

        /**
         * Xử lý khi onBeforeMount
         */
        onBeforeMount(() => {
            loadMappingSupplierStatus();
        });

        /**
         * Filter theo trạng thái
         */
        const handleFilterStatus = (status) => {
            const me: any = proxy;
            filterSupplierStatus.value = status.supplier_status;
            if (typeof me.$refs[me.viewRef]?.loadPageIndex === "function") {
                me.$refs[me.viewRef].loadPageIndex(1);
            }
        };
        const customParamLoadData = (param) => {
            const me: any = proxy;
            if (filterSupplierStatus.value != 'all') {
                const filterStatus = ["approval_status", "=", filterSupplierStatus.value];
                me.$ms.commonFn.concatFilter(param, filterStatus);
            }
            const filterSupplier = ["parent_id", "isnull", ""];
            me.$ms.commonFn.concatFilter(param, filterSupplier);
        };
        return {
            api,
            fileAPI,
            layoutTag,
            storeModule,
            subSystemCode,
            formDetailName,
            supplier_status,
            filterSupplierStatus,
            handleFilterStatus,
            customParamLoadData
        };
    },
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/listStyle" as style;
</style>