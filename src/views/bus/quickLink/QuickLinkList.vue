<template>
  <div class="container-table">
    <div class="container-table_header border-line-bottom">
      <div class="name-table text-uppercase">
        <h1>{{ $t("i18nQuickLink.Title") }}</h1>
      </div>
      <div class="action-table">
        <div class="btn-add">
          <ms-button
            v-if="checkActionPermission('Add')"
            @click="add"
            class="primary"
          >
            {{ $t("i18nEnum.FormState.Add") }}
          </ms-button>
        </div>
      </div>
    </div>
    <div class="table-function sticky">
      <div class="form-fix">
        <div class="action-left flex flex-center">
          <button
            style="margin-right: 8px"
            class="table-function_series toggle-list"
          >
            <span>{{ $t("i18nCommon.batch_execution") }}</span>
            <div class="table-function_series-icon"></div>
            <div
              v-show="true"
              class="table-list_action"
              v-if="gridInfo.selected?.length"
            >
              <div
                class="list_action-item"
                v-if="checkActionPermission('Edit')"
                @click="toggleActive(gridInfo.selected, true)"
              >
                <i class="fa-solid fa-toggle-off mr-2 color-icon-primary"></i>
                {{ $t("i18nEnum.FeatureRow.Active") }}
              </div>
              <div
                class="list_action-item"
                v-if="checkActionPermission('Edit')"
                @click="toggleActive(gridInfo.selected, false)"
              >
                <font-awesome-icon :icon="['fas', 'toggle-on']" class="mr-2" />
                {{ $t("i18nEnum.FeatureRow.Inactive") }}
              </div>
            </div>
          </button>
          <div style="width: 320px">
            <ms-input
              @input="debounceSearch"
              v-model="searchText"
              :placeholder="$t('i18nCommon.search')"
              :styleCustom="{
                paddingLeft: '32px',
              }"
            >
              <template #iconCustom>
                <div class="icon-wrapper">
                  <i
                    class="fa fa-search"
                    :style="{
                      color: '#b6b7b7',
                      position: 'relative',
                      top: '2px',
                    }"
                  ></i>
                </div>
              </template>
            </ms-input>
          </div>
        </div>
        <list-condition-filter
          :grid="$refs[viewRef]"
          @loadData="loadData"
        ></list-condition-filter>
      </div>
      <div style="min-width: 320px" class="table-function_search">
        <div
          class="action-render_table reload-table"
          @click="loadData"
          :content="$t('i18nCommon.load_data')"
        ></div>
        <div
          class="action-render_table export-data"
          @click="exportData"
          :content="$t('i18nCommon.export_excel')"
        ></div>
        <div
          class="action-render_table setting-table"
          v-if="checkActionPermission('ShowColumns')"
          @click="configLayout"
          :content="$t('i18nCommon.customize_interface')"
        ></div>
      </div>
    </div>
    <ms-grid-tree
      :ref="viewRef"
      :data="storeModule.items"
      :pageTotal="storeModule.total"
      :loading="storeModule.loading"
      :idField="'quick_link_id'"
      :gridInfo="gridInfo"
      :loadData="loadData"
      @handleDoubleClickRow="edit"
    >
      <template #widget-body="{ record }">
        <div class="widget-container">
          <button
            v-if="checkActionPermission('Edit')"
            @click="edit(record)"
            class="action-table action-table_left"
          >
            <div class="action-default pr-1">
              <font-awesome-icon :icon="['fas', 'file-pen']" />
            </div>
          </button>
          <button
            v-else-if="checkActionPermission('Delete')"
            @click="deleteRow(record)"
            class="action-table action-table_left"
          >
            <div class="action-default pr-1">
              <font-awesome-icon :icon="['fas', 'trash']" class="mr-2" />
             
            </div>
          </button>
          <menu-wrapper
            class="widget-more-container"
            :style="{ 'margin-left': '4px', cursor: 'pointer' }"
            :usingClickoutSide="true"
          >
            <template #menu-button="{ toggleMenu }">
              <div @click="toggleMenu" class="ml-1">
                <i class="fa-solid fa-caret-down pa-1 color-icon-primary"></i>
              </div>
            </template>
            <template #menu-content>
              <menu-item
                v-if="checkActionPermission('Delete')"
                class="menu-item-feture my-1 text-color-primary hover-primary"
                @menu-item-click="deleteRow(record)"
              >
                <font-awesome-icon :icon="['fas', 'trash']" class="mr-2" />
                <span>{{ $t("i18nEnum.FeatureRow.Delete") }}</span>
              </menu-item>
              <menu-item
                class="menu-item-feture my-1 text-color-primary hover-primary"
                v-if="record.is_active && checkActionPermission('Edit')"
                @menu-item-click="toggleActive([record], false)"
              >
                <font-awesome-icon :icon="['fas', 'toggle-on']" class="mr-2" />
                <span>{{ $t("i18nEnum.FeatureRow.Inactive") }}</span>
              </menu-item>
              <menu-item
                class="menu-item-feture my-1 text-color-primary hover-primary"
                v-else-if="checkActionPermission('Edit')"
                @menu-item-click="toggleActive([record], true)"
              >
                <i class="fa-solid fa-toggle-off mr-2 color-icon-primary"></i>
                <span>{{ $t("i18nEnum.FeatureRow.Active") }}</span>
              </menu-item>
            </template>
          </menu-wrapper>
        </div>
      </template>
    </ms-grid-tree>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref } from "vue";
import MsGridTree from "@/components/msGridViewer/MsGridTree.vue";
import ListConditionFilter from "@/components/msGridViewer/ListConditionFilter.vue";
import BaseList from "@/views/base/BaseList";
import useModuleQuickLink from "@/stores/bus/moduleQuickLink";
import MenuItem from "@/components/dropdown/MenuItem.vue"; 
import MenuWrapper from "@/components/dropdown/MenuWrapper.vue";
import quickLinkAPI from "@/apis/bus/quickLinkAPI";
import { showError } from "@/commons/globalMessage";

export default defineComponent({
  components: {
    MsGridTree,
    ListConditionFilter,
    MenuItem,
    MenuWrapper,
  },
  extends: BaseList,
  setup: () => {
    const { proxy }: any = getCurrentInstance(); // Instance của component
    const storeModule: any = useModuleQuickLink(); // Cấu hình store
    const layoutTag = ref("QuickLinkList"); // Cấu hình layout
    const formDetailName = ref("QuickLinkDetail"); // Cấu hình tên form detail
    const api = ref(quickLinkAPI); // Cấu hình api
    const subSystemCode = ref("quick_link"); // Cấu hình phân quyền

    /**
     * Xử lý custom tham số load data trước khi call lên serve lấy dữ liệu
     * @override
     */
    const customParamLoadData = async (param: any) => {
      if (param.Columns) {
        param.Columns = param.Columns.concat(",parent_id");
      } else {
        param.Columns = param.Columns.concat("parent_id");
      }
      // Hình cây nên load all luôn
      param.PageIndex = 0;
      param.PageSize = 0;
    };

    /**
     * Xoá một bản ghi trên danh sách
     * @override
     */
    const deleteRow = async (record: any) => {
      const me: any = proxy;
      if (record.is_parent) {
        showError(me.$t("i18nQuickLink.ErrorDeleteParent"));
        return;
      }
      await me.super("deleteRow", BaseList, record);
    };

    return {
      api,
      subSystemCode,
      layoutTag,
      storeModule,
      formDetailName,
      deleteRow,
      customParamLoadData,
    };
  },
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/listStyle" as style;
</style>
