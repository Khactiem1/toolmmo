import baseApi from '@/apis/base/baseApi';
import httpClient from '@/apis/base/httpclient';

class functionConfigAPI extends baseApi {
  apiName = 'dictionary';
    controllerName = 'FunctionConfig';
  
}

export default new functionConfigAPI();