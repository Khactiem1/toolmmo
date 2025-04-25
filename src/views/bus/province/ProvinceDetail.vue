<template>
    <ms-dynamic-popup :width="600" :min-height="420" :title="`${editMode ? $ms.commonFn.getEnumResource(editMode, 'FormState') : ''
        } ${$t('i18nProvince.Title')}`" @beforeOpen="beforeOpen">
        <template v-slot:content="{ close }">
            <div ref="slot-content" class="form-content-popup">
                <div class="form-container mt-4">
                    <div class="form-detail flex-center">
                        <div class="form-item">
                            <div class="form-item_input">
                                <div class="form-group ms-big">
                                    <ms-input :rules="[{ name: 'required' },]" :maxLength="100"
                                        :label="$t('i18nProvince.Detail.province_name')"
                                        v-model="model.province_name"></ms-input>
                                </div>
                            </div>
                            <div class="form-item_input">
                                <div class="form-group ms-big">
                                    <ms-input :rules="[{ name: 'required' },]" :maxLength="10"
                                        :label="$t('i18nProvince.Detail.province_code')"
                                        v-model="model.province_code"></ms-input>
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
import useModuleProvince from "@/stores/bus/moduleProvince";
import provinceAPI from "@/apis/bus/provinceAPI";
import BaseDetail from "@/views/base/BaseDetail";

export default defineComponent({
    mixins: [],
    extends: BaseDetail,
    setup() {
        const { proxy }: any = getCurrentInstance(); // Instance của component
        const storeModule: any = useModuleProvince(); // Cấu hình store
        const api = ref(provinceAPI); // Cấu hình api
        const subSystemCode = ref("province"); // Cấu hình phân quyền

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
</style>