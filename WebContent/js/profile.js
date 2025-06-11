/**
 * @filename: profile.js
 * @description: 剖面信息展示模块
 * @version:
 * @date: 2016-10-28
 * @author: xingwujie
 * CopyRight (c) 2016-2017 FocusMap.Co.Ltd. All rights reserved.
 */


/**
 *
 * 大面信息展示
 */
function loadDaMian() {
    globe.depthTestAgainstTerrain = false;
    var selDaMianFeature = document.getElementById("DaMianFeatures").value;

    if (selDaMianFeature == "temperature") {
        var objS = document.getElementById("DaMianSelect");
        var v = objS.options[objS.selectedIndex].value;
        if (v == "2008年01月") {
            viewer.dataSources.removeAll();
            Promissminmax('Data/Temp/WD200801.kmz');
        }
        else if (v == "2008年02月") {
            viewer.dataSources.removeAll();
            Promissminmax('Data/Temp/WD200802.kmz');
        }
        else if (v == "2008年03月") {
            viewer.dataSources.removeAll();
            Promissminmax('Data/Temp/WD200803.kmz');
        }
        else if (v == "2008年04月") {
            viewer.dataSources.removeAll();
            Promissminmax('Data/Temp/WD200804.kmz');
        }
        else if (v == "2008年05月") {
            viewer.dataSources.removeAll();
            Promissminmax('Data/Temp/WD200805.kmz');
        }
        else if (v == "2008年06月") {
            viewer.dataSources.removeAll();
            Promissminmax('Data/Temp/WD200806.kmz');
        }
        else if (v == "2008年07月") {
            viewer.dataSources.removeAll();
            Promissminmax('Data/Temp/WD200807.kmz');
        }
        else if (v == "2008年08月") {
            viewer.dataSources.removeAll();
            Promissminmax('Data/Temp/WD200807.kmz');
        }
        else if (v == "2008年09月") {
            viewer.dataSources.removeAll();
            Promissminmax('Data/Temp/WD200809.kmz');
        }
        else if (v == "2008年10月") {
            viewer.dataSources.removeAll();
            Promissminmax('Data/Temp/WD200810.kmz');
        }
        else if (v == "2008年11月") {
            viewer.dataSources.removeAll();
            Promissminmax('Data/Temp/WD200811.kmz');
        }
        else if (v == "2008年12月") {
            viewer.dataSources.removeAll();
            Promissminmax('Data/Temp/WD200812.kmz');
        }
    }


    if (selDaMianFeature == "salinity") {

        var objS = document.getElementById("DaMianSelect");
        var v = objS.options[objS.selectedIndex].value;
        if (v == "2008年01月") {
            viewer.dataSources.removeAll();
            //viewer.dataSources.add(Cesium.KmlDataSource.load('Data/Temp/YD200801.kmz', options));
            Promissminmax('Data/Temp/D200801.kmz');
        }
        else if (v == "2008年02月") {
            viewer.dataSources.removeAll();
            //viewer.dataSources.add(Cesium.KmlDataSource.load('Data/Temp/YD200802.kmz', options));
            Promissminmax('Data/Temp/YD200802.kmz');
        }
        else if (v == "2008年03月") {
            viewer.dataSources.removeAll();
            //viewer.dataSources.add(Cesium.KmlDataSource.load('Data/Temp/YD200803.kmz', options));
            Promissminmax('Data/Temp/YD200803.kmz');
        }
        else if (v == "2008年04月") {
            viewer.dataSources.removeAll();
            //viewer.dataSources.add(Cesium.KmlDataSource.load('Data/Temp/YD200804.kmz', options));
            Promissminmax('Data/Temp/YD200804.kmz');
        }
        else if (v == "2008年05月") {
            viewer.dataSources.removeAll();
            //viewer.dataSources.add(Cesium.KmlDataSource.load('Data/Temp/YD200805.kmz', options));
            Promissminmax('Data/Temp/YD200805.kmz');
        }
        else if (v == "2008年06月") {
            viewer.dataSources.removeAll();
            //viewer.dataSources.add(Cesium.KmlDataSource.load('Data/Temp/YD200806.kmz', options));
            Promissminmax('Data/Temp/YD200806.kmz');
        }
        else if (v == "2008年07月") {
            viewer.dataSources.removeAll();
            //viewer.dataSources.add(Cesium.KmlDataSource.load('Data/Temp/YD200807.kmz', options));
            Promissminmax('Data/Temp/YD200807.kmz');
        }
        else if (v == "2008年08月") {
            viewer.dataSources.removeAll();
            //viewer.dataSources.add(Cesium.KmlDataSource.load('Data/Temp/YD200808.kmz', options));
            Promissminmax('Data/Temp/YD200808.kmz');
        }
        else if (v == "2008年09月") {
            viewer.dataSources.removeAll();
            //viewer.dataSources.add(Cesium.KmlDataSource.load('Data/Temp/YD200808.kmz', options));
            Promissminmax('Data/Temp/YD200808.kmz');
        }
        else if (v == "2008年10月") {
            viewer.dataSources.removeAll();
            //viewer.dataSources.add(Cesium.KmlDataSource.load('Data/Temp/YD200810.kmz', options));
            Promissminmax('Data/Temp/YD200810.kmz');
        }
        else if (v == "2008年11月") {
            viewer.dataSources.removeAll();
            //viewer.dataSources.add(Cesium.KmlDataSource.load('Data/Temp/YD200811.kmz', options));
            Promissminmax('Data/Temp/YD200811.kmz');
        }
        else if (v == "2008年12月") {
            viewer.dataSources.removeAll();
            //viewer.dataSources.add(Cesium.KmlDataSource.load('Data/Temp/YD200812.kmz', options));
            Promissminmax('Data/Temp/YD200812.kmz');
        }
    }

    var damianLegend = document.getElementById('damianLegend');
    if (damianLegend.style.display == "none" || damianLegend.style.display == "") {
        damianLegend.style.display = "block";
    }

    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(124.5, 21.00, 16000000.0)
    });
}

