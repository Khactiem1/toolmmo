import baseApi from '@/apis/base/baseApi';
import httpClient from '@/apis/base/httpclient';

class newsAPI extends baseApi {
  apiName = 'dictionary';
  controllerName = 'News';
  
}

export default new newsAPI();