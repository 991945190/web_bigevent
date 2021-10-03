$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage


    // 定义美化时间过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    //定义一个查询的参数对象
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }

    initTable()
    initCate()

    //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                    //调用渲染分页方法
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类的列表
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                //调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)

                $('[name=cate_id]').html(htmlStr)
                    //通过 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    //为筛选表单绑定 submit 事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
            // 为查询参数对象q中赋值
        q.cate_id = cate_id
        q.state = state
            // 根据最新的筛选条件，重新渲染表格数据
        initTable()
    })

    function renderPage(total) {
        // 渲染分页结构
        laypage.render({
            elem: 'pageBox', //分页容器id
            count: total, //总数居条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //默认选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function(obj, first) {
                // 最新页码值赋值到q
                q.pagenum = obj.curr
                    //条目数赋值
                q.pagesize = obj.limit
                    // initTable()
                if (!first) {
                    initTable()
                }
            }
        })
    }
    //通过代理的形式，为删除按钮提供点击事件处理函数
    $('tbody').on('click', '.btn-delete', function() {

        var len = $('.btn-delete').length
        console.log(len)
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')

                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                        // 数据删除完成后，判断是否还有数据
                }
            })

            layer.close(index)
        })
    })
})