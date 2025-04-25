<template>
  <div
    class="combo-dropdown-panel"
    :style="dropdownStyles"
    ref="dropdownContainer"
  >
    <div
      ref="menuBodyCon"
      class="dropdown-body-container scroller-overlay"
      @scroll.stop="onDropdownMenuScroll"
      :style="dropdownBodyStyle"
      v-if="!loading"
    >
      <!-- Phần header của menu khi có grid-->
      <table
        class="dropdown-table"
        v-if="columnx && columnx.length > 0"
      >
        <thead class="dropdown-header">
          <tr>
            <th
              class="dropdown-header__th"
              v-for="(column, index) in columnx"
              :key="index"
              :title="column.tooltip"
              :style="getThStyle(column)"
            >
              <span>{{ column.title }}</span>
            </th>
          </tr>
        </thead>
        <tbody class="dropdown-items">
          <slot></slot>
        </tbody>
      </table>
      <ul class="dropdown-items" v-else-if="comboType === 1">
        <slot></slot>
      </ul>
      <!-- Phần nội dung grid combo có columns và combo tree -->
      <table class="dropdown-table" v-else>
        <tbody class="dropdown-items">
          <slot></slot>
        </tbody>
      </table>
    </div>

    <!-- Hiển thị loading khi chưa có dữ liệu -->
    <div class="dropdown--loading" v-if="loading">
      <div class="loading-svg">
        <div class="effect-1 effects"></div>
      </div>
    </div>

    <!-- Show thông báo khi không có dữ liệu hiển thị -->
    <div class="no-data-display" v-else-if="showEmptyText" @click.stop>
      <div class="no-data-display__text">
        {{ $t('i18nCommon.dataEmpty') }}
      </div>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  computed,
  getCurrentInstance,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue';
