<template>
    <ms-dynamic-popup :width="1200" :height="700" :title="`${editMode ? $ms.commonFn.getEnumResource(editMode, 'FormState') : ''
        } ${$t('i18nCompanyInfo.Title')}`" @beforeOpen="beforeOpen">
        <template v-slot:content="{ close }">
            <div ref="slot-content" class="form-content-popup">
                <div class="form-container pd-t-4">
                    <div class="form-detail">
                        <div class="form-group">
                            <ms-input :maxLength="250" :rules="[{ name: 'required' },]"
                                :label="$t('i18nCompanyInfo.Detail.company_info_name')"
                                v-model="model.company_info_name">
                            </ms-input>
                        </div>
                        <div class="form-group flex">
                            <div class="form-item_input">
                                <ms-input :maxLength="15" :label="$t('i18nCompanyInfo.Detail.hotline')"
                                    v-model="model.hotline">
                                </ms-input>
                            </div>
                            <div class="form-item_input">
                                <ms-input :maxLength="250" :label="$t('i18nCompanyInfo.Detail.address')"
                                    v-model="model.address">
                                </ms-input>
                            </div>
                        </div>
                        <div class="form-group flex">
                            <div class="form-item_input">
                                <ms-input :maxLength="30" :label="$t('i18nCompanyInfo.Detail.zalo_chat_id')"
                                    v-model="model.zalo_chat_id">
                                </ms-input>
                            </div>
                            <div class="form-item_input">
                                <ms-input :maxLength="30" :label="$t('i18nCompanyInfo.Detail.messenger_id')"
                                    v-model="model.messenger_id">
                                </ms-input>
                            </div>
                        </div>

                        <div class="form-group flex">
                            <div class="form-item_input">
                                <ms-input :maxLength="250" :label="$t('i18nCompanyInfo.Detail.bank_name')"
                                    v-model="model.bank_name">
                                </ms-input>
                            </div>
                            <div class="form-item_input">
                                <ms-input :maxLength="150" :label="$t('i18nCompanyInfo.Detail.bank_account_owner')"
                                    v-model="model.bank_account_owner">
                                </ms-input>
                            </div>
                            <div class="form-item_input">
                                <ms-input :maxLength="30" :label="$t('i18nCompanyInfo.Detail.bank_account')"
                                    v-model="model.bank_account">
                                </ms-input>
                            </div>
                        </div>
                        <div class="form-group flex">
                            <div class="form-item_input">
                                <ms-input :maxLength="150" :label="$t('i18nCompanyInfo.Detail.zalo_wallet_owner')"
                                    v-model="model.zalo_wallet_owner">
                                </ms-input>
                            </div>
                            <div class="form-item_input">
                                <ms-input :maxLength="30" :label="$t('i18nCompanyInfo.Detail.zalo_merchant_id')"
                                    v-model="model.zalo_merchant_id">
                                </ms-input>
                            </div>
                        </div>
                        <div class="form-group flex">
                            <div class="form-item_input">
                                <ms-input :maxLength="150" :label="$t('i18nCompanyInfo.Detail.momo_wallet_owner')"
                                    v-model="model.momo_wallet_owner">
                                </ms-input>
                            </div>
                            <div class="form-item_input">
                                <ms-input :maxLength="30" :label="$t('i18nCompanyInfo.Detail.momo_merchant_id')"
                                    v-model="model.momo_merchant_id">
                                </ms-input>
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
import useModuleCompanyInfo from "@/stores/bus/moduleCompanyInfo";
import companyInfoAPI from "@/apis/bus/companyInfoAPI";
import BaseDetail from "@/views/base/BaseDetail";

export default defineComponent({
    extends: BaseDetail,
    setup() {
        const { proxy }: any = getCurrentInstance(); // Instance của component
        const storeModule: any = useModuleCompanyInfo(); // Cấu hình store
        const api = ref(companyInfoAPI); // Cấu hình api
        const subSystemCode = ref("company_info"); // Cấu hình phân quyền

        return {
            api,
            storeModule,
            subSystemCode,
        };
    },
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/detailStyle" as style;

.form-item_input {
    width: 50%;

    &:nth-child(2),
    &:last-child {
        padding-left: 12px;
    }
}
</style>