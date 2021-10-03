$(function() {

    var layer = layui.layer

    var form = layui.form


    initCate()
        // 初始化富文本编辑器
    initEditor()


    //定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败')
                }
                // 调用模板引擎渲染分类下拉菜单
                var htnlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htnlStr)
                    // 一定记得调用 form.render() 方法
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择方面按钮，绑定点击事件
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click()
    })

    // 监听coverFile的change事件 获取用户选择的文件列表
    $('#coverFile').on('change', function(e) {
        var files = e.target.files
        if (files.length === 0) {
            return
        }
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(files[0])
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    var art_state = '已发布'

    //为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click', function() {
        art_state = '草稿'
    })

    // 为表单绑定submit提交事件
    $('#from-pub').on('submit', function(e) {
            e.preventDefault()
            var fd = new FormData($(this)[0])

            fd.append('state', art_state)
                // 将裁剪后的图片，输出为文件
            $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 400,
                    height: 280
                })
                .toBlob(function(blob) {
                    // 将 Canvas 画布上的内容，转化为文件对象
                    // 得到文件对象后，进行后续的操作
                    fd.append('cover_img', blob)
                        //发起ajax请求
                    publishArticle(fd)
                })
        })
        // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                    //  发布文章成功后，跳转到文章列表页
                location.href = '/article/art_list.html'
            }
        })
    }
})