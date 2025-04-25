<template>
    <ms-dynamic-popup :width="800" :height="550" :title="`${editMode ? $ms.commonFn.getEnumResource(editMode, 'FormState') : ''
        } ${$t('i18nMemberType.Title')}`" @beforeOpen="beforeOpen">
        <template v-slot:content="{ close }">
            <div ref="slot-content" class="form-content-popup">
                <div class="form-container mt-4">
                    <div class="form-detail flex-center">
                        <div class="form-item">
                            <div class="form-item_input">
                                <div class="form-group">
                                    <ms-input :maxLength="100" :rules="[{ name: 'required' },]"
                                        :label="$t('i18nMemberType.Detail.member_type_name')"
                                        v-model="model.member_type_name"></ms-input>
                                </div>
                                <div class="form-group">
                                    <ms-input :maxLength="30" :rules="[{ name: 'required' },]"
                                        :label="$t('i18nMemberType.Detail.member_type_code')"
                                        v-model="model.member_type_code"></ms-input>
                                </div>
                            </div>
                            <div class="form-item_input">
                                <div class="form-group">
                                    <ms-number :label="$t('i18nMemberType.Detail.point')"
                                        v-model="model.point"></ms-number>
                                </div>
                                <div class="form-group">
                                    <ms-number :label="$t('i18nMemberType.Detail.sort')"
                                        v-model="model.sort"></ms-number>
                                </div>
                            </div>
                            <div class="select-image">
                                <label class="select-title">{{ $t("i18nMemberType.Detail.icon") }}</label>
                                <ms-file-image v-model="model.icon" :path="'/member_type/icon'"></ms-file-image>
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
import useModuleMemberType from "@/stores/cust/moduleMemberType";
import memberTypeAPI from "@/apis/cust/memberTypeAPI";
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
        const storeModule: any = useModuleMemberType(); // Cấu hình store
        const api = ref(memberTypeAPI); // Cấu hình api
        const subSystemCode = ref("member_type"); // Cấu hình phân quyền

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
</style>