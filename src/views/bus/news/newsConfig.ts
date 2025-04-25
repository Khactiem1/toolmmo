
import { getCurrentInstance, ref } from 'vue';
import dictionaryAPI from "@/apis/sys/dictionaryAPI";

/**
 * Cấu hình dùng chung cho cả list và detail
 */
export const useNewsConfig = () => {
  const { proxy } = getCurrentInstance();
  const news_status = ref({
    TuChoi: {
      news_status: "TuChoi",
      news_status_name: "",
    },
    LuuTam: {
      news_status: "LuuTam",
      news_status_name: "",
    },
    ChoDuyet: {
      news_status: "ChoDuyet",
      news_status_name: "",
    },
    DaDuyet: {
      news_status: "DaDuyet",
      news_status_name: "",
    },
  });

  /**
   * Xử lý load mapping các trạng thái fix cứng với từ điển
   */
  const loadMappingNewStatus = async () => {
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
      const statusTuchoi = result.Data.PageData.find(_ => _.dictionary_value == news_status.value.TuChoi.news_status);
      const statusLuuTam = result.Data.PageData.find(_ => _.dictionary_value == news_status.value.LuuTam.news_status);
      const statusChoDuyet = result.Data.PageData.find(_ => _.dictionary_value == news_status.value.ChoDuyet.news_status);
      const statusDaDuyet = result.Data.PageData.find(_ => _.dictionary_value == news_status.value.DaDuyet.news_status);
      if(statusTuchoi){
        news_status.value.TuChoi.news_status_name = statusTuchoi.dictionary_name;
      }
      if(statusLuuTam){
        news_status.value.LuuTam.news_status_name = statusLuuTam.dictionary_name;
      }
      if(statusChoDuyet){
        news_status.value.ChoDuyet.news_status_name = statusChoDuyet.dictionary_name;
      }
      if(statusDaDuyet){
        news_status.value.DaDuyet.news_status_name = statusDaDuyet.dictionary_name;
      }
    }
  };

  return {
    news_status,
    loadMappingNewStatus,
  }
}