$(function() {
    // 调用函数获取用户信息
    getUserInfo()


    var layer = layui.layer
    $('#btnLogout').on('click', function() {
        // 提示用户是否确认退出
        layer.confirm('确认退出登录吗', { icon: 3, title: '提示' }, function(index) {
            //do something
            localStorage.removeItem('token')
            location.href = '/login.html'

            // 关闭 confirm 询问框
            layer.close(index);
        });
    })
})

//获取用户信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // 请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败!')
            }
            //调用 renderAvatar 渲染用户头像
            renderAvatar(res.data)
        },
        // complete: function(res) {
        //     // console.log('执行了回调')
        //     // console.log(res)
        //     //responseJSON
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         localStorage.removeItem('token')
        //         location.href = '/login.html'
        //     }
        // }
    })
}

//渲染用户头像
function renderAvatar(user) {
    // 用户名称
    var name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp&nbsp;' + name)
        //按需渲染用户头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hode()
    } else {
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}