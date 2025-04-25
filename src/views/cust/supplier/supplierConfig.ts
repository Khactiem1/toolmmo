
import { getCurrentInstance, ref } from 'vue';
import dictionaryAPI from "@/apis/sys/dictionaryAPI";

/**
 * Cấu hình dùng chung cho cả list và detail
 */
export const useSupplierConfig = () => {
  const { proxy } = getCurrentInstance();
  const supplier_status = ref({
    TuChoi: {
      supplier_status: "TuChoi",
      supplier_status_name: "",
    },
    LuuTam: {
      supplier_status: "LuuTam",
      supplier_status_name: "",
    },
    ChoDuyet: {
      supplier_status: "ChoDuyet",
      supplier_status_name: "",
    },
    DaDuyet: {
      supplier_status: "DaDuyet",
      supplier_status_name: "",
    },
  });

  /**
   * Xử lý load mapping các trạng thái fix cứng với từ điển
   */
  const loadMappingSupplierStatus = async () => {
    const me: any = proxy;
    const payload = {
      PageIndex: 0,
      PageSize: 0,
      Columns: "*",
      Filter: "",
      Sort: "",
      CustomParam: {},
    };
    if (me.editMode == me.$ms.constant.FormState.Add){
      payload.Filter = JSON.stringify([["is_active", "=", true], "and", ["dictionary_list_code", "=", "TrangThaiDuyet"]]);
    }
    else {
      payload.Filter = JSON.stringify(["dictionary_list_code", "=", "TrangThaiDuyet"]);
    }
    me.$ms.commonFn.mask();
    const result = await dictionaryAPI.getList(payload);
    me.$ms.commonFn.unmask();
    if (result?.Success && result?.Data?.PageData?.length){
      const statusTuchoi = result.Data.PageData.find(_ => _.dictionary_value == supplier_status.value.TuChoi.supplier_status);
      const statusLuuTam = result.Data.PageData.find(_ => _.dictionary_value == supplier_status.value.LuuTam.supplier_status);
      const statusChoDuyet = result.Data.PageData.find(_ => _.dictionary_value == supplier_status.value.ChoDuyet.supplier_status);
      const statusDaDuyet = result.Data.PageData.find(_ => _.dictionary_value == supplier_status.value.DaDuyet.supplier_status);
      if(statusTuchoi){
        supplier_status.value.TuChoi.supplier_status_name = statusTuchoi.dictionary_name;
      }
      if(statusLuuTam){
        supplier_status.value.LuuTam.supplier_status_name = statusLuuTam.dictionary_name;
      }
      if(statusChoDuyet){
        supplier_status.value.ChoDuyet.supplier_status_name = statusChoDuyet.dictionary_name;
      }
      if(statusDaDuyet){
        supplier_status.value.DaDuyet.supplier_status_name = statusDaDuyet.dictionary_name;
      }
    }
  };

  return {
    supplier_status,
    loadMappingSupplierStatus,
  }
}