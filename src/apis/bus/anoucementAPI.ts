import baseApi from '@/apis/base/baseApi';
import httpClient from '@/apis/base/httpclient';

class anoucementAPI extends baseApi {
    apiName = 'dictionary';
    controllerName = 'Anoucement';

}

export default new anoucementAPI();