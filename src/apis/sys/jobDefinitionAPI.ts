import baseApi from '@/apis/base/baseApi';
import httpClient from '@/apis/base/httpclient';

class jobDefinitionAPI extends baseApi {
  apiName = 'dictionary';
  controllerName = 'JobDefinition';
  
}

export default new jobDefinitionAPI();