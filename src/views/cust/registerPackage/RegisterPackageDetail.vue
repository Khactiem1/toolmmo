<template>
    <ms-dynamic-popup :width="850" :height="400" :title="`${editMode ? $ms.commonFn.getEnumResource(editMode, 'FormState') : ''
        } ${$t('i18nRegisterPackage.Title')}`" @beforeOpen="beforeOpen">
        <template v-slot:content="{ close }">
            <div ref="slot-content" class="form-content-popup">
                <div class="form-container mt-4">
                    <div class="form-detail">
                        <div class="form-item_input">
                            <div class="form-group">
                                <ms-input :disabled="true" :label="$t('i18nRegisterPackage.Detail.supplier_name')"
                                    v-model="model.supplier_name"></ms-input>
                            </div>
                            <div class="form-group">
                                <ms-input :disabled="true"
                                    :label="$t('i18nRegisterPackage.Detail.membership_plan_name')"
                                    v-model="model.membership_plan_name"></ms-input>
                            </div>
                        </div>
                        <div class="form-item_input">
                            <div class="form-group">
                                <ms-combobox-v2 :label="$t('i18nRegisterPackage.Detail.order_status')"
                                    valueField="dictionary_value" displayField="dictionary_name"
                                    :data="dataCombobox.dictionary" :initText="model.dictionary_name"
                                    @comboboxLoadData="(payload) => comboboxLoadData(payload, dictionaryAPI, dataCombobox, 'dictionary')"
                                    :buildFilter="filterNewType" queryMode="remote" :remoteFilter="true"
                                    v-model="model.order_status" v-model:display="model.dictionary_name">
                                </ms-combobox-v2>
                            </div>
                            <div class="form-group">
                                <ms-number :disabled="true" :label="$t('i18nRegisterPackage.Detail.amount')"
                                    v-model="model.amount"></ms-number>
                            </div>
                        </div>
                        <div class="form-item_input">
                            <div class="form-group">
                                <ms-datepicker :label="$t('i18nRegisterPackage.Detail.old_expire')"
                                    v-model="model.old_expire">
                                </ms-datepicker>
                            </div>
                            <div class="form-group">
                                <ms-datepicker :label="$t('i18nRegisterPackage.Detail.new_expire')"
                                    v-model="model.new_expire">
                                </ms-datepicker>
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
import useModuleRegisterPackage from "@/stores/cust/moduleRegisterPackage";
import registerPackageAPI from "@/apis/cust/registerPackageAPI";
import BaseDetail from "@/views/base/BaseDetail";
import { useRemoteCombobox } from "@/setup/remoteCombobox";
import dictionaryAPI from "@/apis/sys/dictionaryAPI";

export default defineComponent({
    mixins: [],
    extends: BaseDetail,
    setup() {
        const { proxy }: any = getCurrentInstance(); // Instance của component
        const storeModule: any = useModuleRegisterPackage(); // Cấu hình store
        const api = ref(registerPackageAPI); // Cấu hình api
        const subSystemCode = ref("register_package"); // Cấu hình phân quyền
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