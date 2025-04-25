<template>
    <ms-dynamic-popup 
        :width="1000" 
        :height="600" 
        :title="`${editMode ? $ms.commonFn.getEnumResource(editMode, 'FormState') : ''} ${$t('i18nWarehouse.Title')}`" 
        @beforeOpen="beforeOpen"
    >
        <template v-slot:content="{ close }">
            <div ref="slot-content" class="form-content-popup">
                <div class="form-container pd-t-4">
                    <div class="flex">
                        <div class="form-group">
                            <ms-input 
                                :maxLength="250" 
                                :rules="[{ name: 'required' },]"
                                :label="$t('i18nWarehouse.Detail.warehouse_name')"
                                v-model="model.warehouse_name"
                            ></ms-input>
                        </div>
                    </div>
                    <div class="flex gap-8">
                        <div class="form-group">
                            <ms-combobox-v2 
                                :label="$t('i18nWarehouse.Detail.warehouse_type_name')"
                                valueField="dictionary_value" 
                                displayField="dictionary_name"
                                :data="dataCombobox.warehouse_type" 
                                :initText="model.warehouse_type_name"
                                @comboboxLoadData="(payload) => comboboxLoadData(payload, dictionaryAPI, dataCombobox, 'warehouse_type')"
                                :buildFilter="filterWarehouseType" 
                                queryMode="remote" 
                                :remoteFilter="true"
                                v-model="model.warehouse_type"
                                v-model:display="model.warehouse_type_name"
                            >
                            </ms-combobox-v2>
                        </div>
                        <div class="form-group">
                            <ms-combobox-v2 :label="$t('i18nWarehouse.Detail.province_name')"
                                valueField="province_code" displayField="province_name"
                                :data="dataCombobox.province" :initText="model.province_name"
                                @comboboxLoadData="(payload) => comboboxLoadData(payload, provinceAPI, dataCombobox, 'province')"
                                :buildFilter="filterInactive" queryMode="remote" :remoteFilter="true"
                                @selected="selectedProvince" v-model="model.province_code"
                                v-model:display="model.province_name">
                            </ms-combobox-v2>
                        </div>
                    </div>
                    <div class="flex gap-8">
                        <div class="form-group">
                            <ms-combobox-v2 :label="$t('i18nWarehouse.Detail.district_name')"
                                ref="district_code" valueField="district_code" displayField="district_name"
                                :data="dataCombobox.district" :initText="model.district_name"
                                @comboboxLoadData="(payload) => comboboxLoadData(payload, districtAPI, dataCombobox, 'district')"
                                :buildFilter="filterDistrictByProvince" queryMode="remote"
                                :remoteFilter="true" @selected="selectedDistrict"
                                v-model="model.district_code" v-model:display="model.district_name">
                            </ms-combobox-v2>
                        </div>
                        <div class="form-group">
                            <ms-combobox-v2 :label="$t('i18nWarehouse.Detail.ward_name')"
                                valueField="ward_code" displayField="ward_name" ref="ward_code"
                                :data="dataCombobox.ward" :initText="model.ward_name"
                                @comboboxLoadData="(payload) => comboboxLoadData(payload, wardAPI, dataCombobox, 'ward')"
                                :buildFilter="filterWardByDistrict" queryMode="remote" :remoteFilter="true"
                                v-model="model.ward_code" v-model:display="model.ward_name">
                            </ms-combobox-v2>
                        </div>
                    </div>
                    <div class="flex">
                        <div class="form-group">
                            <ms-combobox-v2 
                                :label="$t('i18nWarehouse.Detail.address')"
                                :maxLength="200" 
                                valueField="formatted_address" 
                                displayField="formatted_address"
                                :data="dataCombobox.address" 
                                :initText="model.address"
                                @comboboxLoadData="(payload) => comboboxLoadDataLocation(payload, model, dataCombobox, 'address')"
                                @selected="selectedAddress"
                                queryMode="remote" 
                                :remoteFilter="true"
                                :rules="[]"
                                v-model="model.address"
                                v-model:display="model.address"
                            >
                            </ms-combobox-v2>
                        </div>
                    </div>
                    <div class="flex">
                        <div class="form-group">
                            <ms-combobox-multiple
                                v-if="isShowComboboxSupplier"
                                :label="$t('i18nWarehouse.Detail.supplier')"
                                valueField="supplier_id"
                                displayField="supplier_name"
                                :columns="[
                                    { title: $t('i18nSupplier.Detail.supplier_name'), dataField: 'supplier_name', width: 400, filterOperator: $ms.constant.FilterOperator.Contains, },
                                    { title: $t('i18nSupplier.Detail.email'), dataField: 'email', width: 200, filterOperator: $ms.constant.FilterOperator.Contains, },
                                    { title: $t('i18nSupplier.Detail.phone'), dataField: 'phone', width: 160, filterOperator: $ms.constant.FilterOperator.Contains, },
                                ]"
                                queryMode="remote"
                                autoLoad
                                :buildFilter="buildFilterSupplier"
                                :data="dataCombobox.supplier"
                                v-model="suppliersSelected"
                                @comboboxLoadData="(payload) => comboboxLoadData(payload, supplierAPI, dataCombobox, 'supplier')"
                            >
                            </ms-combobox-multiple>
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
import useModuleWarehouse from "@/stores/cust/moduleWarehouse";
import warehouseAPI from "@/apis/cust/warehouseAPI";
import BaseDetail from "@/views/base/BaseDetail";
import { useRemoteCombobox } from '@/setup/remoteCombobox';
import { useRemoteComboboxLocation } from '@/setup/remoteComboboxLocation';
import districtAPI from "@/apis/bus/districtAPI";
import provinceAPI from "@/apis/bus/provinceAPI";
import dictionaryAPI from "@/apis/sys/dictionaryAPI";
import wardAPI from "@/apis/bus/wardAPI";
import supplierAPI from "@/apis/cust/supplierAPI";
import MsComboboxMultiple from "@/components/comboboxV2/MsComboboxMultiple.vue";

