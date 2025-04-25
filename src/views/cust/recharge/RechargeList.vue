<template>
    <div class="container-table">
        <div class="container-table_header border-line-bottom">
            <div class="name-table text-uppercase">
                <h1>{{ $t("i18nRecharge.Title") }}</h1>
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
                <div @click="handleFilterStatus({ transaction_type: 'all' })" class="badge"
                    :class="{ 'active': filterNewsStatus == 'all' }">
                    {{ $t('i18nCommon.all') }}
                </div>
                <div @click="handleFilterStatus(transaction_type.NapTien)"
                    :class="{ 'active': filterNewsStatus == 'NapTien' }" class="badge">
                    {{ transaction_type.NapTien.news_status_name }}
                </div>
                <div style="color: #f87119;" @click="handleFilterStatus(transaction_type.HoanTien)"
                    :class="{ 'active': filterNewsStatus == 'HoanTien' }" class="badge">
                    {{ transaction_type.HoanTien.news_status_name }}
                </div>
            </div>
        </div>
        <ms-grid-viewer :ref="viewRef" :data="storeModule.items" :pageTotal="storeModule.total"
            :loading="storeModule.loading" :idField="'recharge_id'" :gridInfo="gridInfo" :loadData="loadData"
            @handleDoubleClickRow="edit">
            <template #payment_method_name="{ record }">
                <div class="flex gap-6" style="align-items: center; justify-content: left;">
                    <div class="image-table">
                        <img v-if="record.icon" v-bind:src="fileAPI.getFileViewUrl(record.icon)" />
                    </div>
                    <span>{{ record.payment_method_name }}</span>
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
import useModuleRecharge from "@/stores/cust/moduleRecharge";
import MenuItem from "@/components/dropdown/MenuItem.vue";
import MenuWrapper from "@/components/dropdown/MenuWrapper.vue";
import rechargeAPI from "@/apis/cust/rechargeAPI";
import dictionaryAPI from "@/apis/sys/dictionaryAPI";
import fileAPI from "@/apis/file/fileAPI";

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
        const storeModule: any = useModuleRecharge(); // Cấu hình store
        const layoutTag = ref("RechargeList"); // Cấu hình layout
        const formDetailName = ref("RechargeDetail"); // Cấu hình tên form detail
        const subSystemCode = ref("recharge_refund"); // Cấu hình phân quyền
        const api = ref(rechargeAPI); // Cấu hình api
        const isLoadActiveColumn = ref(false);
        const filterNewsStatus = ref('all');

        const transaction_type = ref({
            NapTien: {
                transaction_type: "NapTien",
                news_status_name: "",
            },
            HoanTien: {
                transaction_type: "HoanTien",
                news_status_name: "",
            },
        });
        const loadMappingNewStatus = async () => {
            const me: any = proxy;
            const payload = {
                PageIndex: 0,
                PageSize: 0,
                Columns: "*",
                Filter: "",
                Sort: "",
                CustomParam: {},
            };
            payload.Filter = JSON.stringify(["dictionary_list_code", "=", "LoaiGiaoDich"]);
            me.$ms.commonFn.mask();
            const result = await dictionaryAPI.getList(payload);
            me.$ms.commonFn.unmask();
            if (result?.Success && result?.Data?.PageData?.length) {
                const statusHoanTien = result.Data.PageData.find(_ => _.dictionary_value == transaction_type.value.HoanTien.transaction_type);
                const statusNapTien = result.Data.PageData.find(_ => _.dictionary_value == transaction_type.value.NapTien.transaction_type);
                if (statusHoanTien) {
                    transaction_type.value.HoanTien.news_status_name = statusHoanTien.dictionary_name;
                }
                if (statusNapTien) {
                    transaction_type.value.NapTien.news_status_name = statusNapTien.dictionary_name;
                }
            }
        };
        /**
         * Xử lý khi onBeforeMount
         */
        onBeforeMount(() => {
            loadMappingNewStatus();
        });

        /**
         * Filter theo trạng thái
         */
        const handleFilterStatus = (status) => {
            const me: any = proxy;
            filterNewsStatus.value = status.transaction_type;
            if (typeof me.$refs[me.viewRef]?.loadPageIndex === "function") {
                me.$refs[me.viewRef].loadPageIndex(1);
            }
        };

        /**
         * Xử lý custom tham số load data trước khi call lên serve lấy dữ liệu
         * @override
         */
        const customParamLoadData = (param) => {
            const me: any = proxy;
            if (filterNewsStatus.value != 'all') {
                const filterStatus = ["transaction_type", "=", filterNewsStatus.value];
                me.$ms.commonFn.concatFilter(param, filterStatus);
            }
            param.Columns = `${param.Columns},icon`;
        };

        return {
            api,
            layoutTag,
            storeModule,
            subSystemCode,
            formDetailName,
            transaction_type,
            filterNewsStatus,
            isLoadActiveColumn,
            fileAPI,
            handleFilterStatus,
            customParamLoadData,
        };
    },
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/listStyle" as style;
</style>