function toggle(targetid) {
    if (document.getElementById) {
        var target = document.getElementById('damianLegend');
        if (target.style.display == "block") {
            target.style.display = "none";
        } else {
            target.style.display = "block";
        }
    }
}


function Promissminmax(dataPath) {
    var options = {
        camera: viewer.scene.camera,
        canvas: viewer.scene.canvas
    };
    var promise = Cesium.KmlDataSource.load(dataPath, options);
    promise.then(function (dataSource) {
        viewer.dataSources.add(dataSource);

        //Get the array of entities
        var entities = dataSource.entities.values;

        var colorHash = {};
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            var name = entity.name;
            var DaMianMinTemp00 = entity._children[0]._name;
            var DaMianMaxTemp00 = entity._children[entity._children.length - 1]._name;
            var minTempArr = DaMianMinTemp00.split("-");
            var maxTempArr = DaMianMaxTemp00.split("-");

            if (minTempArr[0] == "") {
                document.getElementById('DaMianTempMin').innerText = "-" + minTempArr[1] + "°C";
            }
            else {
                document.getElementById('DaMianTempMin').innerText = minTempArr[0] + "°C";
            }

            document.getElementById('DaMianTempMax').innerText = maxTempArr[1] + "°C";

            break;
        }
    }).otherwise(function (error) {
        //Display any errrors encountered while loading.
        //window.alert(error);
    });


}



/**
 *
 *  加载动态图层
 */
