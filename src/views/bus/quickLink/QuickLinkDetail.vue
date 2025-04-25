<template>
  <ms-dynamic-popup :width="700" :height="450" :title="`${editMode ? $ms.commonFn.getEnumResource(editMode, 'FormState') : ''
    } ${$t('i18nQuickLink.Title')}`" @beforeOpen="beforeOpen">
    <template v-slot:content="{ close }">
      <div ref="slot-content" class="form-content-popup">
        <div class="form-container mt-4">
          <div class="form-detail flex-center">
            <div class="form-item">
              <div class="form-item_input">
                <div class="form-group ms-big">
                  <ms-input 
                    :maxLength="100" 
                    :rules="[{ name: 'required' },]"
                    :label="$t('i18nQuickLink.Detail.quick_link_name')"
                    v-model="model.quick_link_name"
                  >
                  </ms-input>
                </div>
              </div>
              <div class="form-item_input">
                <div class="form-group">
                  <ms-combobox-tree-v2
                    :label="$t('i18nQuickLink.Detail.parent')" 
                    :data="comboBoxDataRemote.quickLink_list"
                    displayField="quick_link_name"
                    valueField="quick_link_id"
                    idProperty="quick_link_id"
                    v-model="model.parent_id"
                  ></ms-combobox-tree-v2>
                </div>
              </div>
              <div class="form-item_input">
                <div class="form-group ms-small">
                  <ms-number :label="$t('i18nQuickLink.Detail.sort')" v-model="model.sort"></ms-number>
                </div>
                <div class="form-group ms-big">
                  <ms-input :maxLength="255" :label="$t('i18nQuickLink.Detail.url')" v-model="model.url"></ms-input>
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
import useModuleQuickLink from "@/stores/bus/moduleQuickLink";
import quickLinkAPI from "@/apis/bus/quickLinkAPI";
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
    const storeModule: any = useModuleQuickLink(); // Cấu hình store
    const api = ref(quickLinkAPI); // Cấu hình api
    const subSystemCode = ref("quick_link"); // Cấu hình phân quyền
    const comboBoxDataRemote = reactive({
      quickLink_list: [],
    });

    /**
     * Load quickLink_list về để chọn cha con
     */
    const loadQuickLinkListParent = async () => {
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
      const result = await quickLinkAPI.getList(payload);
      me.$ms.commonFn.unmask();
      if (result?.Success && result?.Data?.PageData?.length) {
        if (me.editMode == me.$ms.constant.FormState.Add) {
          comboBoxDataRemote.quickLink_list = result.Data.PageData;
        } else {
          comboBoxDataRemote.quickLink_list = me.$ms.commonFn.deleteHierarchyTree(
            result.Data.PageData,
            "parent_id",
            "quick_link_id",
            me._formParam.dataRow.quick_link_id
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
      await loadQuickLinkListParent();
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