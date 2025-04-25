<template>
  <div class="ms-grid-tree table-content">
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
                      'min-width': `${element.width ? element.width : 180}px`,
                      width: `${element.width}px`,
                      'max-width': `${element.width}px`,
                      position: `${element.lock ? `sticky` : ''}`,
                      left: `${element.lock ? `${element.offset}px` : ''}`,
                    }"
                  >
                    <span
                      style="display: flex; line-height: 18px"
                      :class="``"
                      @click="handleSetSortColumn(element)"
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
                      <div
                        v-if="element.sort"
                        class="sort"
                        :class="{ sortASC: element.sort === 'ASC' }"
                      ></div>
                    </span>
                    <div
                      v-if="filterable"
                      @click="handleShowFilter($event, element)"
                      class="mi-header-option"
                    ></div>
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
                style="width: 120px; min-width: 120px"
                class="text-center fix column-end"
              >
                {{ $t("i18nCommon.function") }}
              </th>
            </tr>
          </thead>
          <!-- Phần render loader table khi tải dữ liệu -->
          <ms-grid-loader
            v-if="loading"
            :columns="columnx"
            :lengthList="data.length > 20 ? 20 : data.length"
          ></ms-grid-loader>
          <!-- Phần render báo table trống khi danh sách trống -->
          <ms-grid-empty v-else-if="!loading && data.length === 0"></ms-grid-empty>
          <tbody v-else="!loading">
            <!-- Phần body table -->
            <tr
              v-for="(row, index) in datax"
              :key="idField ? row[idField] : index"
              @dblclick="handleDoubleClickRow(row)"
              @click="handleClickRow(row)"
              :class="[`${row.selected ? 'row-selected' : ''}`]"
              v-show="!row.is_hide"
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
                  ${!multiple ? `check-false` : ''}
                  ${row.is_parent ? `is-parent` : ''}
                  ${index == 0 ? `level-${row.level}` : ''}
                `"
                :key="index"
                :style="{
                  position: `${col.lock ? `sticky` : ''}`,
                  left: `${col.lock ? `${col.offset}px` : ''}`,
                }"
              >
                <div class="flex align-center">
                  <div v-if="index == 0 && !row.is_parent">
                    <div class="image-not-chid"></div>
                  </div>
                  <div v-else-if="index == 0">
                    <div
                      class="pointer"
                      :class="`
                        ${row.expand ? 'expand' : 'collapse'}
                      `"
                      @click.stop="handleExpand(row)"
                    ></div>
                  </div>
                  <slot
                    v-if="col.type === 'custom'"
                    :name="col.dataField"
                    :record="row"
                  />
                  <div
                    v-else-if="col.dataField == 'is_active'"
                    class="data-table-bind"
                    style="display: flex; justify-content: center; width: 100%;"
                  >
                    <ms-switch
                      :disabled="true"
                      v-model="row.is_active"
                    ></ms-switch>
                  </div>
                  <span v-else class="data-table-bind" :class="`${lineClamp}`">
                    {{
                      $ms.commonFn.processDataaGridViewer(
                        col,
                        row[col.dataField]
                      )
                    }}
                  </span>
                </div>
              </td>
              <!-- Phần render các chức năng tác vụ -->
              <td v-if="showAction" class="text-center fix column-end">
                <div class="action-colum_table">
                  <slot name="widget-body" :record="row" />
                </div>
              </td>
            </tr>
          </tbody>
          <!-- Phần render các chức năng tác vụ (khi click vào ô show tác vụ thì sẽ hiển thị)-->
          <teleport to="#app">
            <ms-grid-filter
              v-click-outside="() => handleShowFilter()"
              @handleFixColumn="handleFixColumn"
              :handleShowFilter="handleShowFilter"
              :col="colFilter"
              :setPositionFilter="setPositionFilter"
              v-if="isShowFilter"
            >
            </ms-grid-filter>
          </teleport>
        </table>
      </div>
    </div>
    <!-- Phần phân trang -->
    <div v-if="data.length !== 0 && pageTotal" class="paging-container sticky">
      <div class="total-record">
        {{ $t("i18nCommon.total") }} <strong>{{ pageTotal }}</strong>
        {{ $t("i18nCommon.record") }}
        <span v-if="multiple && gridInfo.selected?.length">
          -
          <span style="color: var(--primary__color)">{{
            $t("i18nControl.MsGridViewer.selected")
          }}</span>
          <strong style="padding: 0 4px">{{ gridInfo.selected.length }}</strong>
          <span style="color: var(--primary__color)">{{
            $t("i18nCommon.record")
          }}</span>
          -
          <span @click="removeSelectedAll" class="remove-selected-all">{{
            $t("i18nControl.MsGridViewer.removeSelectedAll")
          }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import MsPagination from "./MsPagination.vue";
import MsGridEmpty from "./MsGridEmpty.vue";
import MsGridLoader from "./MsGridLoader.vue";
import MsGridFilter from "./MsGridFilter.vue";
import {
  watch,
  toRefs,
  ref,
  getCurrentInstance,
  computed,
  defineComponent,
  onMounted,
  onBeforeMount,
  onUnmounted,
} from "vue";
import draggable from "vuedraggable";
import moment from "moment";
import { useColumnResize } from "@/setup/grid/resizeColumn";
import EventBusGlobal, { GlobalEventName } from "@/commons/eventBusGlobal";
import { isEqual } from "lodash-es";

export default defineComponent({
  components: {
    MsPagination,
    MsGridEmpty,
    MsGridLoader,
    MsGridFilter,
    draggable,
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
     * Tổng số bản ghi
     */
    pageTotal: {
      type: Number,
      default: 0,
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
     * Trạng thái loading Page
     */
    loading: {
      type: Boolean,
      default: false,
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
      default: "",
    },

    /**
     * id lưu cha
     */
    parentIdField: {
      type: String,
      default: "parent_id",
    },

    /**
     * sort theo trường gì
     */
    sort: {
      type: String,
      default: "sort",
    },

    /**
     * Có check all hay không
     */
    multiple: {
      type: Boolean,
      default: true,
    },

    /**
     * Có filter table không
     */
    filterable: {
      type: Boolean,
      default: true,
    },

    /**
     * Có paging hay không
     */
    pagination: {
      type: Boolean,
      default: true,
    },

    /**
     * Hàm load data filter
     */
    loadData: {
      type: Function,
      default: () => {},
    },
  },
  setup(props) {
    const { proxy }: any = getCurrentInstance();
    const colFilter = ref({}); // Dữ liệu cột đang thực hiện show filter
    const { resizeOn, resizeOff, handleShowFilter } = useColumnResize();
    const lineClamp = ref<any>(""); // Số dòng hiển thị dữ liệu trên 1 row;
    const { data } = toRefs(props); // Dữ liệu binding
    const datax = ref<any[]>([]);

    watch(
      data,
      (newVal: any[], oldVal: any[]) => {
        const me: any = proxy;
        if (me.cacheData && newVal) {
          const dataCompare = newVal.map((_: any) => {
            return {
              ..._,
              expand: null,
              is_hide: null,
              is_parent: null,
              level: null,
              selected: null,
              modified_date: null,
              deleted_date: null,
              created_date: null,
              list_permission: null,
            };
          });
          if (isEqual(dataCompare, JSON.parse(me.cacheData))) {
            return;
          }
        }
        if (data.value) {
          me.cacheData = JSON.stringify(
            data.value.map((_: any) => {
              return {
                ..._,
                expand: null,
                is_hide: null,
                is_parent: null,
                level: null,
                selected: null,
                modified_date: null,
                deleted_date: null,
                created_date: null,
                list_permission: null,
              };
            })
          );
        }
        datax.value = me.$ms.commonFn.sortMenuAndAddLevel(
          data.value,
          me.parentIdField,
          me.idField,
          me.sort
        );
      },
      { deep: true }
    );

    /**
     * Xử lý expand cha con
     */
    const handleExpand = (dataRow: any) => {
      const me: any = proxy;
      dataRow.expand = !dataRow.expand;
      me.$ms.commonFn.updateChildrenIsHide(
        !dataRow.expand,
        datax.value,
        me.parentIdField,
        me.idField,
        dataRow[me.idField]
      );
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
      EventBusGlobal.$on(
        GlobalEventName.updateTheSettingClamp,
        haneleUpdateLineClamp
      );
    });

    /**
     * Xử lý onUnmounted
     */
    onUnmounted(() => {
      EventBusGlobal.$off(
        GlobalEventName.updateTheSettingClamp,
        haneleUpdateLineClamp
      );
    });

    /**
     * Update cờ hiển thị số dòng trên grid
     */
    const haneleUpdateLineClamp = (lineClampStore: any) => {
      if (lineClampStore || lineClampStore == "") {
        lineClamp.value = lineClampStore;
      } else {
        lineClamp.value = "hidden-space_1";
      }
    };

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
      datax.value.forEach((rowData: any) => {
        delete rowData.selected;
      });
      me.data.forEach((rowData: any) => {
        if (row[me.idField] === rowData[me.idField]) {
          row.selected = true;
        } else {
          delete rowData.selected;
        }
      });
      row.selected = true;
    };

    /**
     * hàm lưu số lượng bản ghi muốn hiển thị vào local
     * Khắc Tiềm - 08.03.2023
     */
    const setPageSize = async (record: number) => {
      const me: any = proxy;
      me.gridInfo.pageIndex = 1;
      me.gridInfo.pageSize = record;
      localStorage.setItem("pageSize", `${record}`);
      me.loadData();
    };

    /**
     * Chuyển trang
     */
    const loadPageIndex = (value: any) => {
      const me: any = proxy;
      me.gridInfo.pageIndex = value;
      me.loadData();
    };

    /**
     * SL bản ghi trên 1 trang đang v-model combobox
     */
    const currentPage = ref(proxy.gridInfo.pageSize);

    watch(currentPage, (newValue) => {
      setPageSize(newValue);
    });
    /**
     * Trạng thái hiển thị ô lọc
     */
    const isShowFilter: any = ref(false);

    /**
     * Set vị trị của form filter
     */
    const setPositionFilter: any = ref({ top: 0, left: 0 });

    const handleFixColumn = (col: any) => {
      col.lock = !col.lock;
      isShowFilter.value = false;
      initColumns(columnx.value);
    };

    /**
     * Hàm xử lý sắp xếp
     */
    const handleSetSortColumn = async (col: any) => {
      const me: any = proxy;
      if (!col.sort) {
        col.sort = "DESC";
      } else if (col.sort == "DESC") {
        col.sort = "ASC";
      } else {
        delete col.sort;
      }
      me.loadData();
    };

    /**
     * Xử lý build tham số sort grid
     */
    const buildSortFilter = () => {
      let me: any = proxy,
        result: any[] = [],
        columns: any[] = me.columnx.filter((_: any) => _.sort); //me.columnx;
      columns.forEach((col: any) => {
        result.push(`${col.dataField} ${col.sort}`);
      });
      return result.join(",");
    };

    /**
     * Đọc điều kiện filter header
     */
    const getFilterHeader = (hasColumn = false) => {
      let me: any = proxy,
        result: any[] = [],
        enumFilterHeader: any = me.$ms.constant.FilterOperator,
        columns: any = me.columnx.filter((_: any) => _.filter); //me.columnx;

      for (let i = 0; i < columns.length; i++) {
        let column = columns[i];
        if (column.filter && column.filter.value !== column.filterIgnoreValue) {
          let item: any = null,
            filterValue: any = column.filter.value,
            operator: any = column.filter.operator;
          // ldlong: Check trước khi xử lý chuỗi (do filterValue có thể là dạng số trường hợp cột Enum)
          if (filterValue && typeof filterValue == "string") {
            filterValue = filterValue
              .replaceAll("\\", "\\\\\\\\")
              .replaceAll("%", "\\%")
              .trim();
          }
          switch (operator) {
            case enumFilterHeader.Between:
              item = [
                {
                  field: column.dataField,
                  operator: enumFilterHeader.GreaterThanEquals,
                  value: column.filter.from,
                },
                {
                  field: column.dataField,
                  operator: enumFilterHeader.LessThanEquals,
                  value: column.filter.to,
                },
              ];
              break;
            case enumFilterHeader.Null:
            case enumFilterHeader.NotNull:
              item = {
                field: column.dataField,
                operator: operator,
              };

              //với cột text sẽ fix giá trị để lên server sẽ xử lý thêm kiểm tra với giá trị trống ''
              switch (column.formatType) {
                case me.$ms.constant.FormatType.Text:
                  item.value = "text";
                  break;
              }
              break;
            case enumFilterHeader.Contains:
            case enumFilterHeader.Notcontains:
            case enumFilterHeader.StartsWith:
            case enumFilterHeader.EndsWith:
              if (
                typeof filterValue !== "undefined" &&
                filterValue !== null &&
                filterValue !== ""
              ) {
                item = {
                  field: column.dataField,
                  operator: operator,
                  value: filterValue,
                };
              }
              break;
            default:
              switch (column.formatType) {
                case me.$ms.constant.FormatType.Date:
                  if (filterValue) {
                    item = {
                      field: column.dataField,
                      value: moment(filterValue).format("YYYY-MM-DDTHH:mm:ss"), //moment(filterValue).format('YYYY-MM-DD'),
                      operator: operator,
                    };
                  }
                  break;
                default:
                  if (
                    typeof filterValue !== "undefined" &&
                    filterValue !== null
                  ) {
                    item = {
                      field: column.dataField,
                      value: filterValue,
                      operator: operator,
                    };
                  }
                  break;
              }
              break;
          }

          //xử lý tình huống enum của cột không chứa giá trị thì khỏi filter
          if (
            item &&
            (column.enumName || column.enum) &&
            !Array.isArray(item)
          ) {
            let enumObj = me.$ms.constant[column.enumName || column.enum],
              hasValue = false;
            for (let i in enumObj) {
              if (enumObj[i] === item.value) {
                hasValue = true;
                break;
              }
            }
            if (!hasValue) {
              item = null;
            }
          }

          if (item) {
            //Thêm xử lý lại đoạn Between
            if (Array.isArray(item)) {
              for (let i = 0; i < item.length; i++) {
                const data = item[i];
                if (hasColumn) {
                  data.column = column;
                }
                if (column.nullToFail) {
                  data.nullToFail = column.nullToFail;
                }
                if (result.length > 0) {
                  result.push("and");
                }
                result.push([data.field, data.operator, data.value]);
              }
            } else {
              if (hasColumn) {
                item.column = column;
              }
              if (column.nullToFail) {
                item.nullToFail = column.nullToFail;
              }
              if (result.length > 0) {
                result.push("and");
              }
              if (column.formatType == me.$ms.constant.FormatType.Text) {
                if (item.operator == enumFilterHeader.Null) {
                  let condition = [];
                  condition.push([item.field, item.operator, item.value]);
                  condition.push("or");
                  condition.push([item.field, "=", ""]);
                  result.push(condition);
                } else if (item.operator == enumFilterHeader.NotNull) {
                  let condition = [];
                  condition.push([item.field, item.operator, item.value]);
                  condition.push("and");
                  condition.push([item.field, "<>", ""]);
                  result.push(condition);
                } else {
                  result.push([item.field, item.operator, item.value]);
                }
              } else {
                result.push([item.field, item.operator, item.value]);
              }
            }
          }
        }
      }

      if (me.customFilter) {
        if (Array.isArray(me.customFilter)) {
          result = result.concat(me.customFilter);
        }

        /** Custom lọc grid */
        if (typeof me.customFilter == "function") {
          result = me.customFilter(result);
        }
      }
      return result;
    };

    return {
      datax,
      colFilter,
      currentPage,
      columnx,
      dragging,
      isCheckedAll,
      isShowFilter,
      setPositionFilter,
      lineClamp,
      resizeOn,
      resizeOff,
      updateStickyOffset,
      isSelected,
      loadPageIndex,
      handleSetSortColumn,
      handleShowFilter,
      buildSortFilter,
      getFilterHeader,
      changeCheckedMultiple,
      handleClickCheckbox,
      initColumns,
      handleFixColumn,
      handleDoubleClickRow,
      handleClickRow,
      removeSelectedAll,
      handleExpand,
    };
  },
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/component/MsGrid.scss" as style;
.image-not-chid {
  height: 24px;
  width: 24px;
}
.pointer {
  margin-right: 4px;
  width: 20px;
  height: 20px;
  cursor: pointer;
  background: var(--url__icon) no-repeat;
  &.expand {
    background-position: -558px -310px;
  }
  &.collapse {
    background-position: -606px -310px;
  }
}
</style>
