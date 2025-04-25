import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/bus/footerAPI';

const crudBase = new crudBaseStore(
    {
        field: {
            key: "footer_id",
            code: '',
        }
    },
    api,
);

class moduleFooter {
    state = () => {
        return {
            ...crudBase.state,
        }
    }
    actions = {
        ...crudBase.actions,
    }
}

const store = new moduleFooter();
const useStore = defineStore('moduleFooter', store);

export default useStore;