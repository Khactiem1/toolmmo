<template>
    <ms-dynamic-popup 
        :width="1200" 
        :height="650" 
        :title="`${editMode ? $ms.commonFn.getEnumResource(editMode, 'FormState') : ''} ${$t('i18nAnoucement.Title')}`" 
        @beforeOpen="beforeOpen"
    >
        <template v-slot:content="{ close }" >
            <div ref="slot-content" class="form-content-popup" >
                <div class="form-container mt-4" >
                    <div class="form-detail" >
                        <div class="flex form-group">
                            <div class="form-item_input">
                                <ms-input :maxLength="250" :rules="[{ name: 'required' },]"
                                    :label="$t('i18nAnoucement.Detail.anoucement_name')"
                                    v-model="model.anoucement_name"></ms-input>
                            </div>

                            <div class="form-item_input">
                                <ms-combobox-v2 
                                    :label="$t('i18nAnoucement.Detail.type')" 
                                    valueField="dictionary_value"
                                    displayField="dictionary_name" 
                                    :data="dataCombobox.dictionary"
                                    :initText="model.type_name"
                                    @comboboxLoadData="(payload) => comboboxLoadData(payload, dictionaryAPI, dataCombobox, 'dictionary')"
                                    @selected="selectedType" 
                                    :buildFilter="filterType"
                                    :rules="[{ name: 'required' }, { name: 'forceSelection' }]" 
                                    queryMode="remote"
                                    :remoteFilter="true" v-model="model.type"
                                    v-model:display="model.type_name"
                                >
                                </ms-combobox-v2>
                            </div>
                        </div>
 

                        <div class="flex form-group">
                            <div class="form-item_input">
                                <ms-combobox-v2
                                    :label="$t('i18nAnoucement.Detail.channel_code')"
                                    valueField="channel_code"
                                    displayField="channel_name"
                                    :data="dataCombobox.list_channel"
                                    :buildFilter="buildFilterComboboxChannel"
                                    :initText="model.channel_name"
                                 	@comboboxLoadData="(payload) => comboboxLoadData(payload, dictionaryListAPI, dataCombobox, 'list_channel', null)"
                                    @selected="selectedChannelList"
                                    :rules="[{ name: 'forceSelection' }]"
                                    queryMode="remote"
                                    :remoteFilter="true"
                                    v-model="model.channel_code"
                                    v-model:display="model.channel_name"
                                ></ms-combobox-v2>
                            </div> 
                            <div class="form-item_input">
                                <ms-datepicker :label="$t('i18nAnoucement.Detail.date_publish')" :maxDate="new Date()"
                                    v-model="model.date_publish">
                                </ms-datepicker>
                                
                                <ms-datepicker class="pl-3" :label="$t('i18nAnoucement.Detail.date_push')" :maxDate="new Date()"
                                    v-model="model.date_push">
                                </ms-datepicker> 
                            </div> 
                            
                        </div>

                        <div class="flex form-group">
                            <ms-textarea :maxLength="250" :rules="[]"
                                :label="$t('i18nAnoucement.Detail.description')"
                                v-model="model.description"></ms-textarea>
                        </div> 

                        <div class="form-detail form-group">
                            <ms-froala
                                :label="$t('i18nAnoucement.Detail.content')"
                                v-model="model.content" 
                                :pathMedia="`/anoucement/content/${model.anoucement_id}`"
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
import useModuleAnoucement from "@/stores/bus/moduleAnoucement";
import anoucementAPI from "@/apis/bus/anoucementAPI";
import BaseDetail from "@/views/base/BaseDetail";
import MsFileImage from "@/components/file/MsFileImage.vue";
import { useRemoteCombobox } from '@/setup/remoteCombobox';
import dictionaryAPI from "@/apis/sys/dictionaryAPI";
import dictionaryListAPI from "@/apis/sys/dictionaryListAPI";     
import MsFroala from '@/components/froala/MsFroala.vue'; 

export default defineComponent({
    mixins: [],
    components: {
        MsFileImage,
        MsFroala
    },
    extends: BaseDetail,
    setup() {
        const { proxy }: any = getCurrentInstance(); // Instance của component
        const storeModule: any = useModuleAnoucement(); // Cấu hình store
        const api = ref(anoucementAPI); // Cấu hình api
        const subSystemCode = ref("anoucement"); // Cấu hình phân quyền

        const dataCombobox = reactive({
            dictionary: [],
            list_channel : []
        });
        const { comboboxLoadData } = useRemoteCombobox();

        const filterInactive = (payload) => {
            const me: any = proxy;
            if (me.editMode == me.$ms.constant.FormState.Add) {
                const filterIsActive = ["is_active", "=", true];
                me.$ms.commonFn.concatFilter(payload, filterIsActive);
            }
        };
        const filterType = (payload) => {
            const me: any = proxy;
            filterInactive(payload);

            const filter = ["dictionary_list_code", "=", "LoaiThongBao"]; // fix cứng lọc theo LoaiTuc trong danh mục từ điển của a Sang
            me.$ms.commonFn.concatFilter(payload, filter);
        };
        
        const buildFilterComboboxChannel = (payload) => {
			const me: any = proxy;
			if(!payload.CustomParam){
				payload.CustomParam = {};
			}
			payload.CustomParam.ViewName = '"SYS".channel';
			payload.CustomParam.columns = 'channel_code,channel_name';
		}
        /**
         * Xử lý chọn danh mục combobox
         */
        const selectedType = (metaData) => {
            const me: any = proxy;
            me.model.type_name = metaData.newData ? metaData.newData.dictionary_name : null;
        };
        
        const selectedChannelList = (metaData) => {
            const me: any = proxy;
            me.model.channel_name = metaData.newData ? metaData.newData.channel_name : null;
        };

        /**
         * Sau khi bind data thì gán id để thêm sửa xoá editor lưu ảnh theo thư mục id
         */
        const afterBindData = () => {
            const me = proxy;
            if (me.editMode == me.$ms.constant.FormState.Add){
                me.model.anoucement_id = me.$ms.commonFn.generateUUID();
            }
        };

        return {
            api,
            storeModule,
            subSystemCode,
            selectedType,
            filterType,
            filterInactive,
            afterBindData,
            comboboxLoadData,
            dataCombobox,
            dictionaryAPI,
            buildFilterComboboxChannel, 
            dictionaryListAPI, 
            selectedChannelList,
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

.modal-content{
    .flex-column{
        overflow-y: scroll !important;
    }
}
 
</style>