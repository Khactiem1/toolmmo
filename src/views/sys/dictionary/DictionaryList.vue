<template>
  <div class="container-table">
    <div class="container-table_header border-line-bottom">
      <div class="name-table text-uppercase">
        <h1>{{ $t("i18nDictionary.Title") }}</h1>
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
        <div class="action-left flex">
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
                v-if="checkActionPermission('Delete')"
                @click="deleteMultiple"
              >
                <font-awesome-icon :icon="['fas', 'trash']" class="mr-2" />
                {{ $t("i18nEnum.ModelState.Delete") }}
              </div>
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
      </div>
    </div>
    <ms-grid-viewer
      :ref="viewRef"
      :columns="column"
      :data="storeModule.items"
      :pageTotal="storeModule.total"
      :loading="storeModule.loading"
      :idField="'dictionary_id'"
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
                v-if="checkActionPermission('Add')"
                class="menu-item-feture my-1 text-color-primary hover-primary"
                @menu-item-click="duplicate(record)"
              >
                <font-awesome-icon :icon="['fas', 'copy']" class="mr-2" />
                <span>{{ $t("i18nEnum.FormState.Duplicate") }}</span>
              </menu-item>
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
    </ms-grid-viewer>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref } from "vue";
import MsGridViewer from "@/components/msGridViewer/MsGridViewer.vue";
import ListConditionFilter from "@/components/msGridViewer/ListConditionFilter.vue";
import BaseList from "@/views/base/BaseList";
import useModuleDictionary from "@/stores/sys/moduleDictionary";
import MenuItem from "@/components/dropdown/MenuItem.vue";
import MenuWrapper from "@/components/dropdown/MenuWrapper.vue";
import dictionaryAPI from "@/apis/sys/dictionaryAPI";
import { showError } from "@/commons/globalMessage";

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
    const storeModule: any = useModuleDictionary(); // Cấu hình store
    const formDetailName = ref("DictionaryDetail"); // Cấu hình tên form detail
    const api = ref(dictionaryAPI); // Cấu hình api
    const subSystemCode = ref("dictionary"); // Cấu hình phân quyền

    /**
     * Xử lý custom tham số load data trước khi call lên serve lấy dữ liệu
     * @override
     */
    const customParamLoadData = async (param: any) => {
      if (param.Sort) {
        param.Sort = `${param.Sort},dictionary_list_name DESC`;
      } else {
        param.Sort = "dictionary_list_name DESC";
      }
    };

    /**
     * Layout grid
     */
     const column: any[] = [
      {
        lock: false,
        width: 250,
        header: "i18nDictionary.Detail.dictionary_code",
        dataField: "dictionary_code",
        formatType: 12,
        headerCustom: "",
        visible: true,
      },
      {
        lock: false,
        width: null,
        header: "i18nDictionary.Detail.dictionary_name",
        dataField: "dictionary_name",
        formatType: 12,
        headerCustom: "",
        visible: true,
      },
      {
        lock: false,
        width: 200,
        header: "i18nDictionary.Detail.dictionary_value",
        dataField: "dictionary_value",
        formatType: 12,
        headerCustom: "",
        visible: true,
      },
      {
        lock: false,
        width: 200,
        header: "i18nDictionary.Detail.dictionary_list_name",
        dataField: "dictionary_list_name",
        formatType: 12,
        headerCustom: "",
        visible: true,
      },
      {
        lock: false,
        width: 140,
        header: "i18nCommon.state",
        dataField: "is_active",
        formatType: 100,
        enum: "EnumInactive",
        headerCustom: "",
        visible: true,
      },
    ];
    
    /**
     * Xoá một bản ghi trên danh sách
     * @override
     */
    const deleteRow = async (record: any) => {
      const me: any = proxy;
      if (record.is_parent) {
        showError(me.$t("i18nMenu.ErrorDeleteParent"));
        return;
      }
      await me.super("deleteRow", BaseList, record);
    };

    return {
      api,
      column,
      subSystemCode,
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
