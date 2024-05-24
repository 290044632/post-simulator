/**
 * 初始化函数
 */
window.onload = function () {
    getElementByName("post-button").onclick = function () {
        let config = getRequestConfig();
        console.log(config);
        ajaxSubmit(config, (target) => {
            getElementByName("responseDataType").value = target.responseType || 'text';
            getElementByName("statusCode").value = target.status + " " + target.statusText;
            getElementByName("responseData").value = target.responseText;
        },(e)=>{
            getElementByName("responseDataType").value="";
            getElementByName("statusCode").value = "";
            getElementByName("responseData").value = "";
        });
    }
}
/**
 * 获取请求参数
 * @returns {object}
 */
function getRequestConfig() {
    let config = {};
    config.method = getElementByName("method").value;
    config.url = getElementByName("url").value;
    let dataType = getRadioValue("dataType");
    config.headers = {
        "Content-Type": dataType
    };
    let headerValue = getElementByName("headers").value;
    if (headerValue) {
        let hdarrs = headerValue.split("\n");
        hdarrs.forEach(ele => {
            let eles = ele.split("=");
            config.headers[eles[0]] = eles[1];
        });
    }
    let param = getElementByName("params").value;
    let convertType = getRadioValue("convertType");
    if (param) {
        if (convertType == "") {
            config.data = param;
        } else if (convertType == 'json' || dataType == 'application/json') {
            config.data = string2Json(param);
        } else if (convertType = 'urlencoded' || dataType == 'application/x-www-form-urlencoded') {
            config.data = string2Urlencoded(param);
        }
    }
    return config;
}

/**
 * 将参数字符串转换为JSON对象
 * @param {string} param 参数字符串
 * @returns {JSON}
 */
function string2Json(param) {
    try {
        return JSON.parse(param);
    } catch (e) {
        try {
            return line2Json(param);
        } catch (error) {
            return param;
        }
    }
}

/**
 * 将参数字符串转换为URL参数格式(key=value[&key=value,......])字符串
 * @param {string} param 参数字符串
 * @returns 
 */
function string2Urlencoded(param) {
    try {
        let pjson = JSON.parse(param);
        let params = [];
        let v;
        for (let key in pjson) {
            v = pjson[key];
            params.push(`${key}=${encodeURIComponent(v)}`);
        }
        return params.join("&");
    } catch (e) {
        try {
            return line2Urlencoded(param);
        } catch (error) {
            return param;
        }
    }
}
/**
 * 将URL参数字符串(key=value[&key=value,......])转换为JSON对象
 * @param {string} param 参数字符串
 * @returns {JSON}
 */
function url2JsonPairs(param) {
    let reg = /([^&?]*)=([^&]*)/g;
    let res = param.match(reg);
    if (res) {
        let params = {};
        let query;
        for (const key in res) {
            query = res[key].split('=');
            params[query[0]] = query[1];
        }
        return params;
    }
}
/**
 * 按行(\n)分割参数并拼接(&)为JSON对象
 * @param {string} param 参数字符串
 * @returns {JSON}
 */
function line2Json(param) {
    let params = {};
    let pairs = param.split("\n");
    let urlParams;
    pairs.forEach(ele => {
        urlParams = url2JsonPairs(ele);
        if (urlParams) {
            for (let key in urlParams) {
                params[key] = urlParams[key];
            }
        }
    });
    return params;
}
/**
 * 按行(\n)分割参数并拼接(&)为URL参数字符串
 * @param {string} param 参数字符串
 * @returns 
 */
function line2Urlencoded(param) {
    let pairs = param.split("\n");
    return pairs.join("&");
}
/**
 * ajax请求
 * @param {object} config 配置信息
 * @param {Function} fn 回调函数
 */
function ajaxSubmit(config = {}, fn,befFn) {
    let ajaxClient = new XMLHttpRequest();
    ajaxClient.open(config.method || "GET", config.url);
    if (config.headers) {
        let headers = config.headers;
        for (let key in headers) {
            ajaxClient.setRequestHeader(key, headers[key]);
        }
    }
    ajaxClient.onload = function (e) {
        let target = e.target;
        console.log(target);
        if (target.readyState == 4) {
            if (fn && typeof fn == "function") {
                fn(target);
            }
        }
    }
    ajaxClient.onloadstart=function(e){
        if(befFn && typeof befFn == "function"){
            befFn(e);
        }
    }
    ajaxClient.onerror = function (e) {
        console.log(e);
    }
    ajaxClient.send(config.data);

}
/**
 * 按名称获取html元素
 * @param {*} name html元素名称
 * @returns 
 */
function getElementByName(name) {
    return document.getElementsByName(name)[0];
}
/**
 * 获取radio表单元素
 * @param {*} name radio表单元素名称
 * @returns 
 */
function getRadioValue(name) {
    let radios = document.getElementsByName(name);
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return radios[i].value;
        }
    }
    return null;
}