/**
 * @filename: terrain.js
 * @description: 地形渲染模块核心代码
 * @version:
 * @date: 2016-12-04
 * @author: jiangyangming
 * CopyRight (c) 2016-2017 FocusMap.Co.Ltd. All rights reserved.
 */

/**
 *
 *  在球体表面绘制路径
 */
var handler1;
function dixingdrawline() {
    globe.depthTestAgainstTerrain = false;
    var cesiumTerrainProviderMeshes = new Cesium.CesiumTerrainProvider({
        url: 'Data/terrain/terrain01',
        requestVertexNormals: true
    });

    if (viewer.terrainProvider._url != 'Data/terrain/terrain01') {

        viewer.terrainProvider = cesiumTerrainProviderMeshes;
    }

    var scene = viewer.scene;
    var ellipsoid = scene.globe.ellipsoid;

    var distPosCarte = [];
    var distPosCarto = [];
    var surfaceDist = 0;
    var distLine = viewer.entities.add({
        id: 'distLine',
        name: 'Distance Line',
        polyline: {
            width: 3,
            positions: [],
            "material": new Cesium.PolylineOutlineMaterialProperty({
                color: Cesium.Color.RED,
                outlineWidth: 2,
                outlineColor: Cesium.Color.RED
            })
        }
    });

    handler1 = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    handler1.setInputAction(function (movement) {
        // clear distPos arrays on single click without SHIFT
        distPosCarto.length = 0;
        distPosCarte.length = 0;
        surfaceDist = 0;
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    handler1.setInputAction(function (movement) {
        var cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
        var t = viewer.scene.globe.ellipsoid,
            i = viewer.scene.camera.getPickRay(movement.endPosition),
            r = viewer.scene.globe.pick(i, viewer.scene);
        if (r) {

            var n = t.cartesianToCartographic(r);
            distPosCarto.push(n);
            distPosCarte.push(n);
            var surfaceDist = 0;
            if (distPosCarte.length >= 2) {
                var posArray = [];
                var chartxArray = [];
                var chartyArray = [];
                chartxArray.push(surfaceDist);
                // Build array with all points
                var minheight = distPosCarte[0].height;
                var maxheight = distPosCarte[0].height;

                for (var i = 0; i < distPosCarte.length; i++) {
                    //    posArray.push(distPosCarte[i]);
                    posArray.push(Cesium.Math.toDegrees(distPosCarte[i].longitude));
                    posArray.push(Cesium.Math.toDegrees(distPosCarte[i].latitude));
                    posArray.push(distPosCarte[i].height);
                    if (distPosCarte[i].height > maxheight) {
                        maxheight = distPosCarte[i].height;
                    }
                    if (distPosCarte[i].height < minheight) {
                        minheight = distPosCarte[i].height;
                    }
                    chartyArray.push(((distPosCarte[i].height / 100) * 3 - 10977).toFixed(1));

                }

                for (var j = 1; j < distPosCarto.length; j++) {
                    var geodesic = new Cesium.EllipsoidGeodesic(distPosCarto[j - 1], distPosCarto[j]);
                    surfaceDist += geodesic.surfaceDistance;
                    chartxArray.push((surfaceDist / 1000).toFixed(1));
                }
                distLine.polyline.positions = new Cesium.Cartesian3.fromDegreesArrayHeights(posArray);
                //distLine.polyline.material.color._value.alpha=0.25;
                minheight = ((minheight / 100) * 3 - 10977).toFixed(0);
                maxheight = ((maxheight / 100) * 3 - 10977).toFixed(0);
                viewer.selectedEntity = distLine;
                surfaceDist = (surfaceDist / 1000).toFixed(0);
                initEchart1(chartxArray, chartyArray, '地形剖面', '距离（千米）', '海拔（米）', minheight, maxheight, surfaceDist);
            }
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE, Cesium.KeyboardEventModifier.SHIFT);

}

/**
 *
 *  删除球体表面路径
 */
function removedrawline() {
    if (handler1) {
        handler1.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        handler1.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE, Cesium.KeyboardEventModifier.SHIFT);
    }
    viewer.entities.removeById('distLine');

}

/**
 *
 *  初始化图表
 */
function initEchart1(dataX, dataY, title, nameX, nameY, minheght, maxheight, surfaceDist) {
    var myChart = echarts.init(document.getElementById('polylineChart'));
    // 指定图表的配置项和数据
    option = {
        //backgroundColor: '#ffffff',//背景色
        backgroundColor: 'transparent',//背景色
        title: {
            text: title,
            subtext: '',
            textStyle: {
                fontSize: '14px'


            },
            x: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: true
            }
        },

        grid: [{
            left: 60,
            right: 75,
            height: '50%'
        }],
        xAxis: [
            {
                name: nameX,
                min: 0,
                max: surfaceDist,
                splitNumber: 10,
                type: 'category',
                axisLabel: {
                    formatter: '{value}'
                },
                data: dataX
            }
        ],
        yAxis: [
            {
                name: '\n' + nameY,
                inverse: false,
                min: minheght,
                max: maxheight,
                splitNumber: 10,
                //         interval: 5,
                type: 'value',
                axisLine: {onZero: false},
                axisLabel: {
                    formatter: '{value}'
                },
                boundaryGap: false
                //     data: dataY

            }
        ],
        series: [
            {
                name: '',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        lineStyle: {
                            shadowColor: 'rgba(0,0,0,0.4)'
                        }
                    }
                },
                data: dataY

            }
        ]
    };
    myChart.setOption(option);
}