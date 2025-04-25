<template>
  <!-- Item của combo không có column -->
  <li
    class="combobox-item single"
    :style="'text-align: ' + align"
    v-if="comboType === 1"
  >
    <div class="combobox-item-con">
      <div class="combobox-item--text"  :title="getTitleItemDisplay(item)">
        {{ getItemDisplay(item) }}
      </div>
    </div>
  </li>
  <tr class="combobox-item" v-else>
    <!-- Item của combo có column -->
    <td
      class="combobox-item-td"
      v-for="(column, tdIndex) in columnx"
      :ref="`td-${tdIndex}`"
      :key="column.dataField"
      :style="getCellStyleTd(column, tdIndex)"
    >
      <div
        class="combobox-item-td--contents"
        :style="getCellStyle(column, tdIndex)"
      >
        <div
          :title="getTitleItemDisplay(item, column)"
          class="combobox-item-td--text"
        >
          {{ getItemDisplay(item, column) }}
        </div>
      </div>
    </td>
  </tr>
</template>

<script>
import { defineComponent, getCurrentInstance } from 'vue';
export default defineComponent({
  name: 'MsComboBoxItem',
  props: {
    /**
     * Loại combo
     */
    comboType: {
      type: Number,
      default: 1,
    },
    /**
     * Item sử dụng để binding
     */
    item: {},

    /**
     * Cấu hình cột của menu
     */
    columnx: {
      type: Array,
      default: new Array(),
    },
    /**
     * Trường làm value
     */
    valueField: {
      type: String,
      default: null,
    },
    /**
     * Trường là display
     */
    displayField: {
      type: String,
      default: null,
    },

    align: {
      type: String,
      default: 'left',
    },
  },
  setup(props, { emit }) {
    //Variable
    const { proxy } = getCurrentInstance();

    //Method
    /**
     * Hàm lấy style cho td trong table
     * dữ liệu động theo config của dev
     */
    const getCellStyle = (column, index) => {
      if (column.isResize) {
        if (
          proxy.$refs[`td-${index}`] &&
          proxy.$refs[`td-${index}`].length > 0
        ) {
          let item = proxy.$refs[`td-${index}`][0];
          let rectTd = item.getBoundingClientRect();
          let rectParent = proxy.$parent.$el.getBoundingClientRect();
          if (rectTd.right <= rectParent.right) {
            return {
              textAlign: column.columnAlign,
            };
          } else {
            return {
              textAlign: column.columnAlign,
            };
          }
        }
      }
      return {
        textAlign: column.columnAlign,
      };
    };

    const getCellStyleTd = (column, index) => {
      if (column.isResize) {
        if (
          proxy.$refs[`td-${index}`] &&
          proxy.$refs[`td-${index}`].length > 0
        ) {
          let item = proxy.$refs[`td-${index}`][0];
          let rectTd = item.getBoundingClientRect();
          let rectParent = proxy.$parent.$el.getBoundingClientRect();
          if (rectTd.right <= rectParent.right) {
            return {
              width: rectTd.width + (rectParent.right - rectTd.right) + 'px',
              minWidth: rectTd.width + (rectParent.right - rectTd.right) + 'px',
              maxWidth: rectTd.width + (rectParent.right - rectTd.right) + 'px',
            };
          } else {
            return {
              width: `${column.width}px`,
              minWidth: `${column.width}px`,
              maxWidth: `${column.width}px`,
            };
          }
        }
      }
      return {
        width: column.isResize ? null : `${column.width}px`,
        minWidth: column.isResize ? null : `${column.width}px`,
        maxWidth: column.isResize ? null : `${column.width}px`,
      };
    };

    /**
     * Lấy text hiển thị trên item
     * Nếu có column lấy theo column.field, nếu không có column lấy theo displayField, nếu không có displayField lấy theo valueField
     */
    const getItemDisplay = (item, column) => {
      let field = column
        ? column.dataField
        : props.displayField || props.valueField;

      let value = '';
      if (field) {
        value = item[field];
      } else {
        value = item;
      }
      return value;
    };

    /**
     * Custom lại tooltip khi hover vào item
     */
    const getTitleItemDisplay = (item ,column) => {
      if(item.title){
        return item.title;
      }
      return getItemDisplay(item ,column)

    }

    return {
      getCellStyle,
      getItemDisplay,
      getCellStyleTd,
	    getTitleItemDisplay,
    };
  },
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/component/MsComboboxItem.scss" as style;
</style>
