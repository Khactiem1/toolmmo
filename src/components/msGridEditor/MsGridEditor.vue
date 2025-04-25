<template>
  <div class="ms-grid-viewer table-content">
    <div class="table-scroll">
      <div class="table-container">
        <table class="table">
          <thead class="thead-light">
            <!-- Phần head table -->
            <tr>
              <!-- ô check box -->
              <th class="fix" style="width: 40px" v-if="multiple">
                <ms-checkbox
                  :checked="isCheckedAll"
                  @custom-handle-click-checkbox="changeCheckedMultiple"
                >
                </ms-checkbox>
              </th>
              <draggable
                :list="columnx"
                :disabled="!true"
                item-key="dataField"
                :tag="'div'"
                class="drag"
                ghost-class="ghost"
                @start="dragging = true"
                @end="dragging = false"
              >
                <!-- Phần render các cột head -->
                <template #item="{ element, index }">
                  <th
                    :class="`
                      ${
                        index === columnx.length - 1 ? 'header-content-end' : ''
                      }
                      ${
                        element.formatType === $ms.constant.FormatType.Number
                          ? 'right'
                          : ''
                      }
                      ${element.lock ? `z3` : ''}
                    `"
                    :style="{
                      'min-width': `${element.width ? element.width : 150}px`,
                      width: `${element.width}px`,
                      'max-width': `${element.width}px`,
                      position: `${element.lock ? `sticky` : ''}`,
                      left: `${element.lock ? `${element.offset}px` : ''}`,
                    }"
                  >
                  <span
                      style="display: flex; line-height: 18px;"
                    >
                      <span style="flex: 1; display: inline-block">
                        {{
                          element.headerCustom &&
                          element.headerCustom.trim() !== ""
                            ? element.headerCustom
                            : element.header
                            ? $t(`${element.header}`)
                            : element.header
                        }}
                      </span>
                    </span>
                    <div
                      class="ms-resize"
                      @mouseup.stop.prevent="(e: any) => { resizeOff(e, element) }"
                      @mousedown.stop.prevent="(e: any) => { resizeOn(e, element) }"
                    ></div>
                  </th>
                </template>
              </draggable>
              <!-- Phần render các chức năng tác vụ -->
              <th
                v-if="showAction"
                style="width: 40px; min-width: 40px;"
                class="text-center fix column-end"
              >
                <!-- {{ $t("i18nCommon.function") }} -->
              </th>
            </tr>
          </thead>
          <!-- Phần render báo table trống khi danh sách trống -->
          <tbody>
            <!-- Phần body table -->
            <tr
              v-for="(row, indexData) in datax"
              :key="idField ? row[idField] : indexData"
              @dblclick="handleDoubleClickRow(row)"
              @click="handleClickRow(row)"
              :class="[`${row.selected ? 'row-selected' : ''}`]"
            >
              <!-- ô check box -->
              <td v-if="multiple" class="column-sticky">
                <ms-checkbox
                  :checked="isSelected(row)"
                  @custom-handle-click-checkbox="handleClickCheckbox(row)"
                ></ms-checkbox>
              </td>
              <td
                v-for="(col, index) in columnx"
                :title="
                  $ms.commonFn.processDataaGridViewer(col, row[col.dataField])
                "
                :class="`
                  ${index === columnx.length - 1 ? 'header-content-end' : ''}
                  ${
                    col.formatType === $ms.constant.FormatType.Number
                      ? 'right'
                      : ''
                  }
                  ${col.lock ? `z3` : ''}
                `"
                :key="index"
                :style="{
                  position: `${col.lock ? `sticky` : ''}`,
                  left: `${col.lock ? `${col.offset}px` : ''}`,
                }"
              >
                <slot
                  v-if="col.type === 'custom'"
                  :name="col.dataField"
                  :record="row"
                />
                <span
                  v-else-if="col.type == 'serial'"
                  class="data-table-bind"
                  :class="`${lineClamp}`"
                  style="text-align: center;"
                >
                  {{ ((gridInfo.pageIndex - 1) * gridInfo.pageSize) + (indexData + 1) }}
                </span>
                <div v-else>
                  <span v-if="(disabled || !col.editable) && !col.isShowControl" class="data-table-bind" :class="`${lineClamp}`">
                    {{ $ms.commonFn.processDataaGridViewer(col, row[col.dataField]) }}
                  </span>
                  <ms-editor
                    v-else
                    :disabled="disabled"
                    :col="col"
                    :dataRow="row"
                    :propsData="propsData[col.dataField] || {}"
                  >
                  </ms-editor>
                </div>
              </td>
              <!-- Phần render các chức năng tác vụ -->
              <td v-if="showAction" class="text-center fix column-end">
                <div class="action-colum_table flex flex-center">
                  <slot name="widget-body" :record="row" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { watch, ref, getCurrentInstance, computed, defineComponent, onMounted, onBeforeMount } from "vue";
import draggable from "vuedraggable";
import { useColumnResize } from "@/setup/grid/resizeColumn";
import MsEditor from "@/components/msGridEditor/MsEditor.vue";

export default defineComponent({
  components: {
    draggable,
    MsEditor,
  },
  props: {
    /**
     * Dữ liệu đang binding
     */
    data: {
      type: Array,
      default: [],
    },

    /**
     * propsData của cell
     */
		propsData: {
			default: {},
			type: Object,
		},

    /**
     * data mặc định khi add row
     */
    initDataBeforeAddRow: {
      default: null,
      type: Function,
    },

    /**
     * model type của data
     */
    model: {
      default: null,
    },

    /**
     * disabled control nhập liệu
     */
    disabled: {
      default: false,
      type: Boolean,
    },

    /**
     * Có thêm cột thứ tự hay ko
     */
    serial: {
      type: Boolean,
      default: true,
    },

    /**
     * Số bản ghi / 1 trang
     */
    gridInfo: {
      type: Object,
      default: {
        selected: [],
        /**
         * Số lượng bản ghi trên 1 trang
         */
        pageSize: 50,
        /**
         * Page đang hiển thị
         */
        pageIndex: 1,
      },
    },

    /**
     * Các thuộc tính trong columns
     * @params lock: Có đang cố định cột.
     * @params width: độ rộng của cột
     * @params header: Tiêu đề của cột
     * @params dataField: Trường dữ liệu
     * @params type: Kiểu trường type custom
     * @params formatType: Kiểu dữ liệu
     * @params headerCustom: Tiêu đề của cột custom bởi người dùng
     * @params visible: Có show cột này hay không
     */
    columns: {
      type: Array,
      default: [],
    },

    /**
     * Grid có chức năng action hay ko
     */
    showAction: {
      type: Boolean,
      default: true,
    },

    /**
     * ID của bản ghi (dùng để làm key)
     */
    idField: {
      type: String,
      default: "_PkID",
    },

    /**
     * Có check all hay không
     */
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const { proxy }: any = getCurrentInstance();

    const colFilter = ref({}); // Dữ liệu cột đang thực hiện show filter
    const { resizeOn, resizeOff, handleShowFilter } = useColumnResize();
    const lineClamp = ref<any>(""); // Số dòng hiển thị dữ liệu trên 1 row;
    
    /**
     * Data đang thực hiện binding
     */
    const datax = computed(() => {
      const me = proxy;
      if(me.data?.length){
        return me.data.filter(_ => _.State != me.$ms.constant.FormState.Delete);
      }
      return [];
    });

    const getData = () => {
      const me = proxy;
      return datax;
    };

    /**
     * Hàm xử lý checkbox value true thì là check ô tất cả check, value là 0,1,2 là xử lý các phần tử được check
     * Khắc Tiềm - 08.03.2023
     * */
    const handleClickCheckbox = (row: any) => {
      const me: any = proxy;
      const indexRowSelected = me.gridInfo.selected.findIndex(
        (item: any) => item[me.idField] == row[me.idField]
      );
      if (indexRowSelected !== -1) {
        me.gridInfo.selected.splice(indexRowSelected, 1);
      } else {
        me.gridInfo.selected.push(row);
      }
    };

    /**
     * Kiểm tra xem cột được check hay không ?
     * duyệt trong data nếu có chưa dữ liệu của dòng tương ứng thì return true ngược lại false
     * @param dataRow dữ liệu của dòng được check
     *  */
    const isSelected = (dataRow: any) => {
      const me: any = proxy;
      if (me.gridInfo.selected && me.gridInfo.selected.length > 0) {
        return me.gridInfo.selected.findIndex(
          (x: any) => x[me.idField] === dataRow[me.idField]
        ) === -1
          ? false
          : true;
      }
      return false;
    };

    /**
     * Ẩn hiện check tất cả
     * Khắc Tiềm - 15.09.2022
     */
    const isCheckedAll = computed(() => {
      const me: any = proxy;
      if (me.idField && me.multiple && me.data && me.gridInfo.selected) {
        const lstDataxID: any[] = me.data.map((_: any) => _[me.idField]);
        const countDataSelectInDatax = me.gridInfo.selected.filter((_: any) =>
          lstDataxID.includes(_[me.idField])
        );
        if (
          countDataSelectInDatax?.length &&
          countDataSelectInDatax.length === lstDataxID.length
        ) {
          return true;
        }
        return false;
      }
    });

    /**
     * Bỏ chọn tất cả các bản ghi đang selected
     */
    const removeSelectedAll = () => {
      const me: any = proxy;
      me.gridInfo.selected = [];
    };

    /**
     * Xử lý check all hoặc bỏ check all toàn bộ rowData
     */
    const changeCheckedMultiple = () => {
      const me: any = proxy;
      if (isCheckedAll.value) {
        me.data.forEach((row: any) => {
          const indexSelectRow = me.gridInfo.selected.findIndex(
            (_: any) => _[me.idField] == row[me.idField]
          );
          if (indexSelectRow !== -1) {
            me.gridInfo.selected.splice(indexSelectRow, 1);
          }
        });
      } else {
        me.data.forEach((row: any) => {
          if (
            !me.gridInfo.selected.find(
              (_: any) => _[me.idField] == row[me.idField]
            )
          ) {
            me.gridInfo.selected.push(row);
          }
        });
      }
    };

    /**
     * Trạng thái đang kéo thả cột chuyển vị trí cột
     */
    const dragging = ref(false);

    /** Column lấy từ props */
    const columnx = ref<any[]>([]);

    /**
     * Xử lý onBeforeMount
     */
    onBeforeMount(() => {
      let lineClampStore = localStorage.getItem("lineClamp");
      if (lineClampStore || lineClampStore == "") {
        lineClamp.value = lineClampStore;
      } else {
        lineClamp.value = "hidden-space_1";
      }
    });

    /**
     * Xử lý onMounted
     * Check nếu base ko gọi initColumns thì tự initColumns từ props
     */
    onMounted(() => {
      const me: any = proxy;
      if (me.columns?.length) {
        initColumns(me.columns);
      }
    });

    /**
     * Kiểm tra sắp xếp lại cột khi kéo thả
     */
    watch(dragging, (newVal) => {
      const me: any = proxy;
      if (newVal === false) {
        me.$nextTick(() => {
          initColumns(columnx.value);
        });
      }
    });

    /**
     * initColumns từ base
     * @param columns
     */
    const initColumns = (columns: any[]) => {
      const me = proxy;
      if (me.serial && !columns.find(_ => _.type == 'serial')) {
        columns.unshift({
          lock: true,
          width: 60,
          header: "i18nCommon.serial",
          type: "serial",
          formatType: 12,
          visible: true,
        });
      }
      columnx.value = columns.sort((a, b) => b.lock - a.lock);
      updateStickyOffset();
    };

    /**
     * Xử lý update Sticky cố định cột cho các trường
     */
    const updateStickyOffset = () => {
      const me: any = proxy;
      let offset = 16;
      if (me.multiple) {
        offset = offset + 40;
      }
      columnx.value.forEach((col) => {
        col.offset = offset;
        offset += Number(col.width);
      });
    };

    /**
     * Xử lick DoubleClickRow
     */
    const handleDoubleClickRow = (row: any) => {
      const me: any = proxy;
      me.$emit("handleDoubleClickRow", row);
    };

    /**
     * Xử lý click row
     */
    const handleClickRow = (row: any) => {
      const me: any = proxy;
      me.data.forEach((rowData: any) => {
        delete rowData.selected;
      });
      row.selected = true;
    };

    /**
     * Thêm dòng
     */
    const addRow = () => {
      const me = proxy;
      if(me.disabled) return;
      let rowData = null;
      if(me.initDataBeforeAddRow && typeof me.initDataBeforeAddRow === 'function'){
        rowData = me.initDataBeforeAddRow();
      }
      if(!rowData){
        rowData = {};
      }
      rowData[me.idField] = me.$ms.commonFn.generateUUID();
      rowData.State = me.$ms.constant.FormState.Add;
      if(me.model){
        rowData = new me.model(rowData);
      }
      me.data.push(rowData);
    }

    /**
     * Xoá dòng detail
     */
    const deleteRow = (dataRow) => {
      const me = proxy;
      if(me.disabled) return;
      if (dataRow.State != me.$ms.constant.FormState.Add){
        dataRow.State = me.$ms.constant.FormState.Delete;
      }
      else {
        let index = me.data.findIndex(_ => _[me.idField] == dataRow[me.idField]);
        if(index !== -1){
          me.data.splice(index, 1);
        }
      }
    };

    /**
     * Xoá hết dòng
     */
    const deleteAllRow = () => {
      const me = proxy;
      if(me.disabled) return;
      me.data.forEach(dataRow => {
        if (dataRow.State != me.$ms.constant.FormState.Add){
          dataRow.State = me.$ms.constant.FormState.Delete;
        }
      });
      for (let i = me.data.length - 1; i >= 0; i--) {
        const dataRow = me.data[i];
        if (dataRow.State != me.$ms.constant.FormState.Add){
          dataRow.State = me.$ms.constant.FormState.Delete;
        }
        else{
          me.data.splice(i, 1);
        }
      }
    }

    return {
      colFilter,
      columnx,
      dragging,
      isCheckedAll,
      lineClamp,
      datax,
      getData,
      addRow,
      deleteRow,
      deleteAllRow,
      resizeOn,
      resizeOff,
      updateStickyOffset,
      isSelected,
      handleShowFilter,
      changeCheckedMultiple,
      handleClickCheckbox,
      initColumns,
      handleDoubleClickRow,
      handleClickRow,
      removeSelectedAll,
    };
  },
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/component/MsGrid.scss" as style;
.table-content{
  overflow-y: hidden;
}
.table .thead-light th:not(:first-child),
.drag th:first-child {
  padding: 0 10px 0 10px;
}
.header-content-end{
  padding-right: 10px !important;
}
</style>
