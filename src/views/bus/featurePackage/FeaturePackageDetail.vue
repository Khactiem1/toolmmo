<template>
    <ms-dynamic-popup 
        :width="600" 
        :height="400" 
        :title="`${editMode ? $ms.commonFn.getEnumResource(editMode, 'FormState') : ''} ${$t('i18nFeaturePackage.Title')}`" 
        @beforeOpen="beforeOpen"
    >
      <template v-slot:content="{ close }">
          <div ref="slot-content" class="form-content-popup">
              <div class="form-container mt-4">
                  <div class="form-detail ">
                    <div class="form-group">
                        <ms-input :maxLength="30" :rules="[{ name: 'required' },]"
                            :label="$t('i18nFeaturePackage.Detail.feature_package_code')"
                            v-model="model.feature_package_code"></ms-input>
                    </div>
                    <div class="form-group">
                        <ms-input :maxLength="150" :rules="[{ name: 'required' },]"
                            :label="$t('i18nFeaturePackage.Detail.feature_package_name')"
                            v-model="model.feature_package_name"></ms-input>
                    </div>
                    <div class="form-group">
                        <ms-number :label="$t('i18nFeaturePackage.Detail.sort')"
                            v-model="model.sort"></ms-number>
                    </div>
                  </div>
              </div>
          </div>
      </template>
      <template v-slot:footer="{ close }">
          <div class="form-action">
              <div class="form-action_container">
                  <div class="form-action_item">
                      <ms-button @click="close">
                          {{ $t("i18nCommon.Close") }}
                      </ms-button>
                  </div>
                  <div class="form-action_item">
                      <ms-button @click="save" class="primary">
                          {{ $t("i18nCommon.crud.save") }}
                      </ms-button>
                  </div>
              </div>
          </div>
      </template>
  </ms-dynamic-popup>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref } from "vue";
import useModuleFeaturePackage from "@/stores/bus/moduleFeaturePackage";
import featurePackageAPI from "@/apis/bus/featurePackageAPI";
import BaseDetail from "@/views/base/BaseDetail";

export default defineComponent({
    mixins: [],
    components: {
    },
    extends: BaseDetail,
    setup() {
        const { proxy }: any = getCurrentInstance(); // Instance của component
        const storeModule: any = useModuleFeaturePackage(); // Cấu hình store
        const api = ref(featurePackageAPI); // Cấu hình api
        const subSystemCode = ref("feature_package"); // Cấu hình phân quyền

        return {
            api,
            storeModule,
            subSystemCode,
        };
    },
});
</script>

<style lang="scss" scoped>

</style>