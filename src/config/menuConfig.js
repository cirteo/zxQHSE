import React from "react";
// {/*<PieChartOutlined />*/}
const menuList=[
    {
        title:"首页",//菜单标题名称
        key:"/home",//对应的path
        icon:"PieChartOutlined ",//图标名称
        isPublic:true //所有用户都可以看见
    },
    // {
    //     title: '商品',
    //     key: '/products',
    //     icon: 'appstore',
    //
    //     children:
    //         [ // 子菜单列表
    //             {
    //                 title: '品类管理',
    //                  key: '/category',
    //                 icon: 'bars'
    //             },
    //             {
    //                 title: '商品管理',
    //                 key: '/product',
    //                 icon: 'tool'
    //             },
    //         ]
    // },
    {
        title: '量化表录入',
        key: '/evaluate',
        icon: 'user'
    },
    {
        title: '发布量化表',
        key: '/publish',
        icon: 'user'
    },
    {
        title: '量化表填报',
        key: '/write',
        icon: 'user'
    },
    {
        title: '量化表审核',
        key: '/check',
        icon: 'appstore',

        children:
            [ // 子菜单列表
                {
                    title: '审核量化表',
                    key: '/check/checking',
                    icon: 'bars'
                },
                {
                    title: '未通过量化表',
                    key: '/check/problem',
                    icon: 'tool'
                },
            ]
    },
    {
        title: '用户管理',
        key: '/user',
        icon: 'user'
    },
    {
        title: '权限管理',
        key: '/role',
        icon: 'safety',
    },
]
export default menuList
