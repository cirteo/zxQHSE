import axios from 'axios';

const  xhr=axios.create({
    //当前创建实例的时候配置默认配置
    xsrfCookieName:'xsrf-token'
});

export default xhr;
