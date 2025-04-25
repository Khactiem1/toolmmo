<template>
  <ms-dynamic-popup :width="800" :height="600" :title="`${editMode ? $ms.commonFn.getEnumResource(editMode, 'FormState') : ''
    } ${$t('i18nCategory.Title')}`" @beforeOpen="beforeOpen">
    <template v-slot:content="{ close }">
      <div ref="slot-content" class="form-content-popup">
        <div class="form-container mt-4">
          <div class="form-detail flex-center">
            <div class="form-item">
              <div class="form-item_input">
                <div class="form-group ms-big">
                  <ms-input :maxLength="100" :rules="[{ name: 'required' },]"
                    :label="$t('i18nCategory.Detail.category_name')" v-model="model.category_name"></ms-input>
                </div>
              </div>
              <div class="form-item_input">
                <div class="form-group">
                  <ms-combobox-tree-v2 :label="$t('i18nCategory.Detail.parent')" :data="comboBoxDataRemote.category"
                    displayField="category_name" valueField="category_id" idProperty="category_id"
                    v-model="model.parent_id"></ms-combobox-tree-v2>
                </div>
              </div>
              <div class="form-item_input">
                <div class="form-group">
                  <ms-number :disabled="editMode == $ms.constant.FormState.Edit"
                    :label="$t('i18nCategory.Detail.quantity')" v-model="model.quantity"></ms-number>
                </div>
                <div class="form-group">
                  <ms-number :label="$t('i18nCategory.Detail.sort')" v-model="model.sort"></ms-number>
                </div>
              </div>
              <div class="select-image">
                <label class="select-title">{{ $t("i18nCategory.Detail.icon") }}</label>
                <ms-file-image v-model="model.icon" :path="'/category/icon'"></ms-file-image>
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
import useModuleCategory from "@/stores/bus/moduleCategory";
import categoryAPI from "@/apis/bus/categoryAPI";
import BaseDetail from "@/views/base/BaseDetail";
import MsFileImage from "@/components/file/MsFileImage.vue";
import MsComboboxTreeV2 from "@/components/comboboxTree/MsComboboxTreeV2.vue";

export default defineComponent({
  mixins: [],
  components: {
    MsFileImage,
    MsComboboxTreeV2,
  },
  extends: BaseDetail,
  setup() {
    const { proxy }: any = getCurrentInstance(); // Instance của component
    const storeModule: any = useModuleCategory(); // Cấu hình store
    const api = ref(categoryAPI); // Cấu hình api
    const subSystemCode = ref("category"); // Cấu hình phân quyền
    const comboBoxDataRemote = reactive({
      category: [],
    });

    /**
     * Load category về để chọn cha con
     */
    const loadCatgoryParent = async () => {
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
      const result = await categoryAPI.getList(payload);
      me.$ms.commonFn.unmask();
      if (result?.Success && result?.Data?.PageData?.length) {
        if (me.editMode == me.$ms.constant.FormState.Add) {
          comboBoxDataRemote.category = result.Data.PageData;
        } else {
          comboBoxDataRemote.category = me.$ms.commonFn.deleteHierarchyTree(
            result.Data.PageData,
            "parent_id",
            "category_id",
            me._formParam.dataRow.category_id
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
      await loadCatgoryParent();
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