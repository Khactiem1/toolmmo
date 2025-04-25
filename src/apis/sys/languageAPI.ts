import baseApi from '@/apis/base/baseApi';
import httpClient from '@/apis/base/httpclient';

class languageAPI extends baseApi {
  apiName = 'dictionary';
  controllerName = 'Language';
  
}

export default new languageAPI();