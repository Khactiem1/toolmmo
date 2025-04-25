<template>
    <ms-dynamic-popup :width="800" :height="600" :title="`${editMode ? $ms.commonFn.getEnumResource(editMode, 'FormState') : ''
        } ${$t('i18nProductGroup.Title')}`" @beforeOpen="beforeOpen">
        <template v-slot:content="{ close }">
            <div ref="slot-content" class="form-content-popup">
                <div class="form-container mt-4">
                    <div class="form-detail flex-center">
                        <div class="form-item">
                            <div class="form-item_input">
                                <div class="form-group ms-big">
                                    <ms-input :maxLength="150" :rules="[{ name: 'required' },]"
                                        :label="$t('i18nProductGroup.Detail.product_group_name')"
                                        v-model="model.product_group_name"></ms-input>
                                </div>
                            </div>
                            <div class="form-item_input">
                                <div class="form-group">
                                    <ms-combobox-tree-v2 :label="$t('i18nProductGroup.Detail.category_name')"
                                        :data="comboBoxDataRemote.category" v-model="model.category_id"
                                        v-model:display="model.category_name" :initText="model.category_name"
                                        displayField="category_name" valueField="category_id" idProperty="category_id"
                                        :isAsyncBeforeExpand="true"
                                        @beforeExpand="beforeExpandSupportList"></ms-combobox-tree-v2>
                                </div>
                            </div>
                            <div class="form-item_input">
                                <div class="form-group">
                                    <ms-combobox-v2 :label="$t('i18nProductGroup.Detail.supplier_name')"
                                        valueField="supplier_id" displayField="supplier_name"
                                        :data="comboBoxDataRemote.supplier" :initText="model.supplier_name"
                                        @comboboxLoadData="(payload) => comboboxLoadData(payload, supplierAPI, comboBoxDataRemote, 'supplier')"
                                        :buildFilter="filterInactive" queryMode="remote" :remoteFilter="true"
                                        v-model="model.supplier_id" v-model:display="model.supplier_name">
                                    </ms-combobox-v2>
                                </div>
                            </div>
                            <div class="form-item_input">
                                <div class="form-group">
                                    <ms-number :label="$t('i18nProductGroup.Detail.sort')"
                                        v-model="model.sort"></ms-number>
                                </div>
                            </div>
                            <div class="form-item_input">
                                <div class="form-group">
                                    <ms-input :maxLength="250" :label="$t('i18nProductGroup.Detail.description')"
                                        v-model="model.description"></ms-input>
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
import { defineComponent, getCurrentInstance, ref, reactive } from "vue";
import useModuleProductGroup from "@/stores/cust/moduleProductGroup";
import productGroupAPI from "@/apis/cust/productGroupAPI";
import categoryAPI from "@/apis/bus/categoryAPI";
import BaseDetail from "@/views/base/BaseDetail";
import MsFileImage from "@/components/file/MsFileImage.vue";
import MsComboboxTreeV2 from "@/components/comboboxTree/MsComboboxTreeV2.vue";
import supplierAPI from "@/apis/cust/supplierAPI";
import { useRemoteCombobox } from "@/setup/remoteCombobox";


export default defineComponent({
    mixins: [],
    components: {
        MsFileImage,
        MsComboboxTreeV2,
    },
    extends: BaseDetail,
    setup() {
        const { proxy }: any = getCurrentInstance(); // Instance của component
        const storeModule: any = useModuleProductGroup(); // Cấu hình store
        const api = ref(productGroupAPI); // Cấu hình api
        const subSystemCode = ref("product_group"); // Cấu hình phân quyền
        const { comboboxLoadData } = useRemoteCombobox();
        const comboBoxDataRemote = reactive({
            category: [],
            supplier: [],
        });

        const filterInactive = (payload) => {
            const me: any = proxy;
            if (me.editMode == me.$ms.constant.FormState.Add) {
                const filterIsActive = ["is_active", "=", true];
                me.$ms.commonFn.concatFilter(payload, filterIsActive);
            }
        };

        const beforeExpandSupportList = async (funcInCombobox: any, instance: any = {}) => {
            const me = proxy;
            //Nếu đã load rồi thì không load nữa, gọi luôn hàm trong combobox
            funcInCombobox();
            if (me.loadedDataSupportList) {
                return;
            }
            me.loadedDataSupportList = true;
            const payload = {
                PageIndex: 0,
                PageSize: 0,
                Columns: "*",
                Filter: "",
                Sort: "",
                CustomParam: {},
            };
            instance.loading = true;
            const result = await categoryAPI.getList(payload);
            instance.loading = false;
            if (result?.Success && result?.Data?.PageData) {
                comboBoxDataRemote.category = result.Data.PageData;
            }
        };

        return {
            api,
            storeModule,
            subSystemCode,
            comboBoxDataRemote,
            supplierAPI,
            beforeExpandSupportList,
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