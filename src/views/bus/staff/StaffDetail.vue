<template>
    <ms-dynamic-popup :width="800" :height="550" :title="`${editMode ? $ms.commonFn.getEnumResource(editMode, 'FormState') : ''
        } ${$t('i18nStaff.Title')}`" @beforeOpen="beforeOpen">
        <template v-slot:content="{ close }">
            <div ref="slot-content" class="form-content-popup">
                <div class="form-container mt-4">
                    <div class="form-detail flex-center">
                        <div class="form-item">
                            <div class="form-item_input">
                                <div class="form-group">
                                    <ms-input :maxLength="100" :rules="[{ name: 'required' },]"
                                        :label="$t('i18nStaff.Detail.staff_name')"
                                        v-model="model.staff_name"></ms-input>
                                </div>

                            </div>
                            <div class="form-item_input">
                                <div class="form-group">
                                    <ms-input :maxLength="500" :label="$t('i18nStaff.Detail.comment')"
                                        v-model="model.comment"></ms-input>
                                </div>
                            </div>
                            <div class="form-item_input">
                                <div class="form-group">
                                    <ms-input :maxLength="500" :label="$t('i18nStaff.Detail.position_name')"
                                        v-model="model.position"></ms-input>
                                </div>
                            </div>
                            <div class="flex">
                                <div class="form-item_input">
                                    <div class="form-group">
                                        <ms-number :label="$t('i18nStaff.Detail.sort')"
                                            v-model="model.sort"></ms-number>
                                    </div>
                                </div>
                                <div class="select-image">
                                    <label class="select-title">{{ $t("i18nStaff.Detail.avatar") }}</label>
                                    <ms-file-image v-model="model.avatar" :path="'/staff/avatar'"></ms-file-image>
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
import useModuleStaff from "@/stores/bus/moduleStaff";
import staffAPI from "@/apis/bus/staffAPI";
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
        const storeModule: any = useModuleStaff(); // Cấu hình store
        const api = ref(staffAPI); // Cấu hình api
        const subSystemCode = ref("staff"); // Cấu hình phân quyền

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
    margin-left: 100px;

    .select-title {
        font-family: "notosans-semibold";
        margin-bottom: 8px;
        font-size: 12px;
        white-space: nowrap;
        display: block;
    }
}
</style>