import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/bus/anoucementAPI';

const crudBase = new crudBaseStore(
    {
        field: {
            key: "anoucement_id",
            code: '',
        }
    },
    api,
);

class moduleAnoucement {
    state = () => {
        return {
            ...crudBase.state,
        }
    }
    actions = {
        ...crudBase.actions,
    }
}

const store = new moduleAnoucement();
const useStore = defineStore('moduleAnoucement', store);

export default useStore;