<template>
  <div
    :class="{ 'lang-hidden_active': !settingApp.showSidebar }"
    class="lang-hidden lang language-center border-top-lang"
  >
    <div :class="{ 'icon-vi': lang === 'vi', 'icon-en': lang === 'en' }"></div>
  </div>
  <div
    :class="{ 'switch-lang_hidden': !settingApp.showSidebar }"
    class="switch-lang language-center"
  >
    <div
      :class="{
        active: lang === 'vi',
        'border-left-lang': !settingApp.showSidebar,
      }"
      class="switch-lang_item language-center"
      @click="handleChangLang('vi')"
    >
      <div class="icon icon-vi"></div>
    </div>
    <div
      :class="{ active: lang === 'en' }"
      class="switch-lang_item language-center border-left-lang"
      @click="handleChangLang('en')"
    >
      <div class="icon icon-en"></div>
    </div>
  </div>
</template>

<script lang="ts">
import i18n from "@/i18n/i18n";
import { computed, ref, defineComponent, getCurrentInstance } from "vue";

export default defineComponent({
  props: {
    settingApp: {
      type: Object,
      default: {},
    },
  },
  setup() {
    const { proxy }: any = getCurrentInstance();
    const lang = computed(() => i18n.global.locale.value); // Lấy ra ngôn ngữ đang sử dụng

    /** Hàm thay đổi ngôn ngữ */
    const handleChangLang = (lang: string) => {
      try {
        i18n.global.locale.value = lang;
        localStorage.setItem("Lang", lang);
        window.location.reload();
      } catch (e: any) {
        console.log(e);
      }
    };

    return {
      handleChangLang,
      lang,
    };
  },
});
</script>

<style lang="scss" scoped>
.switch-lang {
  display: flex;
  color: var(--while__color);
  font-family: "notosans-bold";
  width: 100%;
  text-align: center;
  align-items: center;
  position: absolute;
  top: calc(100% - 36px);
  left: 0;
  z-index: 100;
  border-top: solid 2px transparent;
}
.lang-hidden {
  position: absolute;
  top: calc(100% - 36px);
  left: 0;
  width: 100%;
  height: 36px;
  background-color: var(--menu__color);
  border-top: solid 2px var(--primary__color);
  cursor: pointer;
  color: var(--while__color);
  font-family: "notosans-bold";
  text-align: center;
  padding: 7px 0;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease-in-out;
}
.lang-hidden:hover {
  background-color: var(--menu__color-active) !important;
}
.lang-hidden_active {
  opacity: 1;
  visibility: visible;
}
.switch-lang.switch-lang_hidden {
  width: 175px;
  left: 80px;
  visibility: hidden;
  opacity: 0;
  transition: all 0.3s ease-in-out;
}
.switch-lang.switch-lang_hidden:hover {
  visibility: visible;
  opacity: 1;
}
.switch-lang_item {
  cursor: pointer;
  height: 34px;
  padding: 7px 0;
  transition: all 0.3s ease-in-out;
  width: 50%;
  background-color: var(--primary_color-notactive);
}
.switch-lang_item:not(.active) .icon {
  opacity: 0.6;
}
.switch-lang_item:hover .icon {
  opacity: 1;
}
.switch-lang_item:hover:not(.active) {
  background-color: var(--menu__color-active) !important;
}
.switch-lang_item.active {
  background-color: var(--primary__color-active) !important;
}

.lang-hidden:hover ~ .switch-lang.switch-lang_hidden {
  visibility: visible;
  opacity: 1;
}
.icon-vi {
  width: 22px;
  height: 22px;
  min-width: 16px;
  min-height: 16px;
  cursor: pointer;
  background: var(--url__vi) no-repeat;
  background-position: center;
  background-size: contain; /* Đảm bảo icon được căn chỉnh trong khung 16x16 */
}
.icon-en {
  width: 22px;
  height: 22px;
  min-width: 16px;
  min-height: 16px;
  cursor: pointer;
  background: var(--url__en) no-repeat;
  background-position: center;
  background-size: contain; /* Đảm bảo icon được căn chỉnh trong khung 16x16 */
}
.language-center {
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
}
.border-top-lang {
  border-top: 1px solid var(--primary__color-hover);
}
.border-left-lang {
  border-left: 1px solid var(--primary__color-hover);
}
</style>
