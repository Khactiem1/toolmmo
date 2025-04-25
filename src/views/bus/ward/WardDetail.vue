<template>
    <ms-dynamic-popup :width="800" :height="400" :title="`${editMode ? $ms.commonFn.getEnumResource(editMode, 'FormState') : ''
        } ${$t('i18nWard.Title')}`" @beforeOpen="beforeOpen">
        <template v-slot:content="{ close }">
            <div ref="slot-content" class="form-content-popup">
                <div class="form-container pd-t-4">
                    <div class="form-detail">
                        <div class="form-group">
                            <ms-input :rules="[{ name: 'required' }]" :maxLength="100"
                                :label="$t('i18nWard.Detail.ward_name')" v-model="model.ward_name">
                            </ms-input>
                        </div>
                        <div class="form-item_input">
                            <div class="form-group ms-small">
                                <ms-input :rules="[{ name: 'required' }]" :maxLength="10"
                                    :label="$t('i18nWard.Detail.ward_code')" v-model="model.ward_code">
                                </ms-input>
                            </div>
                            <div class="form-group ms-big">
                                <ms-combobox-v2 :label="$t('i18nWard.Detail.district_name')"
                                    valueField="district_code" displayField="district_name"
                                    :data="dataCombobox.district" :initText="model.district_name"
                                    @comboboxLoadData="(payload) => comboboxLoadData(payload, districtAPI, dataCombobox, 'district')"
                                    :buildFilter="filterInactive" queryMode="remote" :remoteFilter="true"
                                    v-model="model.district_code" v-model:display="model.district_name">
                                </ms-combobox-v2>
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
import useModuleWard from "@/stores/bus/moduleWard";
import wardAPI from "@/apis/bus/wardAPI";
import districtAPI from "@/apis/bus/districtAPI";
import BaseDetail from "@/views/base/BaseDetail";
import { useRemoteCombobox } from '@/setup/remoteCombobox';


export default defineComponent({
    mixins: [],
    extends: BaseDetail,
    setup() {
        const { proxy }: any = getCurrentInstance(); // Instance của component
        const storeModule: any = useModuleWard(); // Cấu hình store
        const api = ref(wardAPI); // Cấu hình api
        const subSystemCode = ref("ward"); // Cấu hình phân quyền
        const { comboboxLoadData } = useRemoteCombobox();

        const dataCombobox = reactive({
            district: [],
        });
        const filterInactive = (payload) => {
            const me: any = proxy;
            if (me.editMode == me.$ms.constant.FormState.Add) {
                const filterIsActive = ["is_active", "=", true];
                me.$ms.commonFn.concatFilter(payload, filterIsActive);
            }
        };
        return {
            api,
            storeModule,
            subSystemCode,
            dataCombobox,
            districtAPI,
            comboboxLoadData,
            filterInactive
        };
    },
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/detailStyle" as style;
</style>