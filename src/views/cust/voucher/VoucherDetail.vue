<template>
    <ms-dynamic-popup :width="800" :height="550" :title="`${editMode ? $ms.commonFn.getEnumResource(editMode, 'FormState') : ''
        } ${$t('i18nVoucher.Title')}`" @beforeOpen="beforeOpen">
        <template v-slot:content="{ close }">
            <div ref="slot-content" class="form-content-popup">
                <div class="form-container mt-4">
                    <div class="form-item_input">
                        <div class="form-group">
                            <ms-input :maxLength="100" :rules="[{ name: 'required' }]"
                                :label="$t('i18nVoucher.Detail.voucher_name')" v-model="model.voucher_name"></ms-input>
                        </div>
                        <div class="form-group">
                            <ms-input :maxLength="30" :rules="[{ name: 'required' }]"
                                :label="$t('i18nVoucher.Detail.voucher_code')" v-model="model.voucher_code"></ms-input>
                        </div>
                    </div>
                    <div class="form-item_input">
                        <div class="form-group">
                            <ms-combobox-v2 :label="$t('i18nVoucher.Detail.customer_name')" valueField="customer_id"
                                displayField="customer_name" :data="dataCombobox.customer"
                                :initText="model.customer_name"
                                @comboboxLoadData="(payload) => comboboxLoadData(payload, customerAPI, dataCombobox, 'customer')"
                                @selected="selectedUserList" :buildFilter="filterInactive" queryMode="remote"
                                :remoteFilter="true" v-model="model.customer_id" v-model:display="model.customer_name"
                                :dropdownWidth="730" :columns="[
                                    { title: $t('i18nVoucher.Detail.customer_name'), dataField: 'customer_name', width: 200, filterOperator: $ms.constant.FilterOperator.Contains, },
                                    { title: $t('i18nVoucher.Detail.phone'), dataField: 'phone', width: 150, filterOperator: $ms.constant.FilterOperator.Contains, },
                                ]">
                            </ms-combobox-v2>
                        </div>
                    </div>
                    <div class="form-item_input">
                        <div class="form-group">
                            <ms-combobox-v2 :label="$t('i18nVoucher.Detail.voucher_event_name')"
                                valueField="voucher_event_id" displayField="voucher_event_name"
                                :data="dataCombobox.voucherEvent" :initText="model.voucher_event_name"
                                @comboboxLoadData="(payload) => comboboxLoadData(payload, voucherEventAPI, dataCombobox, 'voucherEvent')"
                                :buildFilter="filterInactive" queryMode="remote" :remoteFilter="true"
                                v-model="model.voucher_event_id" v-model:display="model.voucher_event_name">
                            </ms-combobox-v2>
                            <ms-number class="mt-3" :max="100" :label="$t('i18nVoucher.Detail.discount_percent')"
                                :infoCustom="'%'" v-model="model.discount_percent"></ms-number>

                        </div>
                        <div class="form-group">
                            <ms-datepicker :label="$t('i18nVoucher.Detail.expire_date')" v-model="model.expire_date">
                            </ms-datepicker>
                            <ms-number class="mt-3" :label="$t('i18nVoucher.Detail.discount_value')" :infoCustom="'đ'"
                                v-model="model.discount_value"></ms-number>
                        </div>
                    </div>
                    <div class="form-item_input">
                        <div class="form-group">
                            <ms-input :label="$t('i18nVoucher.Detail.description')"
                                v-model="model.description"></ms-input>
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
import useModuleVoucher from "@/stores/cust/moduleVoucher";
import voucherAPI from "@/apis/cust/voucherAPI";
import voucherEventAPI from "@/apis/cust/voucherEventAPI";
import customerAPI from "@/apis/cust/customerAPI";
import BaseDetail from "@/views/base/BaseDetail";
import { useRemoteCombobox } from "@/setup/remoteCombobox";

export default defineComponent({
    mixins: [],
    extends: BaseDetail,
    setup() {
        const { proxy }: any = getCurrentInstance(); // Instance của component
        const storeModule: any = useModuleVoucher(); // Cấu hình store
        const api = ref(voucherAPI); // Cấu hình api
        const subSystemCode = ref("customer_voucher"); // Cấu hình phân quyền
        const { comboboxLoadData } = useRemoteCombobox();

        const dataCombobox = reactive({
            voucherEvent: [],
            customer: []
        });

        const filterInactive = (payload) => {
            const me: any = proxy;
            if (me.editMode == me.$ms.constant.FormState.Add) {
                const filterIsActive = ["is_active", "=", true];
                me.$ms.commonFn.concatFilter(payload, filterIsActive);
            }
        };
        const selectedUserList = (metaData) => {
            const me: any = proxy;
            me.model.customer_name = metaData.newData ? metaData.newData.customer_name : null;
            me.model.phone = metaData.newData ? metaData.newData.phone : null;
        };
        return {
            api,
            storeModule,
            subSystemCode,
            dataCombobox,
            voucherEventAPI,
            customerAPI,
            comboboxLoadData,
            filterInactive,
            selectedUserList
        };
    },
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/detailStyle" as style;

.form-group {
    padding-left: 0 !important;
}

.form-item_input {
    gap: 16px;
}
</style>