var dynaStat = "1";
function StartDynamicMaps() {

    dynaStat = "1";
    var timeLegend = document.getElementById('timeLegend');
    if (timeLegend.style.display == "none") {
        timeLegend.style.display = "block";
    }


    var tempMaxinArray = [];

    $.ajax({
        async: false,
        type: "GET",
        url: 'Data/Temp/WDMaxin.txt',
        success: function (content) {
            var data = content.split('\n');
            for (lineIndex in data) {
                var str = data[lineIndex];
                tempMaxinArray.push(str);
            }
        }
    });

    scene.globe.depthTestAgainstTerrain = false;
    var imageryLayers = viewer.imageryLayers;
    var imageryProvider = new Cesium.SingleTileImageryProvider({
        url: tempMaxinArray[0].split(' ')[3],
        rectangle: Cesium.Rectangle.fromDegrees(99.0, -10.0, 150.0, 52.0)
    });
    var imageryProvider1 = new Cesium.SingleTileImageryProvider({
        url: tempMaxinArray[1].split(' ')[3],
        rectangle: Cesium.Rectangle.fromDegrees(99.0, -10.0, 150.0, 52.0)
    });
    var imageryProvider2 = new Cesium.SingleTileImageryProvider({
        url: tempMaxinArray[2].split(' ')[3],
        rectangle: Cesium.Rectangle.fromDegrees(99.0, -10.0, 150.0, 52.0)
    });
    var imageryProvider3 = new Cesium.SingleTileImageryProvider({
        url: tempMaxinArray[3].split(' ')[3],
        rectangle: Cesium.Rectangle.fromDegrees(99.0, -10.0, 150.0, 52.0)
    });
    var imageryProvider4 = new Cesium.SingleTileImageryProvider({
        url: tempMaxinArray[4].split(' ')[3],
        rectangle: Cesium.Rectangle.fromDegrees(99.0, -10.0, 150.0, 52.0)
    });
    var imageryProvider5 = new Cesium.SingleTileImageryProvider({
        url: tempMaxinArray[5].split(' ')[3],
        rectangle: Cesium.Rectangle.fromDegrees(99.0, -10.0, 150.0, 52.0)
    });
    var imageryProvider6 = new Cesium.SingleTileImageryProvider({
        url: tempMaxinArray[6].split(' ')[3],
        rectangle: Cesium.Rectangle.fromDegrees(99.0, -10.0, 150.0, 52.0)
    });
    var imageryProvider7 = new Cesium.SingleTileImageryProvider({
        url: tempMaxinArray[7].split(' ')[3],
        rectangle: Cesium.Rectangle.fromDegrees(99.0, -10.0, 150.0, 52.0)
    });
    var imageryProvider8 = new Cesium.SingleTileImageryProvider({
        url: tempMaxinArray[8].split(' ')[3],
        rectangle: Cesium.Rectangle.fromDegrees(99.0, -10.0, 150.0, 52.0)
    });
    var imageryProvider9 = new Cesium.SingleTileImageryProvider({
        url: tempMaxinArray[9].split(' ')[3],
        rectangle: Cesium.Rectangle.fromDegrees(99.0, -10.0, 150.0, 52.0)
    });
    var imageryProvider10 = new Cesium.SingleTileImageryProvider({
        url: tempMaxinArray[10].split(' ')[3],
        rectangle: Cesium.Rectangle.fromDegrees(99.0, -10.0, 150.0, 52.0)
    });
    var imageryProvider11 = new Cesium.SingleTileImageryProvider({
        url: tempMaxinArray[11].split(' ')[3],
        rectangle: Cesium.Rectangle.fromDegrees(99.0, -10.0, 150.0, 52.0)
    });

    var layer = imageryLayers.addImageryProvider(imageryProvider);
    var maxinInfo = tempMaxinArray[0];
    ShowSeriesTime(layer, maxinInfo);
    var layer1 = imageryLayers.addImageryProvider(imageryProvider1);
    maxinInfo = tempMaxinArray[1];
    ShowSeriesTime(layer1, maxinInfo);
    layer1.alpha = 0;


    viewer.animation.viewModel.timeFormatter = function (date, viewModel) {
        if (dynaStat == "1") {
            if (layer.alpha >= 0) {
                layer.alpha -= 0.005;
                layer1.alpha += 0.005;
            }
            if (layer.alpha < 0) {
                changeTimeFormatter(layer, layer1, imageryProviders, tempMaxinArray);
            }
        }
    }

    var n = 0;

    //包含除了1、2的剩余的数组
    var imageryProviders = [imageryProvider2, imageryProvider3, imageryProvider4, imageryProvider5, imageryProvider6, imageryProvider7, imageryProvider8, imageryProvider9, imageryProvider10, imageryProvider11];


    function changeTimeFormatter(layer, layer1, imageryProviders, tempMaxinArray) {
        if (typeof imageryProviders[n] === "undefined") {
            //数组中没有成员时,将此回调函数置为空
            viewer.animation.viewModel.timeFormatter = function () {
            };
            return;
        }
        //先移除掉已经不可见的图层
        imageryLayers.remove(layer);

        //将layer指向下一个图层,并将它先设置成完全透明
        var maxinInfo = tempMaxinArray[n + 2];
        ShowSeriesTime(layer1, maxinInfo);
        layer = imageryLayers.addImageryProvider(imageryProviders[n++]);


        layer.alpha = 0;
        layer1.alpha = 1;

        if (dynaStat == "1") {
            //改变该回调函数，执行下一轮渐变
            viewer.animation.viewModel.timeFormatter = function (date, viewModel) {
                if (layer1.alpha >= 0) {
                    layer1.alpha -= 0.005;
                    layer.alpha += 0.005;
                }
                if (layer1.alpha < 0) {
                    //执行下一轮渐变
                    changeTimeFormatter(layer1, layer, imageryProviders, tempMaxinArray);


                }
            }
        }
    }

    viewer.flyTo(layer);
}


