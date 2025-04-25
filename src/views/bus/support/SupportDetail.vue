<template>
    <ms-dynamic-popup :width="stylePopup.width" :height="stylePopup.height" :title="`${editMode ? $ms.commonFn.getEnumResource(editMode, 'FormState') : ''
        } ${$t('i18nSupport.Title')}`" @beforeOpen="beforeOpen">
        <template v-slot:content="{ close }">
            <div ref="slot-content" class="form-content-popup">
                <div class="form-container pd-t-4">
                    <div class="form-detail">
                        <div class="form-group">
                            <ms-input :maxLength="250" :rules="[{ name: 'required' },]"
                                :label="$t('i18nSupport.Detail.support_name')" v-model="model.support_name"></ms-input>
                        </div>
                        <div class="form-group">
                            <ms-number :label="$t('i18nSupport.Detail.sort')" v-model="model.sort"></ms-number>
                        </div>
                        <div class="form-group" style="padding-left: 0;">
                            <ms-combobox-tree-v2
                                :label="$t('i18nSupport.Detail.support_list_name')"
                                :data="comboBoxDataRemote.support_list"
                                v-model="model.support_list_id"
                                v-model:display="model.support_list_name"
                                :initText="model.support_list_name"
                                displayField="support_list_name"
                                valueField="support_list_id"
                                idProperty="support_list_id"
                                :isAsyncBeforeExpand="true"
                                @beforeExpand="beforeExpandSupportList"
                            ></ms-combobox-tree-v2>
                        </div>
                    </div>
                    <div class="form-detail form-group">
                        <ms-froala 
                            :label="$t('i18nSupport.Detail.content')"
                            v-model="model.content"
                            :pathMedia="`/support/content/${model.support_id}`"
                        />
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
import useModuleSupport from "@/stores/bus/moduleSupport";
import supportAPI from "@/apis/bus/supportAPI";
import BaseDetail from "@/views/base/BaseDetail";
import MsFroala from '@/components/froala/MsFroala.vue';
import MsComboboxTreeV2 from '@/components/comboboxTree/MsComboboxTreeV2.vue';
import supportListAPI from "@/apis/bus/supportListAPI";

export default defineComponent({
    mixins: [],
    components: {
        MsComboboxTreeV2,
        MsFroala,
    },
    extends: BaseDetail,
    setup() {
        const { proxy }: any = getCurrentInstance(); // Instance của component
        const storeModule: any = useModuleSupport(); // Cấu hình store
        const api = ref(supportAPI); // Cấu hình api
        const subSystemCode = ref("support_center"); // Cấu hình phân quyền
        const stylePopup = {
            width: Math.round(window.innerWidth * 0.8),
            height: Math.round(window.innerHeight * 0.8),
        }
        const comboBoxDataRemote = reactive({
            support_list: [],
        });

        /**
         * Load dữ liệu combobox tree
         */
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
            const result = await supportListAPI.getList(payload);
            instance.loading = false;
            if (result?.Success && result?.Data?.PageData) {
                comboBoxDataRemote.support_list = result.Data.PageData;
            }
		};

        /**
         * Sau khi bind data thì gán id để thêm sửa xoá editor lưu ảnh theo thư mục id
         */
        const afterBindData = () => {
            const me = proxy;
            if (me.editMode == me.$ms.constant.FormState.Add){
                me.model.support_id = me.$ms.commonFn.generateUUID();
            }
        };

        return {
            api,
            stylePopup,
            storeModule,
            subSystemCode,
            comboBoxDataRemote,
            beforeExpandSupportList,
            afterBindData,
        };
    },
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/detailStyle" as style;
</style>