<template>
  <ms-dynamic-popup
    :width="700" 
    :height="450"
    :title="`${
      editMode ? $ms.commonFn.getEnumResource(editMode, 'FormState') : ''
    } ${$t('i18nDepartment.Title')}`"
    @beforeOpen="beforeOpen"
  >
    <template v-slot:content="{ close }">
      <div ref="slot-content" class="form-content-popup">
        <div class="form-container mt-4">
          <div class="form-detail flex-center">
            <div class="form-item">
              <div class="form-item_input">
                <div class="form-group ms-small">
                  <ms-input
                    :maxLength="30"
                    :rules="[{ name: 'required' }, ]"
                    :label="$t('i18nDepartment.Detail.department_code')"
                    v-model="model.department_code"
                  ></ms-input>
                </div>
                <div class="form-group ms-big">
                  <ms-input
                    :maxLength="150"
                    :rules="[{ name: 'required' }, ]"
                    :label="$t('i18nDepartment.Detail.department_name')"
                    v-model="model.department_name"
                  ></ms-input>
                </div>
              </div>
              <div class="form-item_input">
                <div class="form-group">
                  <ms-combobox-tree-v2
                    :label="$t('i18nDepartment.Detail.parent')"
                    :data="comboBoxDataRemote.department_code"
                    displayField="department_name"
                    valueField="department_id"
                    idProperty="department_id"
                    v-model="model.parent_id"
                    :columns="[
                      {
                        title: $t('i18nDepartment.Detail.department_code'),
                        dataField: 'department_code',
                        width: 260,
                      },
                      {
                        title: $t('i18nDepartment.Detail.department_name'),
                        dataField: 'department_name',
                        width: null,
                      },
					          ]"
                  ></ms-combobox-tree-v2>
                </div>
              </div>
              <div class="form-item_input">
                <div class="form-group">
                  <ms-combobox-v2
                    :label="$t('i18nDepartment.Detail.manager')"
                    valueField="user_id"
                    displayField="user_full_name"
                    :data="comboBoxDataRemote.user"
                    :initText="model.user_full_name"
                    @comboboxLoadData="(payload) => comboboxLoadData(payload, userAPI, comboBoxDataRemote, 'user')"
                    @selected="selectedUserList"
                    :buildFilter="filterInactive"
                    :dropdownWidth="730"
                    :columns="[
                      { title: $t('i18nUser.Detail.user_name'), dataField: 'user_name', width: 160, filterOperator: $ms.constant.FilterOperator.Contains, },
                      { title: $t('i18nUser.Detail.user_full_name'), dataField: 'user_full_name', width: 200, filterOperator: $ms.constant.FilterOperator.Contains, },
                      { title: $t('i18nUser.Detail.phone_number'), dataField: 'phone_number', width: 140, filterOperator: $ms.constant.FilterOperator.Contains, },
                      { title: $t('i18nUser.Detail.email'), dataField: 'email', width: 220, filterOperator: $ms.constant.FilterOperator.Contains, },
                    ]"
                    queryMode="remote"
                    :remoteFilter="true"
                    v-model="model.manager"
                    v-model:display="model.user_full_name"
                  ></ms-combobox-v2>
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
import useModuleDepartment from "@/stores/bus/moduleDepartment";
import departmentAPI from "@/apis/bus/departmentAPI";
import userAPI from "@/apis/sys/userAPI";
import BaseDetail from "@/views/base/BaseDetail";
import MsComboboxTreeV2 from "@/components/comboboxTree/MsComboboxTreeV2.vue";
import { useRemoteCombobox } from '@/setup/remoteCombobox';

export default defineComponent({
  mixins: [],
  components: {
    MsComboboxTreeV2,
  },
  extends: BaseDetail,
  setup() {
    const { proxy }: any = getCurrentInstance(); // Instance của component
    const storeModule: any = useModuleDepartment(); // Cấu hình store
    const api = ref(departmentAPI); // Cấu hình api
    const subSystemCode = ref("department"); // Cấu hình phân quyền
    const comboBoxDataRemote = reactive({
      department_code: [],
      user: [],
    });
    const { comboboxLoadData } = useRemoteCombobox();

    /**
     * Load Department về để chọn cha con
     */
    const loadDepartmentParent = async () => {
      const me: any = proxy;
      const payload = {
        PageIndex: 0,
        PageSize: 0,
        Columns: "*",
        Filter: "",
        Sort: "",
        CustomParam: {},
      };
      me.$ms.commonFn.mask();
      const result = await departmentAPI.getList(payload);
      me.$ms.commonFn.unmask();
      if (result?.Success && result?.Data?.PageData?.length) {
        if (me.editMode == me.$ms.constant.FormState.Add) {
          comboBoxDataRemote.department_code = result.Data.PageData;
        } else {
          comboBoxDataRemote.department_code = me.$ms.commonFn.deleteHierarchyTree(
            result.Data.PageData,
            "parent_id",
            "department_id",
            me._formParam.dataRow.department_id
          );
        }
      }
    };

    /**
     * Xử lý dữ liệu trước khi binding
     * @override
     */
    const beforeBindData = async () => {
      const me: any = proxy;
      await loadDepartmentParent();
      await me.super("beforeBindData", BaseDetail);
    };

    /**
     * Custom build filter combobox user
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
     * Xử lý chọn user combobox
     */
    const selectedUserList = (metaData) => {
      const me: any = proxy;
      me.model.user_name = metaData.newData ? metaData.newData.user_name : null;
      me.model.user_full_name = metaData.newData ? metaData.newData.user_full_name : null;
    };

    return {
      api,
      userAPI,
      storeModule,
      subSystemCode,
      comboBoxDataRemote,
      filterInactive,
      beforeBindData,
      comboboxLoadData,
      selectedUserList,
    };
  },
});
</script>

<style lang="scss" scoped>
.form-item {
  width: 100%;
}
</style>
