<template>
  <div class="container-table">
    <div class="container-table_header border-line-bottom">
      <div class="name-table text-uppercase">
        <h1>{{ $t("i18nNews.Title") }}</h1>
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
          <ms-button
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
          </ms-button>
          <menu-wrapper
            class="topnav-widget-more-container"
            :hideInContent="false"
            :position="{ at: 'left bottom', my: 'left top' }"
          >
            <template #menu-button="{ toggleMenu }">
              <ms-button
                style="height: 32px"
                class="mr-2"
                :class="[`${isFilterAdvanced ? 'bg-orange-medium' : ''}`]"
                @click="toggleMenu"
              >
                {{ $t("i18nControl.MsGridViewer.filter") }}
              </ms-button>
            </template>
            <template #menu-content="{ closeHandler }">
              <div class="padding-body-filter">
                <div class="padding-body-filter-content">
                  <div class="form-group">
                    <ms-combobox-v2
                      :label="$t('i18nNews.Detail.news_type')"
                      valueField="dictionary_value"
                      displayField="dictionary_name"
                      :data="dataCombobox.dictionary"
                      :initText="modelFilterNewsType.news_type_name"
                      @selected="selectedNewsType"
                      v-model="modelFilterNewsType.news_type"
                      v-model:display="modelFilterNewsType.news_type_name"
                    ></ms-combobox-v2>
                  </div>
                </div>
                <div class="filter-line"></div>
                <div class="padding-body-filter-footer">
                  <ms-button @click="closeHandler">
                    {{ $t("i18nCommon.Close") }}
                  </ms-button>
                  <ms-button class="primary" @click="doFilter(closeHandler)">
                    {{ $t("i18nControl.MsGridViewer.filter") }}
                  </ms-button>
                </div>
              </div>
            </template>
          </menu-wrapper>
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
    <div style="padding-top: 0; z-index: 5;" class="table-function">
      <div class="flex badge-container">
        <div @click="handleFilterStatus({ news_status: 'all' })" class="badge" :class="{ 'active': filterNewsStatus == 'all' }">
          {{ $t('i18nCommon.all') }}
        </div>
        <div @click="handleFilterStatus(news_status.LuuTam)" :class="{ 'active': filterNewsStatus == 'LuuTam' }" class="badge">
          {{ news_status.LuuTam.news_status_name }}
        </div>
        <div style="color: #f87119;" @click="handleFilterStatus(news_status.ChoDuyet)" :class="{ 'active': filterNewsStatus == 'ChoDuyet' }" class="badge">
          {{ news_status.ChoDuyet.news_status_name }}
        </div>
        <div style="color: #25aa0c;" @click="handleFilterStatus(news_status.DaDuyet)" :class="{ 'active': filterNewsStatus == 'DaDuyet' }" class="badge">
          {{ news_status.DaDuyet.news_status_name }}
        </div>
        <div style="color: #ff0000;" @click="handleFilterStatus(news_status.TuChoi)" :class="{ 'active': filterNewsStatus == 'TuChoi' }" class="badge">
          {{ news_status.TuChoi.news_status_name }}
        </div>
      </div>
    </div>
    <ms-grid-viewer
      :ref="viewRef"
      :data="storeModule.items"
      :pageTotal="storeModule.total"
      :loading="storeModule.loading"
      :idField="'news_id'"
      :gridInfo="gridInfo"
      :loadData="loadData"
      @handleDoubleClickRow="edit"
    >
      <template #picture="{ record }">
        <div v-if="record.picture" class="image-table" :ref="`${record.picture}_image`">
          <img
            class="pointer"
            @click="showViewer(record.picture)"
            v-bind:src="fileAPI.getFileViewUrl(record.picture)"
          />
        </div>
      </template>
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
import { defineComponent, getCurrentInstance, ref, onBeforeMount, reactive, onBeforeUnmount } from "vue";
import MsGridViewer from "@/components/msGridViewer/MsGridViewer.vue";
import ListConditionFilter from "@/components/msGridViewer/ListConditionFilter.vue";
import BaseList from "@/views/base/BaseList";
import useModuleNews from "@/stores/bus/moduleNews";
import MenuItem from "@/components/dropdown/MenuItem.vue";
import MenuWrapper from "@/components/dropdown/MenuWrapper.vue";
import newsAPI from "@/apis/bus/newsAPI";
import fileAPI from "@/apis/file/fileAPI";
import dictionaryAPI from "@/apis/sys/dictionaryAPI";
import { useNewsConfig } from "@/views/bus/news/newsConfig";
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';

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
    const storeModule: any = useModuleNews(); // Cấu hình store
    const layoutTag = ref("NewsList"); // Cấu hình layout
    const formDetailName = ref("NewsDetail"); // Cấu hình tên form detail
    const subSystemCode = ref("news"); // Cấu hình phân quyền
    const api = ref(newsAPI); // Cấu hình api
    const { news_status, loadMappingNewStatus } = useNewsConfig();
    const filterNewsStatus = ref('all');
    const isFilterAdvanced = ref(false); // Cờ đánh dấu là đang thực hiện lọc nâng cao
    const modelFilterNewsType = ref({
      news_type_name: null,
      news_type: null,
    });
    const dataCombobox = reactive({
      dictionary: [],
    });

    /**
     * Show ra hình ảnh lớn
     */
    const showViewer = (image) => {
      const me: any = proxy;
      if(me.viewerInstance){
        me.viewerInstance.destroy(); // Hủy viewerInstance
        me.viewerInstance = null;
      }
      me.viewerInstance = new Viewer(me.$refs[`${image}_image`], {
        inline: false,
        toolbar: true,
        navbar: false,
      });
      me.viewerInstance.show();
    };

    onBeforeUnmount(() => {
      const me: any = proxy;
      if(me.viewerInstance){
        me.viewerInstance.destroy(); // Hủy viewerInstance
        me.viewerInstance = null;
      }
    });

    /**
     * Thực hiện lọc nâng cao
     * @author nktiem 30.12.2024
     */
     const doFilter = (closeHandler: Function) => {
      const me: any = proxy;
      if (typeof me.$refs[me.viewRef]?.loadPageIndex === "function") {
        me.$refs[me.viewRef].loadPageIndex(1);
      }
      if (typeof closeHandler === "function") {
        closeHandler();
      }
    };

    /**
     * Xử lý khi onBeforeMount
     */
    onBeforeMount(() => {
      loadMappingNewStatus();
      loadDataNewsType();
    });

    /**
     * Load news type filter về
     * @author nktiem 30.12.2024
     */
    const loadDataNewsType = async () => {
      const me: any = proxy;
      const payload = {
        PageIndex: 0,
        PageSize: 0,
        Columns: "*",
        Filter: JSON.stringify(["dictionary_list_code", "=", "LoaiTuc"]),
        Sort: "",
        CustomParam: {},
      };
      me.$ms.commonFn.mask();
      const result = await dictionaryAPI.getList(payload);
      me.$ms.commonFn.unmask();
      if (result?.Success && result?.Data?.PageData?.length){
        dataCombobox.dictionary = result.Data.PageData;
      }
    };

    /**
     * Filter theo trạng thái
     */
    const handleFilterStatus = (status) => {
      const me: any = proxy;
      filterNewsStatus.value = status.news_status;
      if (typeof me.$refs[me.viewRef]?.loadPageIndex === "function") {
        me.$refs[me.viewRef].loadPageIndex(1);
      }
    };

    /**
     * Xử lý custom tham số load data trước khi call lên serve lấy dữ liệu
     * @override
     * @author nktiem 30.12.2024
     */
    const customParamLoadData = (param) => {
      const me: any = proxy;
      if(filterNewsStatus.value != 'all'){
        const filterStatus = ["news_status", "=", filterNewsStatus.value];
        me.$ms.commonFn.concatFilter(param, filterStatus);
      }
      if(modelFilterNewsType.value.news_type){
        const filterNewsType = ["news_type", "=", modelFilterNewsType.value.news_type];
        me.$ms.commonFn.concatFilter(param, filterNewsType);
        isFilterAdvanced.value = true;
      }
      else{
        isFilterAdvanced.value = false;
      }
    };

    /**
     * Xử lý chọn danh mục combobox new type
     */
    const selectedNewsType = (metaData) => {
      modelFilterNewsType.value.news_type_name = metaData.newData ? metaData.newData.dictionary_name : null;
    };

    return {
      api,
      fileAPI,
      layoutTag,
      storeModule,
      subSystemCode,
      formDetailName,
      news_status,
      filterNewsStatus,
      isFilterAdvanced,
      modelFilterNewsType,
      dataCombobox,
      doFilter,
      handleFilterStatus,
      customParamLoadData,
      selectedNewsType,
      showViewer,
    };
  },
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/listStyle" as style;
</style>
