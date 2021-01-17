import xhr from "./config"

export function get(url,params) {
    return xhr({
        method:'GET',
        url:url,
        headers:{'Content-Type':'application/json;charset=utf-8'},
        data:{},
        params:params
    })
}

export function postInstance(url,data) {
    return xhr({
        method:'POST',
        url:url,
        headers:{'Content-Type':'application/json;charset=utf-8'},
        data:data,
        params:{}
    })
}

export  function post(url,params) {
    return xhr({
        method:'POST',
        url:url,
        headers:{'Content-Type':'application/json;charset=utf-8'},
        params:params
    })
}
