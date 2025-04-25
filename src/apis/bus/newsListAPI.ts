import baseApi from '@/apis/base/baseApi';
import httpClient from '@/apis/base/httpclient';

class newsListAPI extends baseApi {
  apiName = 'dictionary';
  controllerName = 'NewsList';
  
}

export default new newsListAPI();