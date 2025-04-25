<template>
  <div class="container-table">
    <div class="container-table_header border-line-bottom">
      <div class="name-table text-uppercase">
        <h1>{{ $t("i18nFeaturePackage.Title") }}</h1>
      </div>
      <div class="action-table">
        <div class="btn-add">
          <ms-button v-if="checkActionPermission('Add')" @click="add" class="primary">
            {{ $t("i18nEnum.FormState.Add") }}
          </ms-button>
        </div>
      </div>
    </div>
    <div class="table-function sticky">
      <div class="form-fix">
        <div class="action-left flex">
          <button style="margin-right: 8px" class="table-function_series toggle-list">
            <span>{{ $t("i18nCommon.batch_execution") }}</span>
            <div class="table-function_series-icon"></div>
            <div v-show="true" class="table-list_action" v-if="gridInfo.selected?.length">
              <div class="list_action-item" v-if="checkActionPermission('Delete')" @click="deleteMultiple">
                <font-awesome-icon :icon="['fas', 'trash']" class="mr-2" />
                {{ $t("i18nEnum.ModelState.Delete") }}
              </div>
              <div class="list_action-item" v-if="checkActionPermission('Edit')"
                @click="toggleActive(gridInfo.selected, true)">
                <i class="fa-solid fa-toggle-off mr-2 color-icon-primary"></i>
                {{ $t("i18nEnum.FeatureRow.Active") }}
              </div>
              <div class="list_action-item" v-if="checkActionPermission('Edit')"
                @click="toggleActive(gridInfo.selected, false)">
                <font-awesome-icon :icon="['fas', 'toggle-on']" class="mr-2" />
                {{ $t("i18nEnum.FeatureRow.Inactive") }}
              </div>
            </div>
          </button>
          <div style="width: 320px">
            <ms-input @input="debounceSearch" v-model="searchText" :placeholder="$t('i18nCommon.search')" :styleCustom="{
              paddingLeft: '32px',
            }">
              <template #iconCustom>
                <div class="icon-wrapper">
                  <i class="fa fa-search" :style="{
                    color: '#b6b7b7',
                    position: 'relative',
                    top: '2px',
                  }"></i>
                </div>
              </template>
            </ms-input>
          </div>
        </div>
        <list-condition-filter :grid="$refs[viewRef]" @loadData="loadData"></list-condition-filter>
      </div>
      <div style="min-width: 320px" class="table-function_search">
        <div class="action-render_table reload-table" @click="loadData" :content="$t('i18nCommon.load_data')"></div>
        <div class="action-render_table export-data" @click="exportData" :content="$t('i18nCommon.export_excel')"></div>
        <div class="action-render_table setting-table" v-if="checkActionPermission('ShowColumns')" @click="configLayout"
          :content="$t('i18nCommon.customize_interface')"></div>
      </div>
    </div>
    <ms-grid-viewer 
      :ref="viewRef" 
      :data="storeModule.items" 
      :pageTotal="storeModule.total"
      :loading="storeModule.loading" 
      :idField="'feature_package_id'" 
      :gridInfo="gridInfo" 
      :loadData="loadData"
      @handleDoubleClickRow="edit"
    >
      <template #widget-body="{ record }">
        <div class="widget-container">
          <button v-if="checkActionPermission('Edit')" @click="edit(record)" class="action-table action-table_left">
            <div class="action-default pr-1">
              <font-awesome-icon :icon="['fas', 'file-pen']" />
            </div>
          </button>
          <button v-else-if="checkActionPermission('Delete')" @click="deleteRow(record)"
            class="action-table action-table_left">
            <div class="action-default pr-1">
              <font-awesome-icon :icon="['fas', 'trash']" class="mr-2" />
             
            </div>
          </button>
          <menu-wrapper class="widget-more-container" :style="{ 'margin-left': '4px', cursor: 'pointer' }"
            :usingClickoutSide="true">
            <template #menu-button="{ toggleMenu }">
              <div @click="toggleMenu" class="ml-1">
                <i class="fa-solid fa-caret-down pa-1 color-icon-dark"></i>
              </div>
            </template>
            <template #menu-content>
              <menu-item v-if="checkActionPermission('Add')" class="menu-item-feture my-1"
                @menu-item-click="duplicate(record)">
                <font-awesome-icon :icon="['fas', 'copy']" class="mr-2" />
                <span>{{ $t("i18nEnum.FormState.Duplicate") }}</span>
              </menu-item>
              <menu-item v-if="checkActionPermission('Delete')" class="menu-item-feture my-1"
                @menu-item-click="deleteRow(record)">
                <font-awesome-icon :icon="['fas', 'trash']" class="mr-2" />
                <span>{{ $t("i18nEnum.FeatureRow.Delete") }}</span>
              </menu-item>
              <menu-item class="menu-item-feture my-1" v-if="record.is_active && checkActionPermission('Edit')"
                @menu-item-click="toggleActive([record], false)">
                <font-awesome-icon :icon="['fas', 'toggle-on']" class="mr-2" />
                <span>{{ $t("i18nEnum.FeatureRow.Inactive") }}</span>
              </menu-item>
              <menu-item class="menu-item-feture my-1" v-else-if="checkActionPermission('Edit')"
                @menu-item-click="toggleActive([record], true)">
                <i class="fa-solid fa-toggle-off mr-2 color-icon-primary"></i>
                <span>{{ $t("i18nEnum.FeatureRow.Active") }}</span>
              </menu-item>
            </template>
          </menu-wrapper>
        </div>
      </template>
    </ms-grid-viewer>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref } from "vue";
import MsGridViewer from "@/components/msGridViewer/MsGridViewer.vue";
import ListConditionFilter from "@/components/msGridViewer/ListConditionFilter.vue";
import BaseList from "@/views/base/BaseList";
import useModuleFeaturePackage from "@/stores/bus/moduleFeaturePackage";
import MenuItem from "@/components/dropdown/MenuItem.vue";
import MenuWrapper from "@/components/dropdown/MenuWrapper.vue";
import featurePackageAPI from "@/apis/bus/featurePackageAPI";

export default defineComponent({
  components: {
    MsGridViewer,
    ListConditionFilter,
    MenuItem,
    MenuWrapper,
  },
  extends: BaseList,
  setup: () => {
    const { proxy }: any = getCurrentInstance(); // Instance của component
    const storeModule: any = useModuleFeaturePackage(); // Cấu hình store
    const layoutTag = ref("FeaturePackageList"); // Cấu hình layout
    const formDetailName = ref("FeaturePackageDetail"); // Cấu hình tên form detail
    const subSystemCode = ref("feature_package"); // Cấu hình phân quyền
    const api = ref(featurePackageAPI); // Cấu hình api

    /**
     * Xử lý custom tham số load data trước khi call lên serve lấy dữ liệu
     * @override
     */
    const customParamLoadData = async (param: any) => {
      if (param.Sort) {
        param.Sort = `${param.Sort},sort ASC`;
      } else {
        param.Sort = "sort ASC";
      }
    };

    return {
      api,
      layoutTag,
      storeModule,
      subSystemCode,
      formDetailName,
      customParamLoadData,
    };
  },
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/listStyle" as style;
</style>