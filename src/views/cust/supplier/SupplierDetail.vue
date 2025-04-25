<template>
    <ms-dynamic-popup :width="stylePopup.width" :height="stylePopup.height" :title="`${editMode ? $ms.commonFn.getEnumResource(editMode, 'FormState') : ''
        } ${$t('i18nSupplier.Title')}`" @beforeOpen="beforeOpen">
        <template v-slot:content="{ close }">
            <div ref="slot-content" class="form-content-popup">
                <div class="form-container pd-t-4">
                    <div class="form-detail flex">
                        <div class="form-item">
                            <div class="form-item_input">
                                <div class="form-group">
                                    <ms-input :maxLength="100" :rules="[{ name: 'required' },]"
                                        :label="$t('i18nSupplier.Detail.supplier_name')"
                                        v-model="model.supplier_name"></ms-input>

                                </div>
                            </div>
                            <div class="form-group">
                                <ms-input 
                                    :maxLength="50"
                                    :label="$t('i18nSupplier.Detail.phone')" 
                                    v-model="model.phone"
                                    :rules="[{ name: 'required' }, { name: 'pattern', compareValue: 'phone' }]"
                                ></ms-input>
                            </div>
                            <div class="form-group">
                                <ms-input 
                                    :maxLength="50" 
                                    :label="$t('i18nSupplier.Detail.email')"
                                    v-model="model.email"
                                    :rules="[{ name: 'pattern', compareValue: 'email' }]"
                                ></ms-input>
                            </div>
                            <div class="form-group">
                                <ms-textarea :maxLength="250" :label="$t('i18nSupplier.Detail.address')"
                                    v-model="model.address"></ms-textarea>
                            </div>
                        </div>
                        <div class="form-item">
                            <div class="form-item_input flex">
                                <div class="meta-content" style="flex: 1;">
                                    <div class="form-group">
                                        <ms-input :maxLength="100" :label="$t('i18nSupplier.Detail.representative')"
                                            v-model="model.representative"></ms-input>
                                    </div>
                                    <div class="form-group" style="padding-left: 0;">
                                        <ms-input :maxLength="15" :label="$t('i18nSupplier.Detail.brn')"
                                            v-model="model.brn"></ms-input>
                                    </div>
                                    <div class="form-group" style="padding-left: 0;">
                                        <ms-input :maxLength="15" :label="$t('i18nSupplier.Detail.tax_id')"
                                            v-model="model.tax_id"></ms-input>
                                    </div>
                                    <div style="margin-left: 20px;" class="select-image">
                                        <label class="select-title">{{ $t("i18nSupplier.Detail.logo") }}</label>
                                        <ms-file-image v-model="model.logo" :path="'/supplier/logo'"></ms-file-image>
                                    </div>
                                </div>


                            </div>
                        </div>
                        <div class="form-item">
                            <div class="form-item_input flex">
                                <div class="meta-content" style="flex: 1;">
                                    <div class="form-group">
                                        <ms-input :label="$t('i18nSupplier.Detail.website')"
                                            v-model="model.website"></ms-input>
                                    </div>
                                    <div class="form-group" style="padding-left: 0;">
                                        <ms-number :infoCustom="'đ'" :disabled="true"
                                            :label="$t('i18nSupplier.Detail.balance')"
                                            v-model="model.balance"></ms-number>
                                    </div>
                                    <div class="form-group" style="padding-left: 0;">
                                        <ms-combobox-v2 :label="$t('i18nSupplier.Detail.supplier_type')"
                                            valueField="dictionary_value" displayField="dictionary_name"
                                            :data="dataCombobox.dictionary" :initText="model.supplier_type_name"
                                            @comboboxLoadData="(payload) => comboboxLoadData(payload, dictionaryAPI, dataCombobox, 'dictionary')"
                                            :buildFilter="filterNewType" queryMode="remote"
                                            :remoteFilter="true" v-model="model.supplier_type"
                                            v-model:display="model.supplier_type_name">
                                        </ms-combobox-v2>
                                    </div>
                                    <div style="margin-left: 20px;" class="select-image">
                                        <label class="select-title">{{ $t("i18nSupplier.Detail.brn_image") }}</label>
                                        <ms-file-image v-model="model.brn_image"
                                            :path="'/supplier/brn_image'"></ms-file-image>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-item">
                            <div class="form-item_input flex">
                                <div class="meta-content" style="flex: 1;">
                                    <div class="form-group" style="padding-left: 0;">
                                        <ms-combobox-v2 :label="$t('i18nSupplier.Detail.province_name')"
                                            valueField="province_code" displayField="province_name"
                                            :data="dataCombobox.province" :initText="model.province_name"
                                            @comboboxLoadData="(payload) => comboboxLoadData(payload, provinceAPI, dataCombobox, 'province')"
                                            :buildFilter="filterInactive" queryMode="remote" :remoteFilter="true"
                                            @selected="selectedProvince" v-model="model.province_code"
                                            v-model:display="model.province_name">
                                        </ms-combobox-v2>
                                    </div>
                                    <div class="form-group" style="padding-left: 0;">
                                        <ms-combobox-v2 :label="$t('i18nSupplier.Detail.district_name')"
                                            ref="district_code" valueField="district_code" displayField="district_name"
                                            :data="dataCombobox.district" :initText="model.district_name"
                                            @comboboxLoadData="(payload) => comboboxLoadData(payload, districtAPI, dataCombobox, 'district')"
                                            :buildFilter="filterDistrictByProvince" queryMode="remote"
                                            :remoteFilter="true" @selected="selectedDistrict"
                                            v-model="model.district_code" v-model:display="model.district_name">
                                        </ms-combobox-v2>
                                    </div>
                                    <div class="form-group" style="padding-left: 0;">
                                        <ms-combobox-v2 :label="$t('i18nSupplier.Detail.ward_name')"
                                            valueField="ward_code" displayField="ward_name" ref="ward_code"
                                            :data="dataCombobox.ward" :initText="model.ward_name"
                                            @comboboxLoadData="(payload) => comboboxLoadData(payload, wardAPI, dataCombobox, 'ward')"
                                            :buildFilter="filterWardByDistrict" queryMode="remote" :remoteFilter="true"
                                            v-model="model.ward_code" v-model:display="model.ward_name">
                                        </ms-combobox-v2>
                                    </div>
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
                        <ms-button @click="save" class="mr-2">
                            {{ $t("i18nCommon.crud.save") }}
                        </ms-button>
                        <ms-button
                            v-if="model.approval_status == supplier_status.LuuTam.supplier_status || model.approval_status == supplier_status.TuChoi.supplier_status"
                            @click="saveWithStatus(supplier_status.ChoDuyet)" class="primary">
                            {{ $t('i18nSupplier.Detail.sendApproval') }}
                        </ms-button>
                        <ms-button v-if="model.approval_status == supplier_status.ChoDuyet.supplier_status"
                            @click="saveWithStatus(supplier_status.TuChoi)" class="danger mr-2">
                            {{ $t('i18nSupplier.Detail.reject') }}
                        </ms-button>
                        <ms-button v-if="model.approval_status == supplier_status.ChoDuyet.supplier_status"
                            @click="saveWithStatus(supplier_status.DaDuyet)" class="primary">
                            {{ $t('i18nSupplier.Detail.approved') }}
                        </ms-button>
                    </div>
                </div>
            </div>
        </template>
    </ms-dynamic-popup>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, reactive, ref } from "vue";
import useModuleSupplier from "@/stores/cust/moduleSupplier";
import supplierAPI from "@/apis/cust/supplierAPI";
import BaseDetail from "@/views/base/BaseDetail";
import MsFileImage from "@/components/file/MsFileImage.vue";
import { useRemoteCombobox } from '@/setup/remoteCombobox';
import dictionaryAPI from "@/apis/sys/dictionaryAPI";
import { useSupplierConfig } from "@/views/cust/supplier/supplierConfig"
import districtAPI from "@/apis/bus/districtAPI";
import provinceAPI from "@/apis/bus/provinceAPI";
import wardAPI from "@/apis/bus/wardAPI";

export default defineComponent({
    mixins: [],
    components: {
        MsFileImage,
    },
    extends: BaseDetail,
    setup() {
        const { proxy }: any = getCurrentInstance(); // Instance của component
        const storeModule: any = useModuleSupplier(); // Cấu hình store
        const api = ref(supplierAPI); // Cấu hình api
        const subSystemCode = ref("supplier_info"); // Cấu hình phân quyền
        const hideAfterSave = ref(false); // Có đóng form sau khi save hay ko
        const stylePopup = {
            width: Math.round(window.innerWidth * 0.8),
            height: Math.round(window.innerHeight * 0.8),
        }
        const { comboboxLoadData } = useRemoteCombobox();
        const dataCombobox = reactive({
            dictionary: [],
            district: [],
            province: [],
            ward: [],
        });
        const { supplier_status, loadMappingSupplierStatus } = useSupplierConfig();

        /**
         * Xử lý trước khi bind dữ liệu
         */
        const beforeBindData = async () => {
            const me: any = proxy;
            await loadMappingSupplierStatus();
            if (me.editMode == me.$ms.constant.FormState.Add) {
                // nếu là mode add thì gán approval_status mặc định
                me._formParam.dataRow.approval_status = supplier_status.value.LuuTam.supplier_status;
                me._formParam.dataRow.approval_status_name = supplier_status.value.LuuTam.supplier_status_name;
            }
            await me.super("beforeBindData", BaseDetail);
        };

        /**
         * Xử lý sau khi bind xong data
         * @override
         */
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
         * Custom filter combobobx new type
         */
        const filterNewType = (payload) => {
            const me: any = proxy;
            filterInactive(payload);
            const filterNewsType = ["dictionary_list_code", "=", "LoaiNhaCungCap"]; // fix cứng lọc theo LoaiTuc trong danh mục từ điển của a Sang
            me.$ms.commonFn.concatFilter(payload, filterNewsType);
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
         * Xử lý trước khi save
         */
        const beforeSave = async (model) => {
            if (newsStatusSave.value) {
                model.approval_status = newsStatusSave.value.supplier_status;
                model.approval_status_name = newsStatusSave.value.supplier_status_name;
                model.is_update_approval_status = true;
                newsStatusSave.value = null;
            }
        };

        /**
         * Xử lý sau khi cất thành công
         */
        const afterSaveSuccess = async (resultSave) => {
            const me: any = proxy;
            if (resultSave?.Data) {
                me.model.approval_status = resultSave.Data.approval_status;
                me.model.approval_status_name = resultSave.Data.approval_status_name;
                me.model.is_update_approval_status = false;
            }
        };

        return {
            api,
            stylePopup,
            hideAfterSave,
            supplier_status,
            storeModule,
            subSystemCode,
            dictionaryAPI,
            dataCombobox,
            districtAPI,
            provinceAPI,
            wardAPI,
            beforeSave,
            saveWithStatus,
            filterNewType,
            comboboxLoadData,
            filterInactive,
            beforeBindData,
            afterSaveSuccess,
            filterWardByDistrict,
            filterDistrictByProvince,
            selectedDistrict,
            selectedProvince,
        };
    },
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/detailStyle" as style;

.form-container {
    display: flex;
    flex-direction: column;

    .form-detail:last-child {
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

.form-item {
    &:last-child {
        width: 520px;
    }
}
</style>