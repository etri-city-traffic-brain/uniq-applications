import _axios from 'axios';
import config from '../../conf/config.json';

const axios = _axios.create({
  baseURL: config.axios_edge.baseURL,
  withCredentials: true,
});

export default axios;
