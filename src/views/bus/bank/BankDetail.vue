<template>
    <ms-dynamic-popup :width="1000" :height="600" :title="`${editMode ? $ms.commonFn.getEnumResource(editMode, 'FormState') : ''
        } ${$t('i18nBank.Title')}`" @beforeOpen="beforeOpen">
        <template v-slot:content="{ close }">
            <div ref="slot-content" class="form-content-popup">
                <div class="form-container mt-4">
                    <div class="form-detail"> 
                            <div class="form-item_input">
                                <div class="form-group">
                                    <ms-input :maxLength="100" :rules="[{ name: 'required' },]"
                                        :label="$t('i18nBank.Detail.bank_name')" v-model="model.bank_name"></ms-input>
                                </div> 
                              
                            </div>  
                            <div class="form-item_input">  
                                <div class="form-group">
                                    <ms-input :maxLength="255" :rules="[]"
                                        :label="$t('i18nBank.Detail.bank_code')" v-model="model.bank_code"></ms-input>
                                </div>
                                <div class="form-group">
                                    <ms-combobox-v2 :label="$t('i18nBank.Detail.bank_type')"
                                        valueField="dictionary_value" displayField="dictionary_name"
                                        :data="dataCombobox.dictionary" :initText="model.bank_type_name"
                                        @comboboxLoadData="(payload) => comboboxLoadData(payload, dictionaryAPI, dataCombobox, 'dictionary')"
                                        @selected="selectedBankType" :buildFilter="filterBankType" :dropdownWidth="400"
                                        :rules="[{ name: 'forceSelection' }]" queryMode="remote"
                                        :remoteFilter="true" v-model="model.bank_type"
                                        v-model:display="model.bank_type_name"></ms-combobox-v2>
                                </div> 
                            </div>

                            <div class="form-detail flex form-select-option">
                                <div class="form-item select-image">
                                    <label class="select-title">{{ $t("i18nBank.Detail.logo") }}</label>
                                    <ms-file-image :rules="[{ name: 'required' },]" v-model="model.logo"
                                        :path="'/bank/logo'"></ms-file-image>
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
import useModuleBank from "@/stores/bus/moduleBank";
import bankAPI from "@/apis/bus/bankAPI";
import dictionaryAPI from "@/apis/sys/dictionaryAPI";
import BaseDetail from "@/views/base/BaseDetail";

import MsFileImage from "@/components/file/MsFileImage.vue";
import { useRemoteCombobox } from '@/setup/remoteCombobox';

export default defineComponent({
    mixins: [],
    components: {
        MsFileImage,
    },
    extends: BaseDetail,
    setup() {
        const { proxy }: any = getCurrentInstance(); // Instance của component
        const storeModule: any = useModuleBank(); // Cấu hình store
        const api = ref(bankAPI); // Cấu hình api
        const subSystemCode = ref("bank"); // Cấu hình phân quyền
        const comboBoxDataRemote = reactive({
            role_code: [],
        });
        const dataCombobox = reactive({
            dictionary: [],
        });
        const { comboboxLoadData } = useRemoteCombobox();


        const filterInactive = (payload) => {
            const me: any = proxy;
            if (me.editMode == me.$ms.constant.FormState.Add) {
                const filterIsActive = ["is_active", "=", true];
                me.$ms.commonFn.concatFilter(payload, filterIsActive);
            }
        };
        const filterBankType = (payload) => {
            const me: any = proxy;
            filterInactive(payload);

            const filter = ["dictionary_list_code", "=", "LoaiNganHang"]; // fix cứng lọc theo LoaiTuc trong danh mục từ điển của a Sang
            me.$ms.commonFn.concatFilter(payload, filter);
        };
        /**
         * Xử lý chọn danh mục combobox
         */
        const selectedBankType = (metaData) => {
            const me: any = proxy;
            me.model.bank_type_name = metaData.newData ? metaData.newData.dictionary_name : null;
        };
        /**
         * Xử lý dữ liệu trước khi binding
         * @override
         */
        const beforeBindData = async () => {
            const me: any = proxy;
            await me.super("beforeBindData", BaseDetail);
        };

        return {
            api,
            storeModule,
            subSystemCode,
            comboBoxDataRemote,
            beforeBindData,
            dataCombobox,
            dictionaryAPI,
            comboboxLoadData,
            filterBankType,
            selectedBankType,
        };
    },
});
</script>

<style lang="scss" scoped>
.v-text-field {
    margin-bottom: 16px;
}

.role-item {
    margin-bottom: 8px;
}

.form-select-option {
    max-height: 212px;
    overflow: auto;
}

.form-detail-role,
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
</style>