export default defineComponent({
    mixins: [],
    components: {
        MsComboboxMultiple,
    },
    extends: BaseDetail,
    setup() {
        const { proxy }: any = getCurrentInstance(); // Instance của component
        const storeModule: any = useModuleWarehouse(); // Cấu hình store
        const api = ref(warehouseAPI); // Cấu hình api
        const subSystemCode = ref("warehouse"); // Cấu hình phân quyền
        const { comboboxLoadData } = useRemoteCombobox();
        const { comboboxLoadDataLocation } = useRemoteComboboxLocation();
        const dataCombobox = reactive({
            warehouse_type: [],
            district: [],
            province: [],
            ward: [],
            supplier: [],
            address: [],
        });
        const suppliersSelected = ref('');
        const isShowComboboxSupplier = ref(false);

        /**
         * Xử lý dữ liệu trước khi save
         * @override
         */
        const beforeSave = async (model) => {
            const me: any = proxy;
            if(!model.SupplierWarehouse){
                model.SupplierWarehouse = [];
            }
            if (me.editMode == me.$ms.constant.FormState.Edit){
                model.SupplierWarehouse.forEach((_) => {
                    _.State = me.$ms.constant.FormState.Delete;
                    _.is_delete_in_database = true;
                });
            }
            if(suppliersSelected.value){
                const listIDSelected = suppliersSelected.value.split(';');
                listIDSelected.forEach(_ => {
                    model.SupplierWarehouse.push({
                        supplier_id: _,
                        State: me.$ms.constant.FormState.Add,
                    });
                });
            }
        };

        /**
         * Xử lý select địa chỉ gán location
         */
        const selectedAddress = (metaData) => {
            const me = proxy;
            if(typeof metaData === 'object'){
                if(metaData?.newData?.geometry?.location){
                    me.model.google_location = JSON.stringify(metaData.newData.geometry.location);
                }
                else{
                    me.model.google_location = null;
                }
            }
        }

        /**
         * Xử lý dữ liệu trước khi binding
         * @override
         */
        const beforeBindData = async () => {
            const me: any = proxy;
            await me.super("beforeBindData", BaseDetail);
            if (me._formParam.dataRow?.SupplierWarehouse?.length) {
                suppliersSelected.value = me._formParam.dataRow.SupplierWarehouse.map(_ => _.supplier_id).join(';');
            }
            isShowComboboxSupplier.value = true; // sau khi gán suppliersSelected mới load để load cả selected các bản ghi lên đầu 
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
         * Xử lý chọn tỉnh thành
         */
        const selectedProvince = (metaData) => {
            if (proxy.$refs?.district_code && typeof proxy.$refs?.district_code?.doRemoteQuery === 'function') {
                proxy.$refs.district_code.doRemoteQuery('');
            }
        };

        /**
         * Xuử lý chọn quận huyện
         */
        const selectedDistrict = (metaData) => {
            if (proxy.$refs?.ward_code && typeof proxy.$refs?.ward_code?.doRemoteQuery === 'function') {
                proxy.$refs.ward_code.doRemoteQuery('');
            }
        };

        /**
         * load quận huyện theo tỉnh thành
         */
        const filterDistrictByProvince = (payload) => {
            const me: any = proxy;
            filterInactive(payload);
            const filter = ["province_code", "=", me.model?.province_code ? me.model.province_code : ""];
            me.$ms.commonFn.concatFilter(payload, filter);
        }

        /**
         * Load phường xã theo quận huyện
         */
        const filterWardByDistrict = (payload) => {
            const me: any = proxy;
            filterInactive(payload);
            const filter = ["district_code", "=", me.model?.district_code ? me.model.district_code : ""];
            me.$ms.commonFn.concatFilter(payload, filter);
        };

        /**
         * Custom filter combobobx warehouse type
         */
         const filterWarehouseType = (payload) => {
            const me: any = proxy;
            filterInactive(payload);
            const filter = ["dictionary_list_code", "=", "LoaiKho"];
            me.$ms.commonFn.concatFilter(payload, filter);
        };

        /**
         * Build tham số filter nhà cung cấp
         */
        const buildFilterSupplier = (payload) => {
            const me: any = proxy;
            filterInactive(payload);
            const filter = [
                [["is_lock", "=", false], 'or', ["is_lock", "isnull", ""]],
                'and',
                ["parent_id", "isnull", ""],
                'and',
                ["approval_status", "=", "DaDuyet"]
            ];
            me.$ms.commonFn.concatFilter(payload, filter);
        };

        return {
            api,
            storeModule,
            subSystemCode,
            dataCombobox,
            districtAPI,
            provinceAPI,
            wardAPI,
            suppliersSelected,
            dictionaryAPI,
            supplierAPI,
            isShowComboboxSupplier,
            beforeSave,
            selectedAddress,
            beforeBindData,
            buildFilterSupplier,
            comboboxLoadData,
            filterWarehouseType,
            filterInactive,
            filterWardByDistrict,
            filterDistrictByProvince,
            selectedDistrict,
            selectedProvince,
            comboboxLoadDataLocation,
        };
    },
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/detailStyle" as style;
</style>