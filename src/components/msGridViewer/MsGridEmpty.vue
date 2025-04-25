<template>
  <div class="table-empty sticky">
    <img
      src="../../assets/image/bg_report_nodata.76e50bd8.svg"
      class="table-empty_icon"
      alt=""
    />
    <span>{{ $t('i18nCommon.dataEmpty') }}</span>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.table-empty {
  width: 40px;
  padding-bottom: 1rem;
  left: 45%;
  display: flex;
  flex-direction: column;
  span {
    padding-left: 13px;
    white-space: nowrap;
  }
}
.table-empty_icon {
  width: 132px;
  height: 74px;
  margin: 50px 0 30px 0;
}
</style>
