import baseApi from '@/apis/base/baseApi';
import httpClient from '@/apis/base/httpclient';

class dataControlAPI extends baseApi {
    apiName = 'dictionary';
    controllerName = 'DataControl';

    /**
     * get detail table
     */
    getRecordByTableName(payload: any) {
        let request = {
            url: [this.getAPIUrl(), 'get-info-table'].join('/'),
            data: payload,
        };

        return httpClient.postAsync(request);
    }

    /**
     * Xóa cứng trong database
     */
    deleteDataControl(payload: any) {
        let request = {
            url: [this.getAPIUrl(), 'delete-data-control'].join('/'),
            data: payload,
        };
        return httpClient.postAsync(request, true);
    }

    /**
     * Khôi phục dữ liệu
     */
    restoreData(payload: any) {
        let request = {
            url: [this.getAPIUrl(), 'restore-data-control'].join('/'),
            data: payload,
        };
        return httpClient.postAsync(request, true);
    }

    /**
     * Xóa cứng trong database
     */
    deleteDataControlBySchema(payload: any) {
        let request = {
            url: [this.getAPIUrl(), 'delete-data-control-by-schema-name'].join('/'),
            data: payload,
        };
        return httpClient.postAsync(request, true);
    }

    /**
     * Khôi phục dữ liệu
     */
    restoreDataBySchema(payload: any) {
        let request = {
            url: [this.getAPIUrl(), 'restore-data-control-by-schema-name'].join('/'),
            data: payload,
        };
        return httpClient.postAsync(request, true);
    }
}

export default new dataControlAPI();