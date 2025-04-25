<template>
    <ms-dynamic-popup :width="1000" :height="600" :title="`${editMode ? $ms.commonFn.getEnumResource(editMode, 'FormState') : ''
        } ${$t('i18nFooter.Title')}`" @beforeOpen="beforeOpen">
        <template v-slot:content="{ close }">
            <div ref="slot-content" class="form-content-popup">
                <div class="form-container mt-4">
                    <div class="form-detail">
                        <div class="flex form-group">
                            <div class="form-item_input">
                                <ms-input :maxLength="250" :rules="[{ name: 'required' },]"
                                    :label="$t('i18nFooter.Detail.footer_name')" v-model="model.footer_name"></ms-input>
                            </div>
                            <div class="form-item_input">
                                <ms-input :maxLength="30" :rules="[{ name: 'required' },]"
                                :label="$t('i18nFooter.Detail.footer_code')" v-model="model.footer_code"></ms-input>
                            </div>
                        </div> 
                        <div class="flex form-group"> 
                            <ms-input :maxLength="255"
                            :label="$t('i18nFooter.Detail.url')" v-model="model.url"></ms-input>
                        </div>
                        <div class="flex form-group"> 
                            <ms-textarea :maxLength="255"
                                :label="$t('i18nFooter.Detail.description')" v-model="model.description"></ms-textarea>
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
import useModuleFooter from "@/stores/bus/moduleFooter";
import footerAPI from "@/apis/bus/footerAPI";
import BaseDetail from "@/views/base/BaseDetail";
import MsFileImage from "@/components/file/MsFileImage.vue";

export default defineComponent({
    mixins: [],
    components: {
        MsFileImage,
    },
    extends: BaseDetail,
    setup() {
        const { proxy }: any = getCurrentInstance(); // Instance của component
        const storeModule: any = useModuleFooter(); // Cấu hình store
        const api = ref(footerAPI); // Cấu hình api
        const subSystemCode = ref("footer"); // Cấu hình phân quyền
        const comboBoxDataRemote = reactive({
            role_code: [],
        });

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
        };
    },
});
</script>

<style lang="scss" scoped>
.select-image {
    .select-title {
        font-family: "notosans-semibold";
        margin-bottom: 8px;
        font-size: 12px;
        white-space: nowrap;
        display: block;
    }
}

.form-item_input {
    width: 50%;

    &:last-child {
        padding-left: 12px;
    }
}

:deep(.data-input) {
    width: 100%;
}

.form-detail {
    padding-bottom: 0;
}
</style>