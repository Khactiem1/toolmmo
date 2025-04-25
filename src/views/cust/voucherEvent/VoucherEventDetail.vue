<template>
    <ms-dynamic-popup :width="800" :height="500" :title="`${editMode ? $ms.commonFn.getEnumResource(editMode, 'FormState') : ''
        } ${$t('i18nVoucherEvent.Title')}`" @beforeOpen="beforeOpen">
        <template v-slot:content="{ close }">
            <div ref="slot-content" class="form-content-popup">
                <div class="form-container mt-4">
                    <div class="form-item_input">
                        <div class="form-group">
                            <ms-input :maxLength="100" :rules="[{ name: 'required' }]"
                                :label="$t('i18nVoucherEvent.Detail.voucher_event_name')"
                                v-model="model.voucher_event_name"></ms-input>
                        </div>
                        <div class="form-group">
                            <ms-input :maxLength="30" :rules="[{ name: 'required' }]"
                                :label="$t('i18nVoucherEvent.Detail.voucher_event_code')"
                                v-model="model.voucher_event_code"></ms-input>
                        </div>
                    </div>
                    <div class="form-item_input">
                        <div class="form-group">
                            <ms-datepicker class="mt-3" :label="$t('i18nVoucherEvent.Detail.start_date')"
                                :format="'DD/MM/YYYY HH:mm'" v-model="model.start_date">
                            </ms-datepicker>
                            <ms-number class="mt-3" :max="100" :label="$t('i18nVoucherEvent.Detail.discount_percent')"
                                :infoCustom="'%'" v-model="model.discount_percent"></ms-number>
                            <ms-number class="mt-3" :label="$t('i18nVoucherEvent.Detail.amount_used')"
                                v-model="model.amount_used"></ms-number>
                        </div>
                        <div class="form-group">
                            <ms-datepicker class="mt-3" :label="$t('i18nVoucherEvent.Detail.end_date')"
                                :format="'DD/MM/YYYY HH:mm'" v-model="model.end_date">
                            </ms-datepicker>
                            <ms-number class="mt-3" :label="$t('i18nVoucherEvent.Detail.discount_value')"
                                :infoCustom="'đ'" v-model="model.discount_value"></ms-number>
                            <div class="switch">
                                <label class="select-title"> {{ $t("i18nVoucherEvent.Detail.hide_voucher")
                                    }}</label>
                                <ms-switch v-model="model.hide_voucher" />
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
import { defineComponent, getCurrentInstance, ref } from "vue";
import useModuleVoucherEvent from "@/stores/cust/moduleVoucherEvent";
import voucherEventAPI from "@/apis/cust/voucherEventAPI";
import BaseDetail from "@/views/base/BaseDetail";
import { showError } from "@/commons/globalMessage";

export default defineComponent({
    mixins: [],
    extends: BaseDetail,
    setup() {
        const { proxy }: any = getCurrentInstance(); // Instance của component
        const storeModule: any = useModuleVoucherEvent(); // Cấu hình store
        const api = ref(voucherEventAPI); // Cấu hình api
        const subSystemCode = ref("customer_voucher_events"); // Cấu hình phân quyền
        const validateSaveCustom = (model) => {
            const me: any = proxy;

            if (model.start_date >= model.end_date) {
                showError(me.$t('i18nValidate.messages.start_date'));
                return false;
            }
            return true;
        }

        return {
            api,
            storeModule,
            subSystemCode,
            validateSaveCustom
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

.switch {
    margin-top: 12px;
}
</style>