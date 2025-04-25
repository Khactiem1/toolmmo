<template>
  <ms-dynamic-popup
    :width="800" 
    :height="586"
    :title="`${
      editMode ? $ms.commonFn.getEnumResource(editMode, 'FormState') : ''
    } ${$t('i18nMenuFontend.Title')}`"
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
                    :label="$t('i18nMenuFontend.Detail.menu_code')"
                    v-model="model.menu_code"
                  ></ms-input>
                </div>
                <div class="form-group ms-big">
                  <ms-input
                    :maxLength="150"
                    :rules="[{ name: 'required' }, ]"
                    :label="$t('i18nMenuFontend.Detail.menu_name')"
                    v-model="model.menu_name"
                  ></ms-input>
                </div>
              </div>
              <div class="form-item_input">
                <div v-if="typeActive == typeMenu.web || typeActive == typeMenu.shop" class="form-group ms-small">
                  <ms-input
                    :maxLength="50"
                    :label="$t('i18nMenuFontend.Detail.icon')"
                    v-model="model.icon"
                  ></ms-input>
                </div>
                <div class="form-group ms-big">
                  <ms-input
                    :maxLength="150"
                    :label="$t('i18nMenuFontend.Detail.url')"
                    v-model="model.url"
                  ></ms-input>
                </div>
              </div>
              <div class="form-item_input">
                <div class="form-group">
                  <ms-combobox-tree-v2
                    :label="$t('i18nMenuFontend.Detail.parent')"
                    :data="comboBoxDataRemote.menu_code"
                    displayField="menu_name"
                    valueField="menu_id"
                    idProperty="menu_id"
                    v-model="model.parent_id"
                    :columns="[
                      {
                        title: $t('i18nMenu.Detail.menu_code'),
                        dataField: 'menu_code',
                        width: 300,
                      },
                      {
                        title: $t('i18nMenu.Detail.menu_name'),
                        dataField: 'menu_name',
                        width: null,
                      },
					          ]"
                  ></ms-combobox-tree-v2>
                </div>
              </div>
              <div class="form-item_input">
                <div class="form-group flex">
                  <ms-number
                    style="margin-right: 6px;"
                    class="ms-small"
                    :label="$t('i18nMenuFontend.Detail.sort')"
                    v-model="model.sort"
                  ></ms-number>
                  <div v-if="typeActive == typeMenu.app" class="select-image flex flex-center flex1">
                    <div>
                      <label class="select-title">{{ $t('i18nMenuFontend.Detail.icon') }}</label>
                      <ms-file-image
                        v-model="model.icon"
                        :path="'/menu/icon'"
                      ></ms-file-image>
                    </div>
                  </div>
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
import useModuleMenuFontend from "@/stores/bus/moduleMenuFontend";
import menuFontendAPI from "@/apis/bus/menuFontendAPI";
import BaseDetail from "@/views/base/BaseDetail";
import MsComboboxTreeV2 from "@/components/comboboxTree/MsComboboxTreeV2.vue";
import MsFileImage from "@/components/file/MsFileImage.vue";

export default defineComponent({
  mixins: [],
  components: {
    MsComboboxTreeV2,
    MsFileImage,
  },
  extends: BaseDetail,
  setup() {
    const { proxy }: any = getCurrentInstance(); // Instance của component
    const storeModule: any = useModuleMenuFontend(); // Cấu hình store
    const api = ref(menuFontendAPI); // Cấu hình api
    const subSystemCode = ref("menu_frontend"); // Cấu hình phân quyền
    const comboBoxDataRemote = reactive({
      menu_code: [],
    });
    const typeMenu = reactive({
      web: 'web',
      app: 'app',
      shop: 'shop',
    });
    const typeActive = ref(null);

    /**
     * Load menu về để chọn cha
     */
    const loadMenuParent = async () => {
      const me: any = proxy;
      const payload = {
        PageIndex: 0,
        PageSize: 0,
        Columns: "*",
        Filter: JSON.stringify(["menu_type", "=", typeActive.value]),
        Sort: "sort ASC",
        CustomParam: {},
      };
      me.$ms.commonFn.mask();
      const result = await menuFontendAPI.getList(payload);
      me.$ms.commonFn.unmask();
      if (result?.Success && result?.Data?.PageData?.length) {
        if (me.editMode == me.$ms.constant.FormState.Add) {
          comboBoxDataRemote.menu_code = result.Data.PageData;
        } else {
          comboBoxDataRemote.menu_code = me.$ms.commonFn.deleteHierarchyTree(
            result.Data.PageData,
            "parent_id",
            "menu_id",
            me._formParam.dataRow.menu_id
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
      typeActive.value = me._formParam.dataRow.menu_type;
      await loadMenuParent();
      await me.super("beforeBindData", BaseDetail);
    };

    return {
      api,
      storeModule,
      subSystemCode,
      comboBoxDataRemote,
      typeActive,
      typeMenu,
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
