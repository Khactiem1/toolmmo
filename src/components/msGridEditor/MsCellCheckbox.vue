<template>
  <div class="flex flex-center">
    <ms-checkbox
      :disabled="disabled || !col.editable"
      v-model="dataRow[col.dataField]"
      @custom-handle-click-checkbox-with-value="change"
    ></ms-checkbox>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance } from "vue";

export default defineComponent({
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
     * Xử lý change cell input
     */
    const change = (value) => {
      const me = proxy;
      if (me.dataRow.State != me.$ms.constant.FormState.Add){
        me.dataRow.State = me.$ms.constant.FormState.Edit;
      }
      if(typeof me.propsData?.change === 'function'){
        me.propsData.change(value, me.col, me.dataRow)
      }
    };

    return { 
      change,
    };
  },
});
</script>

<style lang="scss" scoped>

</style>
