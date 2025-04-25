import baseApi from '@/apis/base/baseApi';
import httpClient from '@/apis/base/httpclient';

class departmentAPI extends baseApi {
  apiName = 'dictionary';
  controllerName = 'Department';
  
}

export default new departmentAPI();