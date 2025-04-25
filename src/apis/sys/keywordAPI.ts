import baseApi from '@/apis/base/baseApi';
import httpClient from '@/apis/base/httpclient';

class keywordAPI extends baseApi {
  apiName = 'dictionary';
    controllerName = 'Keyword';
  
}

export default new keywordAPI();