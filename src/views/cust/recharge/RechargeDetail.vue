<template>
    <ms-dynamic-popup :width="650" :height="450" :title="`${editMode ? $ms.commonFn.getEnumResource(editMode, 'FormState') : ''
        } ${$t('i18nRecharge.Title')}`" @beforeOpen="beforeOpen">
        <template v-slot:content="{ close }">
            <div ref="slot-content" class="form-content-popup">
                <div class="form-container mt-4">
                    <div class="form-detail">
                        <div class="form-item_input">
                            <div class="form-group">
                                <ms-input :disabled="true" :label="$t('i18nRecharge.Detail.customer_name')"
                                    v-model="model.customer_name"></ms-input>
                            </div>
                            <div class="form-group">
                                <ms-input :disabled="true" :label="$t('i18nRecharge.Detail.payment_method_code')"
                                    v-model="model.payment_method_code"></ms-input>
                            </div>
                        </div>
                        <div class="form-item_input">
                            <div class="form-group">
                                <ms-input :disabled="true" :label="$t('i18nRecharge.Detail.transaction_type')"
                                    v-model="model.transaction_type"></ms-input>
                            </div>
                            <div class="form-group">
                                <ms-number :disabled="true" :label="$t('i18nRecharge.Detail.amount')"
                                    v-model="model.amount"></ms-number>
                            </div>
                        </div>
                        <div class="form-item_input">
                            <div class="form-group flex" style="width: 50%">
                                <ms-combobox-v2 :label="$t('i18nRecharge.Detail.transaction_status')"
                                    valueField="dictionary_value" displayField="dictionary_name"
                                    :data="dataCombobox.dictionary" :initText="model.dictionary_name_status"
                                    @comboboxLoadData="(payload) => comboboxLoadData(payload, dictionaryAPI, dataCombobox, 'dictionary')"
                                    :buildFilter="filterNewType" queryMode="remote" :remoteFilter="true"
                                    v-model="model.transaction_status" v-model:display="model.dictionary_name_status">
                                </ms-combobox-v2>
                            </div>
                        </div>
                        <div class="form-item_input">
                            <div class="form-group">
                                <ms-input :maxLength="100" :label="$t('i18nRecharge.Detail.content')"
                                    v-model="model.content"></ms-input>
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
import { defineComponent, getCurrentInstance, reactive, ref } from "vue";
import useModuleRecharge from "@/stores/cust/moduleRecharge";
import rechargeAPI from "@/apis/cust/rechargeAPI";
import BaseDetail from "@/views/base/BaseDetail";
import { useRemoteCombobox } from "@/setup/remoteCombobox";
import dictionaryAPI from "@/apis/sys/dictionaryAPI";

export default defineComponent({
    mixins: [],
    extends: BaseDetail,
    setup() {
        const { proxy }: any = getCurrentInstance(); // Instance của component
        const storeModule: any = useModuleRecharge(); // Cấu hình store
        const api = ref(rechargeAPI); // Cấu hình api
        const subSystemCode = ref("recharge_refund"); // Cấu hình phân quyền
        const { comboboxLoadData } = useRemoteCombobox();

        const dataCombobox = reactive({
            dictionary: [],
        });
        const filterNewType = (payload) => {
            const me: any = proxy;
            const filterNewsType = ["dictionary_list_code", "=", "TrangThaiChung"]; // fix cứng lọc theo ChucNang trong danh mục từ điển của a Sang
            me.$ms.commonFn.concatFilter(payload, filterNewsType);
        };
        return {
            api,
            storeModule,
            subSystemCode,
            dataCombobox,
            dictionaryAPI,
            comboboxLoadData,
            filterNewType,
        };
    },
});
</script>

<style lang="scss" scoped></style>