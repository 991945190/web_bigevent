// 每次调用  
$.ajaxPrefilter(function(options) {


    options.url = 'http://api-breakingnews-web.itheima.net' + options.url

    //统一为有权限的接口，设置 headers 请求头 
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    options.complete = function(res) {

        // console.log('执行了回调')
        // console.log(res)
        //responseJSON
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            localStorage.removeItem('token')
            location.href = '/login.html'
        }
    }

})