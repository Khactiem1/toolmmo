<template>
	<ms-input
    :_isGridEditor="true"
    :maxLength="propsData.maxLength"
    :rules="propsData.rules"
    v-model="dataRow[col.dataField]"
    @change="change"
    :col="col"
  ></ms-input>
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
    const change = (param) => {
      const me = proxy;
      if (me.dataRow.State != me.$ms.constant.FormState.Add){
        me.dataRow.State = me.$ms.constant.FormState.Edit;
      }
      if(typeof me.propsData?.change === 'function'){
        me.propsData.change(param, me.col, me.dataRow)
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
