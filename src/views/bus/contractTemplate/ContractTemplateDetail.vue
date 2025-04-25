<template>
    <ms-dynamic-popup :width="700" :height="550" :title="`${editMode ? $ms.commonFn.getEnumResource(editMode, 'FormState') : ''
        } ${$t('i18nContractTemplate.Title')}`" @beforeOpen="beforeOpen">
        <template v-slot:content="{ close }">
            <div ref="slot-content" class="form-content-popup">
                <div class="form-container mt-4">
                    <div class="form-detail flex-center">
                        <div class="form-item">
                            <div>
                                <div class="form-item_input">
                                    <div class="form-group">
                                        <ms-input :maxLength="100" :rules="[{ name: 'required' },]"
                                            :label="$t('i18nContractTemplate.Detail.contract_template_name')"
                                            v-model="model.contract_template_name"></ms-input>
                                    </div>
                                    <div class="form-group">
                                        <ms-input :maxLength="30"
                                            :label="$t('i18nContractTemplate.Detail.contract_template_code')"
                                            v-model="model.contract_template_code"></ms-input>
                                    </div>
                                </div>
                                <div class="form-item_input">
                                    <div class="form-group">
                                        <ms-combobox-v2 :label="$t('i18nContractTemplate.Detail.signer')"
                                            valueField="user_id" displayField="user_full_name" :data="dataCombobox.user"
                                            :initText="model.user_full_name"
                                            @comboboxLoadData="(payload) => comboboxLoadData(payload, userAPI, dataCombobox, 'user')"
                                            :buildFilter="filterInactive" queryMode="remote" :remoteFilter="true"
                                            v-model="model.signer" v-model:display="model.user_full_name">
                                        </ms-combobox-v2>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <ms-input :maxLength="250" :label="$t('i18nContractTemplate.Detail.decription')"
                                        v-model="model.decription"></ms-input>
                                </div>
                                <div class="form-group">
                                    <ms-file-upload :allowExt="['dotx']" v-model="model.file_url"
                                        :disabled="false" :path="'/contract_template/file_url'" :multiple="false">
                                    </ms-file-upload>
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
import useModuleContractTemplate from "@/stores/bus/moduleContractTemplate";
import contractTemplateAPI from "@/apis/bus/contractTemplateAPI";
import BaseDetail from "@/views/base/BaseDetail";
import { useRemoteCombobox } from "@/setup/remoteCombobox";
import userAPI from "@/apis/sys/userAPI";
import MsFileUpload from "@/components/input/MsFileUpload.vue";

export default defineComponent({
    mixins: [],
    extends: BaseDetail,
    components: {
        MsFileUpload,
    },
    setup() {
        const { proxy }: any = getCurrentInstance(); // Instance của component
        const storeModule: any = useModuleContractTemplate(); // Cấu hình store
        const api = ref(contractTemplateAPI); // Cấu hình api
        const subSystemCode = ref("contract_template"); // Cấu hình phân quyền
        const { comboboxLoadData } = useRemoteCombobox();

        const dataCombobox = reactive({
            user: [],
        });
        const filterInactive = (payload) => {
            const me: any = proxy;
            if (me.editMode == me.$ms.constant.FormState.Add) {
                const filterIsActive = ["is_active", "=", true];
                me.$ms.commonFn.concatFilter(payload, filterIsActive);
            }
        };
        return {
            api,
            storeModule,
            subSystemCode,
            dataCombobox,
            userAPI,
            comboboxLoadData,
            filterInactive,
        };
    },
});
</script>

<style lang="scss" scoped>
.form-item {
    width: 100%;
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
</style>