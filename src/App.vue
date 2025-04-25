<template>
  <div class="wrapper">
    <router-view></router-view>
    <modals-container></modals-container>
    <dialog-wrapper />
    <the-top-message-list></the-top-message-list>
  </div>
  <div id="mloading" class="loading">
    <ms-loading></ms-loading>
    <!-- <div class="loading-cover loading-cover-amis"></div>
    <div class="loading-svg loading-amis">
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { DialogWrapper } from "vue3-promise-dialog";
import MsLoading from "@/components/loading/MsLoading.vue";
import TheTopMessageList from "@/components/toast/TheTopMessageList.vue";

</script>

<style lang="scss" scoped>

</style>
