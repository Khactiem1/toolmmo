<template>
  <div class="container-table">
    <div class="container-table_header border-line-bottom">
      <div class="name-table text-uppercase">
        <h1>{{ $t("i18nDictionary.Title") }}</h1>
      </div>
    </div>
    <div class="table-function sticky">
      <div class="form-fix">
        <div class="action-left flex">
          <div class="flex flex-center" style="width: 680px">
            <ms-input
              style="margin-right: 8px;"
              v-model="inputData"
              :placeholder="$t('i18nCommon.EnterDocument')"
            >
            </ms-input>
            <ms-button
              @click="createData"
              class="primary"
            >
              Tạo
            </ms-button>
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
          :content="$t('i18nCommon.load_data')"
        ></div>
        <div
          class="action-render_table export-data"
          :content="$t('i18nCommon.export_excel')"
        ></div>
      </div>
    </div>
    <ms-grid-viewer
      :ref="viewRef"
      :idField="'email_id'"
      :columns="column"
      :data="storeModule.items"
      :pageTotal="storeModule.total"
      :loading="storeModule.loading"
      :gridInfo="gridInfo"
      @handleDoubleClickRow="edit"
    >
      <template #qr_code="{ record }">
        <div class="image-table">
          <a style="cursor: pointer; color: #067bb1; margin-right: 8px;" v-if="!record.show" @click="() => { record.show = true }">hiện</a>
          <a style="cursor: pointer; color: #067bb1; margin-right: 8px;" v-if="record.show" @click="() => { record.show = false }">Ẩn</a>
          <qrcode-vue
            v-if="record.show"
            :value="record.email"
            :size="100"
            level="H"
          />
        </div>
      </template>
      <template #description="{ record }">
        <ms-input
          v-model="record.description"
        ></ms-input>
      </template>
      <template #widget-body="{ record }">
        <div class="widget-container">
          <button
            @click="showMail(record)"
            class="action-table action-table_left"
          >
            <div class="action-default pr-1">
              Hộp thư
            </div>
          </button>
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
import dictionaryAPI from "@/apis/sys/dictionaryAPI";
import QrcodeVue from 'qrcode.vue'
import popupUtil from "@/commons/popupUtil";

export default defineComponent({
  components: {
    MsGridViewer,
    ListConditionFilter,
    QrcodeVue,
  },
  extends: BaseList,
  setup: () => {
    const { proxy }: any = getCurrentInstance(); // Instance của component
    const storeModule: any = useModuleDictionary(); // Cấu hình store
    const formDetailName = ref("DictionaryDetail"); // Cấu hình tên form detail
    const api = ref(dictionaryAPI); // Cấu hình api
    const subSystemCode = ref("dictionary"); // Cấu hình phân quyền
    const inputData = ref('');
    const barcodeOptions = {
      format: "CODE128", // phổ biến, hiển thị tốt hầu hết text
      lineColor: "#000",
      width: 2,
      height: 100,
      displayValue: true
    }
    /**
     * Layout grid
     */
     const column: any[] = [
      {
        lock: false,
        width: 250,
        header: "email",
        dataField: "email",
        formatType: 12,
        headerCustom: "email",
        visible: true,
      },
      {
        lock: false,
        width: null,
        header: "pass",
        dataField: "pass",
        formatType: 12,
        headerCustom: "pass",
        visible: true,
      },
      {
        lock: false,
        width: null,
        header: "qr_code",
        dataField: "qr_code",
        formatType: 12,
        headerCustom: "qr_code",
        visible: true,
        type: 'custom',
      },
      // {
      //   lock: false,
      //   width: 200,
      //   header: "refresh_token",
      //   dataField: "refresh_token",
      //   formatType: 12,
      //   headerCustom: "refresh_token",
      //   visible: true,
      // },
      {
        lock: false,
        width: 200,
        header: "description",
        dataField: "description",
        formatType: 12,
        headerCustom: "description",
        visible: true,
        type: 'custom',
      },
    ];

    const createData = () => {
      const me = proxy;
      if(inputData.value){
        // Tách các block tài khoản theo dấu cách hoặc nhiều khoảng trắng
        const rawAccounts = inputData.value.trim().split(/\s+/);
        const accounts = [];

        for (const block of rawAccounts) {
          const parts = block.split("|");

          // Đảm bảo có ít nhất 4 phần tử ở cuối: email, pass, refresh_token, client_id
          if (parts.length >= 4) {
            const len = parts.length;

            const email = parts[len - 4];
            const pass = parts[len - 3];
            const refresh_token = parts[len - 2];
            const client_id = parts[len - 1];

            accounts.push({
              email_id: me.$ms.commonFn.generateUUID(),
              email,
              pass,
              refresh_token,
              client_id
            });
          }
        }
        me.storeModule.items = accounts;
      }
    };

    const showMail = async (record) => {
      proxy.$ms.commonFn.mask();
      const data: any = await dictionaryAPI.showMail(record);
      proxy.$ms.commonFn.unmask();
      if(data?.data?.messages?.length){
        popupUtil.show('ViewSupplierDetail', { dataRows: data.data.messages });
      }
    };

    return {
      api,
      column,
      subSystemCode,
      storeModule,
      formDetailName,
      inputData,
      createData,
      barcodeOptions,
      showMail,
    };
  },
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/listStyle" as style;
:deep(.table tbody td){
  min-height: 100px;
  height: 100px;
}
</style>