export default defineComponent({
  name: 'MsComboBoxDropdown',
  props: {
    /**
     * Loại combo sử dụng để style cột
     */
    comboType: {
      type: Number,
      default: 1,
    },
    /**
     * Số lượng item hiển thị ở dropdown
     */
    maxItemsDisplay: {
      type: Number,
      default: 8,
    },

    /**
     * Các cột của dropdown
     */
    columnx: {
      type: Array,
      default() {
        return [];
      },
    },

    /**
     * Trạng thái `loading`
     */
    loading: {
      type: Boolean,
      default: false,
    },
    /**
     * Độ rộng phần dropdown, nếu bằng <=0 hoặc Auto sẽ tự động tính toán
     * CreatedBy PDKIEN 09/12/2019
     */
    dropdownWidth: {
      type: [Number, String],
      default: 0,
    },
    /**
     * Có hiển thị empty text không
     */
    showEmptyText: {
      type: Boolean,
      default: false,
    },
    topx: {
      type: Number,
      default: null,
    },
    leftx: {
      type: Number,
      default: null,
    },
    maxWidthx: {
      type: Number,
      default: null,
    },
    minWidthx: {
      type: Number,
      default: null,
    },
    /**
     * vị trí bản ghi được chọn trước đó
     */
    highlighIndex: {
      type: Number,
      default: null,
    },
    /**
     * vị trí scroll cũ
     */
    scrollTop: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { emit }) {
    // Variable
    let containerWidth = 0;
    const { proxy } = getCurrentInstance();
    let menuBodyCon = ref();
    let dropdownContainer = ref();

    //Method
    /**
     * Hàm lấy style cho th trong table
     * dữ liệu động theo config của dev
	 * Thêm backgroud nếu ai muốn custom màu của tiêu đề
     */
    const getThStyle = (column) => {
      return {
        width: column.isResize ? null : `${column.width}px`,
        minWidth: column.isResize ? null : `${column.width}px`,
        maxWidth: column.isResize ? null : `${column.width}px`,
        textAlign: column.columnAlign,
		    background: column.background,
      };
    };

    /**
     * Xử lý sự kiện click bất kỳ đâu trên document
     */
    const onDocumentClick = (event) => {
      let targetCombo = event.target.closest('.ms-combo'),
        comboEl = proxy.$parent.$el;

      if (targetCombo !== comboEl) {
        proxy.$parent.collapse();
      }
    };

    /**
     * Sự kiện khi scroll dropdown menu
     */
    const onDropdownMenuScroll = (e) => {
      let target = e.target;
      // kiểm tra nếu scroll to bottom -> emit để combobox load thêm dữ liệu
      if (target.scrollTop >= target.scrollHeight - target.offsetHeight) {
        emit('scrollend');
      }

      proxy._scrollTop = target.scrollTop;
    };

    /**
     * Xử lý sự kiện scroll document
     * - Đóng menu
     */
    const onDocumentScroll = (event) => {
      const comboMenu = event.target.closest('.combo-dropdown-panel');
      if (!comboMenu || comboMenu !== proxy.$el) {
        //thêm kiểm tra để sửa lỗi khi combobox.innerText dài quá sẽ không expand dc
        if (
          event.target &&
          proxy.$parent &&
          proxy.$parent.$refs.input &&
          event.target === proxy.$parent.$refs.input
        ) {
          return;
        }

        proxy.$parent.collapse();
      }
    };

    const onWindowResize = () => {
      proxy.$parent?.collapse();
    };

    const headerWidth = computed(() => {
      let width = 0;
      if (containerWidth) {
        width = containerWidth;
      } else if (props.columnx && props.columnx.length > 0) {
        for (let index = 0; index < props.columnx.length; index++) {
          const element = props.columnx[index];
          if (element.width) {
            width = width + element.width;
          }
        }
      }
      return width;
    });

    const dropdownStyles = computed(() => {
      let width = headerWidth,
        docWidth = document.body.clientWidth,
        left = props.leftx;
      if (left + width + props.dropdownWidth > docWidth) {
        left = left - (width + left + props.dropdownWidth - docWidth);
      }

      let res = {
        top: props.topx + 'px',
        // left: left + "px",
        minWidth: props.minWidthx + 'px',
        maxWidth: props.maxWidthx + 'px',
      };

      if (left + width >= docWidth) {
        res.right = '10px';
      } else {
        res.left = left + 'px';
      }

      return res;
    });
    /**
     * Set lại chiều cao tối đa của dropdown nếu số lượng item hiển thị khác default
     */
    const dropdownBodyStyle = computed(() => {
      let style = {
        maxHeight: `${(props.maxItemsDisplay * 32) + 32}px`,
      };
      return style;
    });

    onMounted(() => {
      // Thêm event click vào document
      document.addEventListener('scroll', onDocumentScroll, true);
      window.addEventListener('resize', onWindowResize);
      //highlight
      if (props.scrollTop > 0 && menuBodyCon.value) {
        menuBodyCon.value.scrollTop = props.scrollTop;
      } else if (props.highlighIndex > -1) {
        const row = proxy.$el.querySelector('tr.combobox-item');
        if (row) {
          const rowHeight = row.getBoundingClientRect().height;
          let top = props.highlighIndex * Number.parseInt(rowHeight);
          menuBodyCon.value.scrollTop = top;
        }
      }

      nextTick(() => {
        if (dropdownContainer.value) {
          containerWidth = dropdownContainer.value.clientWidth;
        }
      });
    });

    onBeforeUnmount(() => {
      document.removeEventListener('scroll', onDocumentScroll, true);
      window.removeEventListener('resize', onWindowResize);
      emit('update:scrollTop', proxy._scrollTop);
    });

    return {
      menuBodyCon,
      dropdownContainer,
      headerWidth,
      dropdownStyles,
      dropdownBodyStyle,
      getThStyle,
      onDocumentClick,
      onDropdownMenuScroll,
    };
  },
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/component/MsComboboxDropdown.scss" as style;
</style>
