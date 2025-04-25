<template>
  <ms-dynamic-popup
    :width="1000"
    :height="700"
    :title="`${
      editMode ? $ms.commonFn.getEnumResource(editMode, 'FormState') : ''
    } ${$t('i18nUser.TitleUser')}`"
    @beforeOpen="beforeOpen"
    @shortkeyAction="shortkeyAction"
  >
    <template v-slot:content="{ close }">
      <div ref="slot-content" class="form-content-popup">
        <div class="form-container mt-4">
          <div class="form-detail flex">
            <div class="form-item">
              <div class="form-item_input">
                <div class="form-group ms-small">
                  <ms-input
                    :maxLength="30"
                    :rules="[{ name: 'required' }]"
                    :label="$t('i18nUser.Detail.user_name')"
                    v-model="model.user_name"
                  ></ms-input>
                </div>
                <div class="form-group ms-big">
                  <ms-input
                    :maxLength="150"
                    :rules="[{ name: 'required' }]"
                    :label="$t('i18nUser.Detail.user_full_name')"
                    v-model="model.user_full_name"
                  ></ms-input>
                </div>
              </div>
              <div class="form-item_input">
                <div class="form-group ms-small">
                  <ms-input
                    :maxLength="15"
                    :label="$t('i18nUser.Detail.user_code')"
                    v-model="model.user_code"
                  ></ms-input>
                </div>
                <div class="form-group ms-big">
                  <ms-combobox-v2
                    :label="$t('i18nUser.Detail.manager')"
                    valueField="user_id"
                    displayField="user_full_name"
                    :data="comboBoxDataRemote.user"
                    :initText="model.manager_name"
                    @comboboxLoadData="(payload) => comboboxLoadData(payload, userAPI, comboBoxDataRemote, 'user')"
                    :buildFilter="filterInactive"
                    queryMode="remote"
                    :remoteFilter="true"
                    v-model="model.manager"
                    v-model:display="model.manager_name"
                    :dropdownWidth="730"
                    :columns="[
                      { title: $t('i18nUser.Detail.user_name'), dataField: 'user_name', width: 160, filterOperator: $ms.constant.FilterOperator.Contains, },
                      { title: $t('i18nUser.Detail.user_full_name'), dataField: 'user_full_name', width: 200, filterOperator: $ms.constant.FilterOperator.Contains, },
                      { title: $t('i18nUser.Detail.phone_number'), dataField: 'phone_number', width: 140, filterOperator: $ms.constant.FilterOperator.Contains, },
                      { title: $t('i18nUser.Detail.email'), dataField: 'email', width: 220, filterOperator: $ms.constant.FilterOperator.Contains, },
                    ]"
                  ></ms-combobox-v2>
                </div>
              </div>
              <div class="form-item_input">
                <div class="form-group ms-big">
                  <ms-combobox-tree-v2
                    :label="$t('i18nUser.Detail.department_name')"
                    :data="comboBoxDataRemote.department_code"
                    v-model="model.department_id"
                    v-model:display="model.department_name"
                    :initText="model.department_name"
                    valueField="department_id"
                    displayField="department_name"
                    idProperty="department_id"
                    :isAsyncBeforeExpand="true"
                    @beforeExpand="beforeExpandDepartment"
                    @selected="selectedDepartment"
                    :dropdownWidth="500"
                    :columns="[
                      {
                        title: $t('i18nDepartment.Detail.department_code'),
                        dataField: 'department_code',
                        width: 240,
                      },
                      {
                        title: $t('i18nDepartment.Detail.department_name'),
                        dataField: 'department_name',
                        width: 260,
                      },
                    ]"
                  ></ms-combobox-tree-v2>
                </div>
              </div>
              <div class="form-item_input">
                <div class="form-group ms-small">
                  <ms-input
                    :maxLength="13"
                    :rules="[{ name: 'pattern', compareValue: 'phone' }]"
                    :label="$t('i18nUser.Detail.phone_number')"
                    v-model="model.phone_number"
                  ></ms-input>
                </div>
                <div class="form-group ms-big">
                  <ms-input
                    :maxLength="50"
                    :rules="[{ name: 'pattern', compareValue: 'email' }]"
                    :label="$t('i18nUser.Detail.email')"
                    v-model="model.email"
                  ></ms-input>
                </div>
              </div>
            </div>
            <div class="form-item">
              <div class="form-item_input">
                <div class="form-group ms-small">
                  <ms-datepicker
                    :label="$t('i18nUser.Detail.date_of_birth')"
                    :max="new Date()"
                    v-model="model.date_of_birth"
                  >
                  </ms-datepicker>
                </div>
                <div style="padding-left: 16px" class="form-group ms-big">
                  <label>{{ $t("i18nUser.Detail.gender") }}</label>
                  <div class="ms-radio_item">
                    <ms-radio
                      :label="$t('i18nEnum.Gender.Male')"
                      :value="$ms.constant.Gender.Male"
                      v-model.number="model.gender"
                    ></ms-radio>
                    <ms-radio
                      :label="$t('i18nEnum.Gender.Female')"
                      :value="$ms.constant.Gender.Female"
                      v-model.number="model.gender"
                    ></ms-radio>
                    <ms-radio
                      :label="$t('i18nEnum.Gender.Other')"
                      :value="$ms.constant.Gender.Other"
                      v-model.number="model.gender"
                    ></ms-radio>
                  </div>
                </div>
              </div>
              <div class="form-item_input">
                <div class="form-group ms-small">
                  <ms-datepicker
                    :label="$t('i18nUser.Detail.date_joining')"
                    v-model="model.date_joining"
                  >
                  </ms-datepicker>
                </div>
                <div style="padding-left: 16px" class="form-group ms-big">
                  <ms-combobox-v2
                    :label="$t('i18nUser.Detail.position_name')"
                    valueField="position_id"
                    displayField="position_name"
                    :data="comboBoxDataRemote.position"
                    :initText="model.position_name"
                    @comboboxLoadData="(payload) => comboboxLoadData(payload, positionAPI, comboBoxDataRemote, 'position')"
                    :buildFilter="filterInactive"
                    queryMode="remote"
                    :remoteFilter="true"
                    v-model="model.position_id"
                    v-model:display="model.position_name"
                  ></ms-combobox-v2>
                </div>
              </div>
              <div class="form-item_input">
                <div class="form-group ms-big">
                  <ms-input
                    :maxLength="255"
                    :label="$t('i18nUser.Detail.address')"
                    v-model="model.address"
                  ></ms-input>
                </div>
              </div>
            </div>
          </div>
          <div class="form-detail flex form-select-option">
            <div class="form-item form-detail-role">
              <label class="select-title">{{
                $t("i18nRole.SelectRole")
              }}</label>
              <div
                class="role-item"
                v-for="role in comboBoxDataRemote.role_code"
                :key="role.role_id"
              >
                <ms-checkbox v-model="role.checked">
                  <div class="info-checkbox">
                    <span class="bold">{{ role.role_code }}</span
                    >: {{ role.role_name }}
                  </div>
                </ms-checkbox>
              </div>
            </div>
            <div class="form-item select-image">
              <label class="select-title">{{
                $t("i18nUser.Detail.avartar")
              }} (300px - 300px)</label>
              <ms-file-image
                v-model="model.avartar"
                :path="'/user/avatar'"
              ></ms-file-image>
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
            <ms-button @click="save" class="primary" shortkey-target="Save" :title="'Ctrl + s'">
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
import useModuleUser from "@/stores/sys/moduleUser";
import userAPI from "@/apis/sys/userAPI";
import BaseDetail from "@/views/base/BaseDetail";
import roleAPI from "@/apis/sys/roleAPI";
import MsFileImage from "@/components/file/MsFileImage.vue";
import { useRemoteCombobox } from '@/setup/remoteCombobox';
import positionAPI from "@/apis/bus/positionAPI";
import MsComboboxTreeV2 from '@/components/comboboxTree/MsComboboxTreeV2.vue';
import departmentAPI from "@/apis/bus/departmentAPI";

export default defineComponent({
  mixins: [],
  components: {
    MsFileImage,
    MsComboboxTreeV2,
  },
  extends: BaseDetail,
  setup() {
    const { proxy }: any = getCurrentInstance(); // Instance của component
    const storeModule: any = useModuleUser(); // Cấu hình store
    const api = ref(userAPI); // Cấu hình api
    const subSystemCode = ref("user"); // Cấu hình phân quyền
    const { comboboxLoadData } = useRemoteCombobox();
    const comboBoxDataRemote = reactive({
      role_code: [],
      position: [],
      department_code: [],
      user: [],
    });

    /**
     * Xử lý dữ liệu trước khi binding
     * @override
     */
    const beforeBindData = async () => {
      const me: any = proxy;
      await loadAllRole();
      await me.super("beforeBindData", BaseDetail);
      if (
        me._formParam.dataRow &&
        me.editMode == me.$ms.constant.FormState.Add
      ) {
        me._formParam.dataRow.gender = me.$ms.constant.Gender.Male;
      }
      if (me._formParam.dataRow?.UserJoinRoleDetail?.length) {
        me._formParam.dataRow.UserJoinRoleDetail.forEach((role) => {
          const roleExist = comboBoxDataRemote.role_code.find(
            (_) => _.role_id == role.role_id
          );
          if (roleExist) {
            roleExist.checked = true;
          }
        });
      }
    };

    /**
     * Xử lý dữ liệu trước khi save
     * @override
     */
    const beforeSave = async (model) => {
      const me: any = proxy;
      if (!model.UserJoinRoleDetail) {
        model.UserJoinRoleDetail = [];
      }
      model.UserJoinRoleDetail.forEach((_) => {
        _.State = me.$ms.constant.FormState.Delete;
        _.is_delete_in_database = true;
      });
      comboBoxDataRemote.role_code.forEach((role) => {
        if (role.checked) {
          model.UserJoinRoleDetail.push({
            State: me.$ms.constant.FormState.Add,
            role_id: role.role_id,
          });
        }
      });
    };

    /**
     * Load toàn bộ quyền về
     */
    const loadAllRole = async () => {
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
      const result = await roleAPI.getList(payload);
      me.$ms.commonFn.unmask();
      if (result?.Success && result?.Data?.PageData?.length) {
        comboBoxDataRemote.role_code = result.Data.PageData.sort((a, b) => {
          return b.is_administrator - a.is_administrator;
        });
      }
    };

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
     * Load dữ liệu phòng ban
     */
    const beforeExpandDepartment = async (funcInCombobox: any, instance: any = {}) => {
			const me = proxy;
			//Nếu đã load rồi thì không load nữa, gọi luôn hàm trong combobox
      funcInCombobox();
			if (me.loadedDataDepartment) {
				return;
			}
			me.loadedDataDepartment = true;
			const payload = {
        PageIndex: 0,
        PageSize: 0,
        Columns: "*",
        Filter: "",
        Sort: "",
        CustomParam: {},
      };
			instance.loading = true;
			const result = await departmentAPI.getList(payload);
			instance.loading = false;
			if (result?.Success && result?.Data?.PageData) {
        comboBoxDataRemote.department_code = result.Data.PageData;
      }
		};

    /**
     * Select dữ liệu phòng ban
     */
    const selectedDepartment = (metaData) => {
      const me: any = proxy;
      me.model.department_code = metaData.newData ? metaData.newData.department_code : null;
			me.model.department_name = metaData.newData ? metaData.newData.department_name : null;
    };

    return {
      api,
      storeModule,
      subSystemCode,
      comboBoxDataRemote,
      positionAPI,
      userAPI,
      beforeBindData,
      beforeSave,
      filterInactive,
      selectedDepartment,
      beforeExpandDepartment,
      comboboxLoadData,
    };
  },
});
</script>

<style lang="scss" scoped>
.role-item {
  margin-bottom: 8px;
  padding-left: 12px;
}
.form-select-option {
  max-height: 212px;
  overflow: auto;
}
.form-detail-role,
.select-image {
  .select-title {
    font-family: "notosans-semibold";
    margin-bottom: 8px;
    font-size: 12px;
    white-space: nowrap;
    display: block;
  }
}
.form-detail:first-child {
  padding-bottom: 0;
}
</style>
