import crudBaseStore from "@/stores/crudBaseStore";
import api from '@/apis/sys/dictionaryListAPI';
import { defineStore } from 'pinia'

const crudBase = new crudBaseStore(
    {
        field: {
            key: "dictionary_list_id",
            code: 'dictionary_list_code',
        }
    }, 
    api,
);

class moduleDictionaryList {
    state = () => {
        return {
            ...crudBase.state,
        }
    }
    actions = {
        ...crudBase.actions,
    }
}

const store = new moduleDictionaryList();
const useStore = defineStore('moduleDictionaryList', store);

export default useStore;