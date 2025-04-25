<template>
    <ms-dynamic-popup :width="500" :height="600" :title="`${$t('i18nChats.Title')}`" @beforeOpen="beforeOpen">
        <template v-slot:content="{ close }">
            <div ref="slot-content" class="form-content-popup">
                <div class="form-container mt-4">
                    <div class="form-detail">
                        <div class="form-item_input">
                            <div class="form-group">
                                <div v-for="data in dataChats"
                                    :class="`flex ${first_person == data.sender_id ? '' : 'right'}`">
                                    <div>
                                        <div class="info-sent flex gap-6">
                                            <p class="customer-name">{{ data.customer_name }} </p>
                                            <p>{{ getFormattedDateTime(data.sent_at) }} </p>
                                            <svg v-if="data.seen" width="16" height="16" fill="green"
                                                viewBox="0 0 24 24">
                                                <path
                                                    d="M12 4C7 4 2.7 7 1 12c1.7 5 6 8 11 8s9.3-3 11-8c-1.7-5-6-8-11-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zm0-10c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z" />
                                            </svg>
                                        </div>
                                        <p class="content-sent">{{ data.content }}</p>
                                    </div>
                                </div>
                            </div>
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
                </div>
            </div>
        </template>
    </ms-dynamic-popup>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, reactive, ref } from "vue";
import useModuleChats from "@/stores/cust/moduleChats";
import chatsAPI from "@/apis/cust/chatsAPI";
import BaseDetail from "@/views/base/BaseDetail";

export default defineComponent({
    mixins: [],
    extends: BaseDetail,
    setup() {
        const { proxy }: any = getCurrentInstance(); // Instance của component
        const storeModule: any = useModuleChats(); // Cấu hình store
        const api = ref(chatsAPI); // Cấu hình api
        const subSystemCode = ref("customer_message"); // Cấu hình phân quyền
        const dataChats = ref([]);
        const first_person = ref(null);

        const loadMenuParent = async () => {
            const me: any = proxy;
            const payload = {
                PageIndex: 0,
                PageSize: 0,
                Columns: "*",
                Filter: JSON.stringify(["chats_id", "=", me.model.message_id]),
                Sort: "sent_at ASC",
                CustomParam: { ViewName: '"CUST".cust_view_get_messages' },
            };
            me.$ms.commonFn.mask();
            const result = await chatsAPI.getList(payload);
            me.$ms.commonFn.unmask();
            dataChats.value = result.Data.PageData;
            first_person.value = result.Data.PageData[0].sender_id;
        };
        function getFormattedDateTime(date) {
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng trong JS bắt đầu từ 0
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");

            return `${day}/${month}/${year} ${hours}:${minutes}`;
        }
        const afterBindData = () => {
            loadMenuParent();
        };

        return {
            api,
            storeModule,
            subSystemCode,
            dataChats,
            first_person,
            afterBindData,
            getFormattedDateTime
        };
    },
});
</script>

<style lang="scss" scoped>
.right {
    justify-content: flex-end;
    margin-top: 10px;
}

.info-sent {
    align-items: center;
}

.customer-name {
    color: green;
}

.content-sent {
    background: #f3f3f3;
    border-radius: 5px;
    padding: 5px 10px;
    margin-top: 2px;
    max-width: 250px;
}
</style>