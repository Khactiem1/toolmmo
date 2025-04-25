<template>
  <ms-dynamic-popup :width="800" :height="550" :title="`${editMode ? $ms.commonFn.getEnumResource(editMode, 'FormState') : ''
    } ${$t('i18nSupportList.Title')}`" @beforeOpen="beforeOpen">
    <template v-slot:content="{ close }">
      <div ref="slot-content" class="form-content-popup">
        <div class="form-container mt-4">
          <div class="form-detail flex-center">
            <div class="form-item">
              <div class="form-item_input">
                <div class="form-group ms-big">
                  <ms-input :maxLength="100" :rules="[{ name: 'required' },]"
                    :label="$t('i18nSupportList.Detail.support_list_name')"
                    v-model="model.support_list_name"></ms-input>
                </div>
              </div>
              <div class="form-item_input">
                <div class="form-group">
                  <ms-textarea :maxLength="200" :label="$t('i18nSupportList.Detail.description')"
                    v-model="model.description">
                  </ms-textarea>
                </div>
              </div>
              <div class="form-item_input">
                <div class="form-group">
                  <ms-combobox-tree-v2
                    :label="$t('i18nSupportList.Detail.parent')" 
                    :data="comboBoxDataRemote.support_list"
                    displayField="support_list_name"
                    valueField="support_list_id"
                    idProperty="support_list_id"
                    v-model="model.parent_id"
                  ></ms-combobox-tree-v2>
                </div>
              </div>
              <div class="form-item_input">
                <div class="form-group ms-small">
                  <ms-number :label="$t('i18nSupportList.Detail.sort')" v-model="model.sort"></ms-number>
                </div>
                <div class="form-group ms-big">
                  <ms-input :maxLength="50" :label="$t('i18nSupportList.Detail.icon')" v-model="model.icon"></ms-input>
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
import useModuleSupportList from "@/stores/bus/moduleSupportList";
import supportListAPI from "@/apis/bus/supportListAPI";
import BaseDetail from "@/views/base/BaseDetail";
import MsComboboxTreeV2 from "@/components/comboboxTree/MsComboboxTreeV2.vue";

export default defineComponent({
  mixins: [],
  components: {
    MsComboboxTreeV2,
  },
  extends: BaseDetail,
  setup() {
    const { proxy }: any = getCurrentInstance(); // Instance của component
    const storeModule: any = useModuleSupportList(); // Cấu hình store
    const api = ref(supportListAPI); // Cấu hình api
    const subSystemCode = ref("support_list"); // Cấu hình phân quyền
    const comboBoxDataRemote = reactive({
      support_list: [],
    });

    /**
     * Load support_list về để chọn cha con
     */
    const loadSupportListParent = async () => {
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
      const result = await supportListAPI.getList(payload);
      me.$ms.commonFn.unmask();
      if (result?.Success && result?.Data?.PageData?.length) {
        if (me.editMode == me.$ms.constant.FormState.Add) {
          comboBoxDataRemote.support_list = result.Data.PageData;
        } else {
          comboBoxDataRemote.support_list = me.$ms.commonFn.deleteHierarchyTree(
            result.Data.PageData,
            "parent_id",
            "support_list_id",
            me._formParam.dataRow.support_list_id
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
      await loadSupportListParent();
      await me.super("beforeBindData", BaseDetail);
    };

    return {
      api,
      storeModule,
      subSystemCode,
      comboBoxDataRemote,
      beforeBindData,
    };
  },
});
</script>

<style lang="scss" scoped>
.form-item {
  width: 100%;
}
</style>