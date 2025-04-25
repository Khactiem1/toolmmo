<template>
    <ms-dynamic-popup :width="900" :height="550" :title="`${editMode ? $ms.commonFn.getEnumResource(editMode, 'FormState') : ''
        } ${$t('i18nFunctionConfig.Title')}`" @beforeOpen="beforeOpen">
        <template v-slot:content="{ close }">
            <div ref="slot-content" class="form-content-popup">
                <div class="form-container pd-t-4">
                    <div class="form-detail">
                        <div class="form-group">
                            <ms-input :rules="[{ name: 'required' }]" :maxLength="150"
                                :label="$t('i18nFunctionConfig.Detail.function_config_name')"
                                v-model="model.function_config_name">
                            </ms-input>
                        </div>
                        <div class="form-item_input">
                            <div class="form-group">
                                <ms-input :rules="[{ name: 'required' }]" :maxLength="30"
                                    :label="$t('i18nFunctionConfig.Detail.function_config_code')"
                                    v-model="model.function_config_code">
                                </ms-input>
                            </div>
                            <div class="form-group">
                                <ms-combobox-v2 :label="$t('i18nFunctionConfig.Detail.function')"
                                    valueField="dictionary_value" displayField="dictionary_name"
                                    :data="dataCombobox.dictionary" :initText="model.dictionary_name"
                                    @comboboxLoadData="(payload) => comboboxLoadData(payload, dictionaryAPI, dataCombobox, 'dictionary')"
                                    :buildFilter="filterNewType" queryMode="remote" :remoteFilter="true"
                                    v-model="model.function" v-model:display="model.dictionary_name">
                                </ms-combobox-v2>
                            </div>
                        </div>
                        <div class="form-group">
                            <ms-input :maxLength="30" :label="$t('i18nFunctionConfig.Detail.value01')"
                                v-model="model.value01">
                            </ms-input>
                        </div>
                        <div class="form-group">
                            <ms-input :maxLength="50" :label="$t('i18nFunctionConfig.Detail.value02')"
                                v-model="model.value02">
                            </ms-input>
                        </div>
                        <div class="form-group">
                            <ms-froala
                                :label="$t('i18nFunctionConfig.Detail.value03')"
                                v-model="model.value03"
                                :pathMedia="`/function_config/value03/${model.function_config_id}`"
                            />
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
import useModuleFunctionConfig from "@/stores/sys/moduleFunctionConfig";
import functionConfigAPI from "@/apis/sys/functionConfigAPI";
import dictionaryAPI from "@/apis/sys/dictionaryAPI";
import BaseDetail from "@/views/base/BaseDetail";
import { useRemoteCombobox } from '@/setup/remoteCombobox';
import MsFroala from '@/components/froala/MsFroala.vue';

export default defineComponent({
    mixins: [],
    components: {
        MsFroala,
    },
    extends: BaseDetail,
    setup() {
        const { proxy }: any = getCurrentInstance(); // Instance của component
        const storeModule: any = useModuleFunctionConfig(); // Cấu hình store
        const api = ref(functionConfigAPI); // Cấu hình api
        const subSystemCode = ref("function_config"); // Cấu hình phân quyền
        const { comboboxLoadData } = useRemoteCombobox();

        const dataCombobox = reactive({
            dictionary: [],
        });
        const filterNewType = (payload) => {
            const me: any = proxy;
            const filterNewsType = ["dictionary_list_code", "=", "ChucNang"]; // fix cứng lọc theo ChucNang trong danh mục từ điển của a Sang
            me.$ms.commonFn.concatFilter(payload, filterNewsType);
        };

        /**
         * Sau khi bind data thì gán id để thêm sửa xoá editor lưu ảnh theo thư mục id
         */
        const afterBindData = () => {
            const me = proxy;
            if (me.editMode == me.$ms.constant.FormState.Add){
                me.model.function_config_id = me.$ms.commonFn.generateUUID();
            }
        };

        return {
            api,
            storeModule,
            subSystemCode,
            dataCombobox,
            dictionaryAPI,
            filterNewType,
            comboboxLoadData,
            afterBindData,
        };
    },
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/detailStyle" as style;
</style>