<template>
    <ms-dynamic-popup
        :width="1200"
        :height="800"
        :title="$t('i18nWarehouse.Detail.supplier')"
        @beforeOpen="beforeOpen"
    >
        <template v-slot:content="{ close }">
        <div ref="slot-content" class="form-content-popup">
            <div class="form-container">
            <div class="table-function sticky">
                <div class="form-fix">
                <div class="action-left flex">
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
                :gridInfo="gridInfo"
                :showAction="false"
                :multiple="false"
            >
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
import useModuleSupplier from "@/stores/cust/moduleSupplier";
import supplierAPI from "@/apis/cust/supplierAPI";

export default defineComponent({
components: {
    MsGridViewer,
    ListConditionFilter,
},
extends: BaseList,
setup() {
    const { proxy }: any = getCurrentInstance(); // Instance của component
    const storeModule: any = useModuleSupplier(); // Cấu hình store
    const api = ref(supplierAPI); // Cấu hình api

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
        if(me._formParam?.dataRows){
            me.storeModule.items = me._formParam.dataRows;
        }
    };

    /**
     * Layout
     */
    const columns = reactive(
        [
            {
                "lock": false,
                "width": "200",
                "header": "date",
                "dataField": "date",
                "formatType": 12,
                "headerCustom": "date",
                "visible": true
            },
            {
                "lock": false,
                "width": "160",
                "header": "from",
                "dataField": "from",
                "formatType": 12,
                "headerCustom": "from",
                "visible": true
            },
            {
                "lock": false,
                "width": "160",
                "header": "code",
                "dataField": "code",
                "formatType": 12,
                "headerCustom": "code",
                "visible": true
            },
            {
                "lock": false,
                "width": "160",
                "header": "subject",
                "dataField": "subject",
                "formatType": 12,
                "headerCustom": "subject",
                "visible": true
            },
            {
                "lock": false,
                "width": "160",
                "header": "uid",
                "dataField": "uid",
                "formatType": 12,
                "headerCustom": "uid",
                "visible": true
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
        storeModule,
        beforeOpen,
    };
},
});
</script>

<style lang="scss" scoped>
.form-content-popup{
    height: 100%;
}
.form-container{
    padding: 0 16px 0 0;
    height: 100%;
    display: flex;
    flex-direction: column;
}
:deep(.ms-grid-viewer){
    flex: 1;
}
</style>
  