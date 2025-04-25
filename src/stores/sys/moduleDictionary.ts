import { defineStore } from "pinia";
import crudBaseStore from "@/stores/crudBaseStore";
import api from '@/apis/sys/dictionaryAPI';

const crudBase = new crudBaseStore(
    {
        field: {
            key: "dictionary_id",
            code: 'dictionary_code',
        }
    }, 
    api,
);

class moduleDictionary {
    state = () => {
        return {
            ...crudBase.state,
        }
    }
    actions = {
        ...crudBase.actions,
    }
}

const store = new moduleDictionary();
const useStore = defineStore('moduleDictionary', store);

export default useStore;