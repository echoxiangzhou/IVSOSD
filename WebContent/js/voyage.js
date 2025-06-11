/**
 * @filename: voyage.js
 * @description: 航线查询及显示相关
 * @version:
 * @date: 2016-11-26
 * @author: jiangyangming
 * CopyRight (c) 2016-2017 FocusMap.Co.Ltd. All rights reserved.
 */


/**
 *
 *航次分类列表树
 */
var SOURCE = [
    {
        title: "全部航次", folder: true, expanded: true, key: "1", selected: true,
        children: [
            {
                title: "物理海洋", key: "1.1", expanded: true, selected: true,
                children: [
                    {title: "ADCP", key: "1.1.1", selected: true},
                    {title: "CTD", key: "1.1.2", selected: true},
                    {title: "LADCP", key: "1.1.3", selected: true},
                    {title: "XCTD", key: "1.1.4", selected: true}
                ]
            },
            {
                title: "海洋地质", key: "1.2", expanded: true, selected: true,
                children: [
                    {title: "重力", key: "1.2.1", selected: true},
                    {title: "磁力", key: "1.2.2", selected: true},
                    {title: "浅剖", key: "1.2.3", selected: true},
                    {title: "样品", key: "1.2.4", selected: true}
                ]
            },
            {
                title: "海洋化学", key: "1.3", expanded: true, selected: true,
                children: [
                    {title: "pH", key: "1.3.1", selected: true},
                    {title: "溶解氧", key: "1.3.2", selected: true},
                    {title: "五项营养盐", key: "1.3.3", selected: true},
                    {title: "叶绿素a", key: "1.3.4", selected: true}
                ]
            },
            {
                title: "海洋生物", key: "1.4", expanded: true, selected: true,
                children: [
                    {title: "样品", key: "1.4.1", selected: true}

                ]
            }

        ]
    }

];


var arrSelL3 = new Array();
var selNodes;
var arrSelVoyNameList = new Array();
var selVoyName;
var selStaName;
/**
 *
 * 加载分类航线
 */
// Use jQuery instead of $ to avoid conflicts
jQuery(function () {
    // 检查fancytree是否已加载
    if (typeof jQuery.fn.fancytree === 'undefined') {
        console.error('Fancytree plugin not loaded. Retrying in 1 second...');
        setTimeout(function() {
            if (typeof jQuery.fn.fancytree !== 'undefined') {
                initializeFancytree();
            } else {
                console.error('Fancytree plugin still not available after retry.');
            }
        }, 1000);
        return;
    }
    
    initializeFancytree();
});

function initializeFancytree() {
    jQuery("#tree").fancytree({
        extensions: ["dnd"],
        checkbox: true,
        selectMode: 3,
        source: SOURCE,
        loadChildren: function (event, ctx) {
            ctx.tree.debug("loadChildren");
            ctx.node.fixSelection3FromEndNodes();
        },
        select: function (event, data) {
            if (data.node.isSelected()) {
//              alert("选择 ：" + data.node.title);
                //判断级别
//                    if (data.node.key.replace(/[^.]/g, "").length == 0) {
//                        var strSQLVoyAll = "select * from VOYAGE t";
//                        DatabaseOperationJS.QueryVoyageList(strSQLVoyAll, callBackVoyageList);
//                    }
            }
            else {
//                    alert("取消选择 ：" + data.node.title);
            }

            clearTable("tbodyVoyageList");
            viewer.dataSources.removeAll();
            viewer.entities.removeAll();

            var tree = jQuery("#tree").fancytree("getTree");
            selNodes = tree.getSelectedNodes();
            if (selNodes.length == 0) {
                clearTable("tbodyVoyageList");
                jQuery('#voyNext').css('background-image', "url(images/NextB02.png)");
                jQuery('#voyPre').css('background-image', "url(images/PreB02.png)");

            }
            else {
                var strSQLMetaListSub1 = "select * from METADATA where ";
                var strSQLMetaListSub2 = "ELEMENT like '%" + selNodes[0].title + "%'";
//                var strSQLSelVoyList = strSQLSelVoyListSub1 + strSQLSelVoyListSub2;
                var strSQLMetaListSub3 = "";
                arrSelL3.length = 0;
                if (selNodes.length > 1) {
                    selNodes.forEach(function (node) {
                        if (node.key.replace(/[^.]/g, "").length == 2) {
                            arrSelL3.push(node.title);
                            strSQLMetaListSub3 = strSQLMetaListSub3 + " OR ELEMENT like '%" + node.title + "%'";
                        }

                    });
                }
                //查询航次
                var strSQLSelVoyList = strSQLMetaListSub1 + "(" + strSQLMetaListSub2 + strSQLMetaListSub3 + ")";
                DatabaseOperationJS.QueryMetadataList(strSQLSelVoyList, callBackMetadataList);


            }
        }
    });
}

/**
 *
 * 元数据查询
 */
var arrSelVoyIDList = new Array();

var callBackMetadataList = function (metadataList) {
    var exist = 0;
    for (var i = 0; i < metadataList.length; i++) {
        for (var j = 0; j < arrSelVoyIDList.length; j++) {
            if (metadataList[i] == arrSelVoyIDList[j]) {
                exist = 1;
            }
        }
        if (exist == 0) {
            arrSelVoyIDList.push(metadataList[i].voyageID);
        }
    }

    var strSQLSelVoyListSub1 = "select * from VOYAGE where ( ID = " + arrSelVoyIDList[0];
    var strSQLSelVoyListSub2 = "";

    if (arrSelVoyIDList.length > 1) {
        arrSelVoyIDList.forEach(function (voyID) {
            strSQLSelVoyListSub2 = strSQLSelVoyListSub2 + " OR ID =" + voyID + " ";
        });
    }
    var strSQLSelVoyList = strSQLSelVoyListSub1 + strSQLSelVoyListSub2;
    var voyDateStart = document.getElementById("startdate").value;
    var voyDateEnd = document.getElementById("enddate").value;

    //查询航次列表
    strSQLSelVoyList = strSQLSelVoyList + " ) and to_char(V_START,'yyyy-mm-dd')<='" + voyDateEnd + "' and to_char(V_END,'yyyy-mm-dd')>='" + voyDateStart + "' order by ID";
    DatabaseOperationJS.QueryVoyageList(strSQLSelVoyList, callBackVoyageList);

    arrSelVoyIDList.length = 0;
}