/**
 *
 * 显示时间序列
 */
function ShowSeriesTime(layer, maxinInfo) {
    //var result = str.replace(/(^\s+)|(\s+$)/g, "");
    //var lineData = result.split(/\s+/g);//3列
    var lineData = maxinInfo.split(' ');//3列
    document.getElementById('lblSeriesTime').innerText = "海洋要素所处时段：" + lineData[0];
    document.getElementById('profLengMinTime').innerText = lineData[1] + "℃";
    document.getElementById('profLengMaxTime').innerText = lineData[2].replace(/[\r\n]/g, "") + "℃";


}


/**
 *
 * 清除动态图层
 */
function ClearDynaMaps() {
    console.log('🗑️ ClearDynaMaps 被调用，强化保护基础影像图层');
    
    // 强制检查初始化状态
    if (!window.CESIUM_INITIALIZATION_COMPLETE) {
        console.warn('⚠️ Cesium未完全初始化，跳过ClearDynaMaps操作');
        return;
    }
    
    var imageryLayers = viewer.imageryLayers;
    
    // 绝对不删除任何影像图层 - 只清除实体和数据源
    console.log('🛡️ 绝对保护所有影像图层，只清除科学数据');
    
    // 清除动态数据但保留所有影像图层
    viewer.entities.removeAll();
    
    // 确保基础影像图层状态正常
    if (window.primaryImageryLayer) {
        var layerExists = imageryLayers.indexOf(window.primaryImageryLayer) !== -1;
        var layerValid = window.primaryImageryLayer.show !== undefined;
        
        if (!layerExists || !layerValid) {
            console.warn('⚠️ 基础影像图层状态异常，立即恢复...');
            restoreBaseImageryLayerInProfile();
        } else {
            // 确保图层可见
            if (!window.primaryImageryLayer.show) {
                window.primaryImageryLayer.show = true;
                viewer.scene.requestRender();
                console.log('🔧 恢复基础影像图层可见性');
            }
            console.log('✅ 基础影像图层状态正常');
        }
    } else {
        console.warn('⚠️ primaryImageryLayer引用丢失，立即恢复...');
        restoreBaseImageryLayerInProfile();
    }

    // 清理动态数据变量
    if (typeof imageryProviders !== 'undefined') {
        imageryProviders = [];
    }
    if (typeof dynaStat !== 'undefined') {
        dynaStat = "0";
    }
    
    var timeLegend = document.getElementById('timeLegend');
    if (timeLegend) {
        timeLegend.style.display = "none";
    }
    
    var seriesTimeLabel = document.getElementById('lblSeriesTime');
    if (seriesTimeLabel) {
        seriesTimeLabel.innerText = "海洋要素所处时段：";
    }
}

// profile.js 中的基础影像图层恢复函数
function restoreBaseImageryLayerInProfile() {
    try {
        console.log('🔧 在ClearDynaMaps中恢复基础影像图层...');
        
        if (viewer.imageryLayers.length === 0) {
            const osmProvider = new Cesium.OpenStreetMapImageryProvider({
                url: 'https://a.tile.openstreetmap.org/'
            });
            const newLayer = viewer.imageryLayers.addImageryProvider(osmProvider);
            newLayer.show = true;
            newLayer.alpha = 1.0;
            newLayer._cesiumProtected = true;
            newLayer._isBaseLayer = true;
            window.primaryImageryLayer = newLayer;
            window.CESIUM_BASE_IMAGERY_PROTECTED = true;
            viewer.scene.requestRender();
            console.log('✅ 基础影像图层已在profile.js中恢复');
        } else {
            // 重新建立引用到第一个图层
            var firstLayer = viewer.imageryLayers.get(0);
            firstLayer._cesiumProtected = true;
            firstLayer._isBaseLayer = true;
            window.primaryImageryLayer = firstLayer;
            console.log('✅ 重新建立基础图层引用');
        }
        
    } catch (error) {
        console.error('❌ profile.js中基础影像图层恢复失败:', error);
    }
}


/**
 *
 *  显示三维插值结果
 */
