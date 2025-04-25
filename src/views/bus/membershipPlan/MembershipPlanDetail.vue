<template>
  <ms-dynamic-popup :width="1200" :height="720" :title="`${editMode ? $ms.commonFn.getEnumResource(editMode, 'FormState') : ''
      } ${$t('i18nMembershipPlan.Title')}`" @beforeOpen="beforeOpen">
      <template v-slot:content="{ close }">
          <div ref="slot-content" class="form-content-popup">
              <div class="form-container mt-4">
                  <div class="form-detail flex">
                      <div class="form-item">
                        <div class="form-group">
                            <ms-input 
                                :maxLength="100" 
                                :rules="[{ name: 'required' },]"
                                :label="$t('i18nMembershipPlan.Detail.membership_plan_name')"
                                v-model="model.membership_plan_name"
                            >
                            </ms-input>
                        </div>
                        <div class="form-group">
                            <ms-input 
                                :maxLength="250" 
                                :label="$t('i18nMembershipPlan.Detail.description')"
                                v-model="model.description"
                            >
                            </ms-input>
                        </div>
                        <div class="form-group">
                            <ms-number 
                                :label="$t('i18nMembershipPlan.Detail.amount')"
                                v-model="model.amount"
                            ></ms-number>
                        </div>
                        <div class="form-group">
                            <ms-number 
                                :label="$t('i18nMembershipPlan.Detail.discount')"
                                v-model="model.discount"
                                :max="100"
                                :infoCustom="'%'"
                            ></ms-number>
                        </div>
                      </div>
                      <div class="form-item">
                        <div class="form-group">
                            <ms-number 
                                :label="$t('i18nMembershipPlan.Detail.sort')"
                                v-model="model.sort"
                            ></ms-number>
                        </div>
                        <div class="form-group">
                            <ms-input 
                                :maxLength="30" 
                                :label="$t('i18nMembershipPlan.Detail.unit')"
                                v-model="model.unit"
                            >
                            </ms-input>
                        </div>
                        <div class="form-group">
                          <div class="select-image">
                              <label class="select-title">{{ $t("i18nMembershipPlan.Detail.icon") }}</label>
                              <ms-file-image v-model="model.icon" :path="'/membership_plan/icon'"></ms-file-image>
                          </div>
                        </div>
                      </div>
                  </div>
              </div>
              <div class="form-detail">
                <ms-grid-editor
                    :ref="viewRef" 
                    :data="model.PackageFeatureDetail" 
                    :idField="'package_feature_detail_id'"
                    :columns="columns"
                    :propsData="propsData"
                    :disabled="editMode === $ms.constant.FormState.View"
                >
                    <template #widget-body="{ record }">
                        <div class="widget-container">
                            <button 
                                @click="deleteRow(record)"
                                class="action-table action-color"
                                :title='$t("i18nEnum.FeatureRow.Delete")'
                            >
                                <i class="fa fa-trash danger-color" aria-hidden="true"></i>
                            </button>
                        </div>
                    </template>
                </ms-grid-editor>
                <div class="action-button">
                    <div class="flex lst-btn gap-8">
                    <ms-button class="primary" :disabled="editMode === $ms.constant.FormState.View" @click="addRow">
                        <i class="fa fa-plus" aria-hidden="true"></i>
                        {{ $t("i18nCommon.crud.add_row") }}
                    </ms-button>
                    <ms-button class="danger" :disabled="editMode === $ms.constant.FormState.View" @click="deleteAllRow">
                        <i class="fa fa-trash" aria-hidden="true"></i>
                        {{ $t("i18nCommon.crud.delete_all_row") }}
                    </ms-button>
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
import { defineComponent, getCurrentInstance, ref, reactive, onBeforeMount } from "vue";
import useModuleMembershipPlan from "@/stores/bus/moduleMembershipPlan";
import membershipPlanAPI from "@/apis/bus/membershipPlanAPI";
import BaseDetail from "@/views/base/BaseDetail";
import MsFileImage from "@/components/file/MsFileImage.vue";
import MsGridEditor from "@/components/msGridEditor/MsGridEditor.vue";
import { showAlert } from '@/commons/globalMessage';
import { useRemoteCombobox } from '@/setup/remoteCombobox';
import featurePackageAPI from "@/apis/bus/featurePackageAPI";

export default defineComponent({
  mixins: [],
  components: {
    MsFileImage,
    MsGridEditor,
  },
  extends: BaseDetail,
  setup() {
    const { proxy }: any = getCurrentInstance(); // Instance của component
    const storeModule: any = useModuleMembershipPlan(); // Cấu hình store
    const api = ref(membershipPlanAPI); // Cấu hình api
    const subSystemCode = ref("membership_plan"); // Cấu hình phân quyền
    const { comboboxLoadData } = useRemoteCombobox();
    const model = reactive({
        PackageFeatureDetail: [],
    });
    const dataCombobox = reactive({
        feature_package_code: [],
    });
    const columns = reactive(
        [
            {
                "lock": false,
                "width": "180",
                "header": "i18nMembershipPlan.Detail.feature_package_code",
                "dataField": "feature_package_code",
                "formatType": 15,
                "editable": true,
                "headerCustom": "",
                "visible": true
            },
            {
                "lock": false,
                "width": "515",
                "header": "i18nMembershipPlan.Detail.feature_package_name",
                "dataField": "feature_package_name",
                "formatType": 12,
                "headerCustom": "",
                "editable": false,
                "visible": true
            },
            {
                "lock": false,
                "width": "120",
                "header": "i18nMembershipPlan.Detail.quantity",
                "dataField": "quantity",
                "formatType": 20,
                "editable": true,
                "headerCustom": "",
                "visible": true
            },
            {
                "lock": false,
                "width": "120",
                "header": "i18nMembershipPlan.Detail.is_available",
                "dataField": "is_available",
                "isShowControl": true,
                "formatType": 13,
                "headerCustom": "",
                "editable": true,
                "visible": true
            },
            {
                "lock": false,
                "width": "120",
                "header": "i18nMembershipPlan.Detail.sort",
                "dataField": "sort",
                "formatType": 20,
                "headerCustom": "",
                "editable": true,
                "visible": true
            },
        ]
    );
    const propsData = reactive({
        feature_package_code: {
            data: dataCombobox,
            columns: [
                { title: proxy.$t('i18nFeaturePackage.Detail.feature_package_code'), dataField: 'feature_package_code', width: 160, filterOperator: proxy.$ms.constant.FilterOperator.Contains },
                { title: proxy.$t('i18nFeaturePackage.Detail.feature_package_name'), dataField: 'feature_package_name', width: 240, filterOperator: proxy.$ms.constant.FilterOperator.Contains },
            ],
            displayField: 'feature_package_code',
            modelDisplayField: 'feature_package_code',
            valueField: 'feature_package_id',
            modelValueField: 'feature_package_id',
            dropdownWidth: 450,
            buildFilter: (payload, col, dataRow) => {},
            selected: (metaData, instanceCombo, col, dataRow) => {},
            comboboxLoadData: (payload, col, dataRow) => {},
            queryMode: 'remote',
            remoteFilter: true,
            rules: [{ name: 'required' }, { name: 'forceSelection' }],
        },
        feature_package_name: {

        },
        quantity: {

        },
        is_available: {

        },
        sort: {

        },
    });

    /**
     * Xử lý onBeforeMount
     */
    onBeforeMount(() => {
        propsData.feature_package_code.buildFilter = buildFilterFeature;
        propsData.feature_package_code.selected = selectedFeature;
        propsData.feature_package_code.comboboxLoadData = comboboxLoadDataFeature;
    });
    const buildFilterFeature = (payload, col, dataRow) => {
        payload.Sort = "sort ASC";
        filterInactive(payload);
    }
    const selectedFeature = (metaData, instanceCombo, col, dataRow) => {
        dataRow.feature_package_code = metaData.newData ? metaData.newData.feature_package_code : null;
        dataRow.feature_package_name = metaData.newData ? metaData.newData.feature_package_name : null;
    }
    const comboboxLoadDataFeature = (payload, col, dataRow) => {
        comboboxLoadData(payload, featurePackageAPI, dataCombobox, 'feature_package_code');
    }

    /**
     * Custom build filter combobox
     * Chỉ load lên những bản ghi đang được active ở mode add, mode edit thì load all
     */
    const filterInactive = (payload) => {
      const me: any = proxy;
      if (me.editMode == me.$ms.constant.FormState.Add) {
        const filterIsActive = ["is_active", "=", true];
        me.$ms.commonFn.concatFilter(payload, filterIsActive);
      }
    };

    /**
     * Xử lý sau khi bind xong data
     * @override
     */
    const afterBindData = async () => {
        const me = proxy;
        if(me.editMode == me.$ms.constant.FormState.Add){
            addRow();
        }
    };

    /**
     * Thêm dòng
     */
    const addRow = () => {
        const me = proxy;
        if(typeof me.$refs[me.viewRef]?.addRow === 'function'){
            me.$refs[me.viewRef].addRow();
        }
    };

    /**
     * Xoá dòng
     */
    const deleteRow = (dataRow) => {
        const me = proxy;
        if(typeof me.$refs[me.viewRef]?.deleteRow === 'function'){
            me.$refs[me.viewRef].deleteRow(dataRow);
        } 
    };

    /**
     * Xoá hết dòng
     */
    const deleteAllRow = async () => {
        const me = proxy;
        const result = await showAlert(me.$t('i18nCommon.AskDeleteRecord'));
        if(result && typeof me.$refs[me.viewRef]?.deleteAllRow === 'function'){
            me.$refs[me.viewRef].deleteAllRow();
        }
    };

    return {
        api,
        model,
        columns,
        propsData,
        storeModule,
        subSystemCode,
        addRow,
        deleteRow,
        deleteAllRow,
        afterBindData,
    };
  },
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/detailStyle" as style;
.form-item {
  width: 100%;
}
.form-detail{
    padding-bottom: 0;
}
:deep(.image-item){
    margin-bottom: 0 !important;
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