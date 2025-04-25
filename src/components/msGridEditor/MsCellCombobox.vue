<template>
	<ms-combobox-v2
    :_isGridEditor="true"
    :valueField="propsData.valueField"
    :displayField="propsData.displayField"
    :data="propsData.data[col.dataField]"
    :initText="dataRow[col.dataField]"
    @comboboxLoadData="(payload) => { propsData.comboboxLoadData(payload, col, dataRow) }"
    @selected="selected"
    :buildFilter="(payload) => { propsData.buildFilter(payload, col, dataRow) }"
    :rules="propsData.rules"
    :queryMode="propsData.queryMode"
    :remoteFilter="propsData.remoteFilter"
    v-model="dataRow[propsData.modelValueField]"
    v-model:display="dataRow[propsData.modelDisplayField]"
    :dropdownWidth="propsData.dropdownWidth"
    :columns="propsData.columns"
    :col="col"
  ></ms-combobox-v2>
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
     * Xử lý selected combobox
     */
    const selected = (metaData, instanceCombo) => {
      const me = proxy;
      if (me.dataRow.State != me.$ms.constant.FormState.Add){
        me.dataRow.State = me.$ms.constant.FormState.Edit;
      }
      if(typeof me.propsData?.selected === 'function'){
        me.propsData.selected(metaData, instanceCombo, me.col, me.dataRow)
      }
    };

    return { 
      selected,
    };
  },
});
</script>

<style lang="scss" scoped>

</style>