function Show3DPrifle(path1, path2) {
    var scene = viewer.scene;
    globe.depthTestAgainstTerrain = true;
    var objS = document.getElementById("profType");
    var v = objS.options[objS.selectedIndex].value;

    var profLeftLong = document.getElementById("profLeft").value;
    var profRightLong = document.getElementById("profRight").value;
    var profTopLati = document.getElementById("profTop").value;
    var profBottomLati = document.getElementById("profBottom").value;

    var proType = v;
    var profLocaLong;
    var profLocalati;
    var profLocadeep;

    var sliderProfLoca = $jq('#sliderProfLoca').slider()
        .on('slide', null)
        .data('slider');

    var proLoca = Math.round(sliderProfLoca.getValue());

    if (proType == "Longitude") {

        profLocaLong = proLoca;
    }
    else if (proType == "Latitude") {
        profLocalati = proLoca;
    }
    else if (proType == "Deep") {
        profLocadeep = proLoca;
    }

    //经度剖面
    if (v == "Longitude") {
        var longPath01 = 'images/' + path1;
        var longPath02 = 'images/' + path2;

        var longProfWall1 = viewer.entities.add({
            //name : 'Red wall at height',
            wall: {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights([profLocaLong, profTopLati, (10977 / 3) * 100,
                    profLocaLong, profBottomLati, (10977 / 3) * 100]),
                minimumHeights: [0, 0],
                material: longPath01
            }
        });

        var longProfWall2 = viewer.entities.add({
            //name : 'Red wall at height',
            wall: {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights([profLocaLong, profBottomLati, (10977 / 3) * 100,
                    profLocaLong, profTopLati, (10977 / 3) * 100]),
                minimumHeights: [0, 0],
                material: longPath02
            }
        });
        //纬度剖面
    } else if (v == "Latitude") {

        var latiPath01 = 'images/' + path1;
        var latiPath02 = 'images/' + path2;

        var latiProfWall = viewer.entities.add({
            //name : 'Red wall at height',
            wall: {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights([profLeftLong, profLocalati, (10977 / 3) * 100,
                    profRightLong, profLocalati, (10977 / 3) * 100]),
                minimumHeights: [0, 0],
                material: latiPath01
            }
        });

        var latiProfWall2 = viewer.entities.add({
            //name : 'Red wall at height',
            wall: {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights([profRightLong, profLocalati, (10977 / 3) * 100,
                    profLeftLong, profLocalati, (10977 / 3) * 100]),
                minimumHeights: [0, 0],
                material: latiPath02
            }
        });


    }
    //深度剖面
    else if (v == "Deep") {
        var deepPath01 = 'images/' + path1;
        var deepProf = viewer.entities.add({
            //name: 'rectangle',
            rectangle: {
                coordinates: Cesium.Rectangle.fromDegrees(profLeftLong, profBottomLati, profRightLong, profTopLati),
                material: deepPath01,
                height: ((parseInt("-" + profLocadeep) + 10977) / 3) * 100
            }
        });
    }

    function applyWallmageMaterial(entityWall, imagePath, scene) {
        Sandcastle.declare(applyWallmageMaterial); // For highlighting in Sandcastle.
        entityWall.wall.material = new Cesium.Material({
            fabric: {
                type: 'Image',
                uniforms: {
                    image: imagePath
                }
            }
        });
    }

    var OutRectangle = viewer.entities.add({
        name: '',
        rectangle: {
            coordinates: Cesium.Rectangle.fromDegrees(profLeftLong, profBottomLati, profRightLong, profTopLati),
            material: Cesium.Color.WHITESMOKE.withAlpha(0.05),
            //rotation: Cesium.Math.toRadians(45),
            extrudedHeight: (10977 / 3) * 100,
            height: 0,
            outline: true,
            outlineColor: Cesium.Color.WHITE
        }
    });

}

function ClearCurrentField() {


    clearImageryLayers();
}

/**
 *
 *  切换剖面类型
 */
function profTypeChange() {

    var proType = dwr.util.getValue("profType");
    if (proType == "Longitude") {
        var minValue = parseFloat(dwr.util.getValue("profLeft"));
        var maxValue = parseFloat(dwr.util.getValue("profRight"));
        $jq('#sliderProfLoca').slider({
            min: minValue,
            max: maxValue,
            value: 127
        });
        var sliderProfLoca = $jq('#sliderProfLoca').slider()
            .on('slide', null)
            .data('slider');
        sliderProfLoca.refresh();
    }
    else if (proType == "Latitude") {
        var minValue = parseFloat(dwr.util.getValue("profBottom"));
        var maxValue = parseFloat(dwr.util.getValue("profTop"));
        $jq('#sliderProfLoca').slider({
            min: minValue,
            max: maxValue,
            value: 28

        });
        var sliderProfLoca = $jq('#sliderProfLoca').slider()
            .on('slide', null)
            .data('slider');
        sliderProfLoca.refresh();

    }
    else if (proType == "Deep") {
        var minValue = parseFloat(dwr.util.getValue("profDeepTop"));
        var maxValue = parseFloat(dwr.util.getValue("profDeepBottom"));
        $jq('#sliderProfLoca').slider({
            min: minValue,
            max: maxValue,
            value: 1000

        });

        var sliderProfLoca = $jq('#sliderProfLoca').slider()
            .on('slide', null)
            .data('slider');
        sliderProfLoca.refresh();
    }

}


