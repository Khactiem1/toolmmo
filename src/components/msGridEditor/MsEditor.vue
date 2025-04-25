<template>
	<div class="cell-component">
    <component
      :is="getEditorType(col)"
      :col="col"
      :dataRow="dataRow"
      :propsData="propsData"
      :disabled="disabled"
    ></component>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance } from "vue";
import MsCellInput from "@/components/msGridEditor/MsCellInput.vue";
import MsCellCombobox from "@/components/msGridEditor/MsCellCombobox.vue";
import MsCellNumber from "@/components/msGridEditor/MsCellNumber.vue";
import MsCellDatepicker from "@/components/msGridEditor/MsCellDatepicker.vue";
import MsCellCheckbox from "@/components/msGridEditor/MsCellCheckbox.vue";

export default defineComponent({
  components: {
    MsCellInput,
    MsCellCombobox,
    MsCellNumber,
    MsCellDatepicker,
    MsCellCheckbox,
  },
  props: {
    /**
     * Col của grid
     */
    col: {
      type: Object,
      default: {},
    },

    /**
     * disabled control nhập liệu
     */
    disabled: {
      default: false,
      type: Boolean,
    },

    /**
     * propsData của cell
     */
    propsData: {
      default: {},
      type: Object,
    },

    /**
     * dataRow của grid
     */
    dataRow: {
      type: Object,
      default: {},
    }
  },
  setup: () => {
    const { proxy }: any = getCurrentInstance();

    /**
     * Get ra component editor
     */
    const getEditorType = (col) => {
      const me = proxy;
      switch (col.formatType) {
				case me.$ms.constant.FormatType.List:
					return 'ms-cell-combobox';
				case me.$ms.constant.FormatType.Number:
					return 'ms-cell-number';
				case me.$ms.constant.FormatType.Date:
					return 'ms-cell-datepicker';
				case me.$ms.constant.FormatType.Text:
					return 'ms-cell-input';
				case me.$ms.constant.FormatType.Checkbox:
					return 'ms-cell-checkbox';
				default:
					return 'ms-cell-input';
			}
    };

    return { 
      getEditorType,
    };
  },
});
</script>

<style lang="scss" scoped>

</style>
