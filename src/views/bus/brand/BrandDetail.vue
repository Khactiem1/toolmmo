<template>
    <ms-dynamic-popup :width="600" :min-height="900" :title="`${editMode ? $ms.commonFn.getEnumResource(editMode, 'FormState') : ''
        } ${$t('i18nBrand.Title')}`" @beforeOpen="beforeOpen">
        <template v-slot:content="{ close }">
            <div ref="slot-content" class="form-content-popup">
                <div class="form-container mt-4">
                    <div class="form-detail flex-center">
                        <div class="form-item">
                            <div class="form-item_input">
                                <div class="form-group ms-big">
                                    <ms-input :rules="[{ name: 'required' }]" :maxLength="100"
                                        :label="$t('i18nBrand.Detail.brand_name')"
                                        v-model="model.brand_name"></ms-input>
                                </div>
                            </div>
                            <div class="form-item_input">
                                <div class="form-group ms-big">
                                    <ms-input :maxLength="250" :label="$t('i18nBrand.Detail.description')"
                                        v-model="model.description"></ms-input>
                                </div>
                            </div>
                            <div class="form-item_input">
                                <div class="form-group ms-big">
                                    <ms-input :maxLength="250" :label="$t('i18nBrand.Detail.link')"
                                        v-model="model.link"></ms-input>
                                </div>
                            </div>
                            <div class="form-group custom">
                                <div class="select-image">
                                    <label class="select-title">{{ $t("i18nBrand.Detail.icon") }}</label>
                                    <ms-file-image v-model="model.icon" :path="'/brand/icon'"></ms-file-image>

                                </div>
                                <div class="switch">
                                    <label class="select-title"> {{ $t("i18nBrand.Detail.featured")
                                        }}</label>
                                    <ms-switch v-model="model.featured" />
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
import { defineComponent, getCurrentInstance, ref } from "vue";
import useModuleBrand from "@/stores/bus/moduleBrand";
import brandAPI from "@/apis/bus/brandAPI";
import BaseDetail from "@/views/base/BaseDetail";
import MsFileImage from "@/components/file/MsFileImage.vue";

export default defineComponent({
    components: {
        MsFileImage,
    },
    mixins: [],
    extends: BaseDetail,
    setup() {
        const { proxy }: any = getCurrentInstance(); // Instance của component
        const storeModule: any = useModuleBrand(); // Cấu hình store
        const api = ref(brandAPI); // Cấu hình api
        const subSystemCode = ref("brand"); // Cấu hình phân quyền

        return {
            api,
            storeModule,
            subSystemCode,
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

.custom {
    display: flex;
    gap: 100px;
}
</style>