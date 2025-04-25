import baseApi from '@/apis/base/baseApi';
import httpClient from '@/apis/base/httpclient';

class footerAPI extends baseApi {
    apiName = 'dictionary';
    controllerName = 'Footer';

}

export default new footerAPI();