/**
 *
 *  剖面位置
 */
function profRangeChange() {
    var proType = dwr.util.getValue("profType");
    if (proType == "Longitude") {
        var minValue = parseFloat(dwr.util.getValue("profLeft"));
        var maxValue = parseFloat(dwr.util.getValue("profRight"));
        $jq('#sliderProfLoca').slider({
            min: minValue,
            max: maxValue,
            value: 127
        });
        var sliderProfLoca = $jq('#sliderProfLoca').slider()
            .on('slide', null)
            .data('slider');
        sliderProfLoca.refresh();
    }
    else if (proType == "Latitude") {
        var minValue = parseFloat(dwr.util.getValue("profBottom"));
        var maxValue = parseFloat(dwr.util.getValue("profTop"));
        $jq('#sliderProfLoca').slider({
            min: minValue,
            max: maxValue,
            value: 28

        });
        var sliderProfLoca = $jq('#sliderProfLoca').slider()
            .on('slide', null)
            .data('slider');
        sliderProfLoca.refresh();
    }
    else if (proType == "Deep") {
        var minValue = parseFloat(dwr.util.getValue("profDeepTop"));
        var maxValue = parseFloat(dwr.util.getValue("profDeepBottom"));
        $jq('#sliderProfLoca').slider({
            min: minValue,
            max: maxValue,
            value: 1000

        });

        var sliderProfLoca = $jq('#sliderProfLoca').slider()
            .on('slide', null)
            .data('slider');
        sliderProfLoca.refresh();
    }


}

/**
 *
 *  传递参数到后台
 */
var sendParameters = function () {

    if (viewer.terrainProvider._url != 'Data/terrain/terrain01') {
        var cesiumTerrainProviderMeshes = new Cesium.CesiumTerrainProvider({
            url: 'Data/terrain/terrain01',
            requestVertexNormals: true
        });
        viewer.terrainProvider = cesiumTerrainProviderMeshes;
    }

    var profLeftLong = document.getElementById("profLeft").value;
    var profRightLong = document.getElementById("profRight").value;
    var profTopLati = document.getElementById("profTop").value;
    var profBottomLati = document.getElementById("profBottom").value;

    var proType = dwr.util.getValue("profType");

    var sliderProfLoca = $jq('#sliderProfLoca').slider()
        .on('slide', null)
        .data('slider');
    var proLoca = Math.round(sliderProfLoca.getValue());


    var strParas = proType + "_" + proLoca;

    //var proType = v;
    var profLocaLong;
    var profLocalati;
    var profLocadeep;
    if (proType == "Longitude") {
        profLocaLong = proLoca;
        if (profLocaLong < profLeftLong || profLocaLong > profRightLong) {
            alert("请输入正确的经度范围");
            return;
        }
    }
    else if (proType == "Latitude") {
        profLocalati = proLoca;
        if (profLocalati < profBottomLati || profLocalati > profTopLati) {
            alert("请输入正确的纬度范围");
            return;
        }
    }
    else if (proType == "Deep") {
        profLocadeep = proLoca;
        if (profLocadeep < 0) {
            alert("请输入正确的深度");
            return;
        }
    }

    return ServiceJS.CreateImage(strParas, callBack);

}
var callBack = function (data) {
    //alert(data);
    var proLegend = document.getElementById('proLegend');
    if (proLegend.style.display == "none") {
        proLegend.style.display = "block";
    }
    var maxValue = data.split("_")[0];
    var minValue = data.split("_")[1];
    var max2 = parseFloat(maxValue).toFixed(2);
    var min2 = parseFloat(minValue).toFixed(2);
    document.getElementById('profLengMax').innerText = max2;
    document.getElementById('profLengMin').innerText = min2;

    var path1 = data.split("_")[2];
    var path2 = data.split("_")[3];

    Show3DPrifle(path1, path2);
};


/**
 *
 *  清除剖面结果
 */
function ClearProf() {
    viewer.entities.removeAll();
    var proLegend = document.getElementById('proLegend');
    proLegend.style.display = "none";
}

