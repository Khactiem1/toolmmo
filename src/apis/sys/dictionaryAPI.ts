import baseApi from '@/apis/base/baseApi';
import httpclient from '../base/httpclient';
import axios from 'axios';

class dictionaryAPI extends baseApi {
  apiName = 'dictionary';
  controllerName = 'Dictionary';
  
  /**
   * Tải file lên server
   */
  async showMail(payload: any) {
    
    // Gửi file lên server
    return await axios.post('https://tools.dongvanfb.net/api/get_messages_oauth2', payload, {
      // headers: {
      //   'Content-Type': 'multipart/form-data',
      //   'Authorization': `Bearer ${user.access_token}`,
      // }
    })
  }

}

export default new dictionaryAPI();