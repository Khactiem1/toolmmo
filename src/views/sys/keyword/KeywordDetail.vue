<template>
    <ms-dynamic-popup :width="600" :height="400" :title="`${editMode ? $ms.commonFn.getEnumResource(editMode, 'FormState') : ''
        } ${$t('i18nKeyword.Title')}`" @beforeOpen="beforeOpen">
        <template v-slot:content="{ close }">
            <div ref="slot-content" class="form-content-popup">
                <div class="form-container pd-t-4">
                    <div class="form-detail">
                        <div class="form-group">
                            <ms-input :rules="[{ name: 'required' }]" :maxLength="50"
                                :label="$t('i18nKeyword.Detail.keyword')" v-model="model.keyword">
                            </ms-input>
                        </div>
                        <div class="form-group" style="padding-left: 0;">
                            <ms-combobox-v2 :label="$t('i18nKeyword.Detail.function')" valueField="dictionary_value"
                                displayField="dictionary_name" :data="dataCombobox.dictionary"
                                :initText="model.dictionary_name"
                                @comboboxLoadData="(payload) => comboboxLoadData(payload, dictionaryAPI, dataCombobox, 'dictionary')"
                                :buildFilter="filterNewType" queryMode="remote" :remoteFilter="true"
                                v-model="model.function" v-model:display="model.dictionary_name">
                            </ms-combobox-v2>
                        </div>
                        <div class="form-group">
                            <ms-number style="margin-right: 6px;" class="ms-small"
                                :label="$t('i18nKeyword.Detail.sort')" v-model="model.sort">
                            </ms-number>
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
import useModuleKeyword from "@/stores/sys/moduleKeyword";
import keywordAPI from "@/apis/sys/keywordAPI";
import dictionaryAPI from "@/apis/sys/dictionaryAPI";
import BaseDetail from "@/views/base/BaseDetail";
import { useRemoteCombobox } from '@/setup/remoteCombobox';


export default defineComponent({
    mixins: [],
    extends: BaseDetail,
    setup() {
        const { proxy }: any = getCurrentInstance(); // Instance của component
        const storeModule: any = useModuleKeyword(); // Cấu hình store
        const api = ref(keywordAPI); // Cấu hình api
        const subSystemCode = ref("search_key"); // Cấu hình phân quyền
        const { comboboxLoadData } = useRemoteCombobox();

        const dataCombobox = reactive({
            dictionary: [],
        });
        const filterNewType = (payload) => {
            const me: any = proxy;
            const filterNewsType = ["dictionary_list_code", "=", "ChucNang"]; // fix cứng lọc theo ChucNang trong danh mục từ điển của a Sang
            me.$ms.commonFn.concatFilter(payload, filterNewsType);
        };
        return {
            api,
            storeModule,
            subSystemCode,
            dataCombobox,
            dictionaryAPI,
            filterNewType,
            comboboxLoadData
        };
    },
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/detailStyle" as style;
</style>