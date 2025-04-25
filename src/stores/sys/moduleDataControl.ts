import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/sys/dataControlAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "table_name",
      code: '',
    }
  },
  api,
);

class moduleDataControl {
    state = () => {
        return {
            ...crudBase.state,
        }
    }
    actions = {
        ...crudBase.actions,

        /**
         * Xóa dữ liệu dưới db
         */
        async deleteDataControlBySchema(payload: any) {
            const me: any = this;
            let keyField = me._config.field.key;
            if(keyField){
                let res = await api.deleteDataControlBySchema([payload]);
                if (res && res.Success) {
                    //cập nhật danh sách
                    let index = me.items.findIndex((_: any) => _[keyField] == payload[keyField]);
                    if (index !== -1){
                        me.items.splice(index, 1);
                        me.total -= 1;
                    }
                }
                return res;
            }
        },

        /**
         * Khôi phục dữ liệu
         */
        async restoreDataBySchema(payload: any) {
            const me: any = this;
            let keyField = me._config.field.key;
            if(keyField){
                let res = await api.restoreDataBySchema([payload]);
                if (res && res.Success) {
                    //cập nhật danh sách
                    let index = me.items.findIndex((_: any) => _[keyField] == payload[keyField]);
                    if (index !== -1){
                        me.items.splice(index, 1);
                        me.total -= 1;
                    }
                }
                return res;
            }
        },
    }
}

const store = new moduleDataControl();
const useStore = defineStore('moduleDataControl', store);

export default useStore;