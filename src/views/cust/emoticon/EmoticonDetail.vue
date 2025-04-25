<template>
    <ms-dynamic-popup :width="500" :height="600" :title="`${editMode ? $ms.commonFn.getEnumResource(editMode, 'FormState') : ''
        } ${$t('i18nEmoticon.Title')}`" @beforeOpen="beforeOpen">
        <template v-slot:content="{ close }">
            <div ref="slot-content" class="form-content-popup">
                <div class="form-container mt-4">
                    <div class="form-detail flex-center">
                        <div class="form-item">
                            <div>
                                <div class="form-group">
                                    <ms-input :maxLength="50" :rules="[{ name: 'required' },]"
                                        :label="$t('i18nEmoticon.Detail.emoticon_code')"
                                        v-model="model.emoticon_code"></ms-input>
                                </div>
                                <div class="form-group">
                                    <ms-combobox-v2 :label="$t('i18nEmoticon.Detail.emoticon_type')"
                                        valueField="dictionary_value" displayField="dictionary_name"
                                        :data="dataCombobox.dictionary" :initText="model.dictionary_name"
                                        @comboboxLoadData="(payload) => comboboxLoadData(payload, dictionaryAPI, dataCombobox, 'dictionary')"
                                        :buildFilter="filterNewType" queryMode="remote" :remoteFilter="true"
                                        v-model="model.emoticon_type" v-model:display="model.dictionary_name">
                                    </ms-combobox-v2>
                                </div>
                                <div class="form-group">
                                    <ms-number :label="$t('i18nEmoticon.Detail.sort')" v-model="model.sort"></ms-number>
                                </div>
                            </div>
                            <div class="select-image">
                                <label class="select-title">{{ $t("i18nEmoticon.Detail.icon") }}</label>
                                <ms-file-image v-model="model.icon" :path="'/lists/service'"></ms-file-image>
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
import useModuleEmoticon from "@/stores/cust/moduleEmoticon";
import emoticonAPI from "@/apis/cust/emoticonAPI";
import BaseDetail from "@/views/base/BaseDetail";
import MsFileImage from "@/components/file/MsFileImage.vue";
import { useRemoteCombobox } from "@/setup/remoteCombobox";
import dictionaryAPI from "@/apis/sys/dictionaryAPI";

export default defineComponent({
    mixins: [],
    components: {
        MsFileImage,
    },
    extends: BaseDetail,
    setup() {
        const { proxy }: any = getCurrentInstance(); // Instance của component
        const storeModule: any = useModuleEmoticon(); // Cấu hình store
        const api = ref(emoticonAPI); // Cấu hình api
        const subSystemCode = ref("emoticon"); // Cấu hình phân quyền
        const { comboboxLoadData } = useRemoteCombobox();

        const dataCombobox = reactive({
            dictionary: [],
        });
        const filterNewType = (payload) => {
            const me: any = proxy;
            const filterNewsType = ["dictionary_list_code", "=", "LoaiEmoticon"]; // fix cứng lọc theo ChucNang trong danh mục từ điển của a Sang
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