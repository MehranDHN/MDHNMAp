
var R6Map = function (openlayer, settings) {
    var _ol = openlayer;
    var _map;
    var MoneySeperator = (x) => {
        if (x > 0) {
            x = x.toString();
            var pattern = /(-?\d+)(\d{3})/;
            while (pattern.test(x))
                x = x.replace(pattern, "$1,$2");
        }
        return x;
    };
    var elastic = (t) => { return Math.pow(2, -10 * t) * Math.sin((t - 0.075) * (2 * Math.PI) / 0.3) + 1; };
    var mosharekatSource = new _ol.source.Vector({
        url: settings.layers._mosharekaturl,
        crossOrigin: 'anonymous',
        format: new _ol.format.GeoJSON(),
        wrapX: false
    });
    var motalebatSource = new _ol.source.Vector({
        url: settings.layers._motalebaturl,
        crossOrigin: 'anonymous',
        format: new _ol.format.GeoJSON(),
        wrapX: false
    });
    var sayerSource = new _ol.source.Vector({
        url: settings.layers._sayerurl,
        crossOrigin: 'anonymous',
        format: new _ol.format.GeoJSON(),
        wrapX: false
    });
    var redraw = () => {
        //mosharekatSource.clear();
        //motalebatSource.clear();
        sayerSource.clear();
        _map.render();
        console.log("renderSync");
    };
    var initMap = (cb) => {
        console.log("initMap");
        console.log(settings);
        var element = document.getElementById('detailsPopup');
        var overlayGroup = new _ol.layer.Group({
            title: 'فهرست لايه ها',
            layers: []
        });
        var layerSwitcher = new _ol.control.LayerSwitcher({
            tipLabel: 'راهنمای لايه ها',
            groupSelectStyle: 'children'
        });
        var PointStyle1 = {
            'Point': new ol.style.Style({
                image: new ol.style.Icon({
                    crossOrigin: '', anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    src: '/Assets/Pushpins/pp4.png',
                    anchor: [0.0, .85], imgSize: [30, 30]
                })
            }),
        };
        var PointStyle2 = {
            'Point': new ol.style.Style({
                image: new ol.style.Icon({
                    crossOrigin: '', anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    src: '/Assets/Pushpins/pp5.png',
                    anchor: [0.0, .85], imgSize: [30, 30]
                })
            }),
        };
        var PointStyle3 = {
            'Point': new ol.style.Style({
                image: new ol.style.Icon({
                    crossOrigin: '', anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    src: '/Assets/Pushpins/pp2.png',
                    anchor: [0.0, .85], imgSize: [30, 30]
                })
            }),
        };
        var PointStyleFunction1 = function (feature) {
            return PointStyle1[feature.getGeometry().getType()];
        };
        var PointStyleFunction2 = function (feature) {
            return PointStyle2[feature.getGeometry().getType()];
        };
        var PointStyleFunction3 = function (feature) {
            return PointStyle3[feature.getGeometry().getType()];
        };
        var AdminLevel10Style = {
            'MultiPolygon': new _ol.style.Style({
                stroke: new _ol.style.Stroke({
                    color: '#ff5722',
                    width: 2
                }),
                fill: new _ol.style.Fill({
                    color: 'rgba(255, 255, 0, 0.1)'
                })
            }),
            'Polygon': new _ol.style.Style({
                stroke: new _ol.style.Stroke({
                    color: 'blue',
                    lineDash: [4],
                    width: 2
                }),
                fill: new _ol.style.Fill({
                    color: 'rgba(0, 0, 255, 0.2)'
                })
            })
        };
        var AdminLevel10StyleFunction = function (feature) {
            return AdminLevel10Style[feature.getGeometry().getType()];
        };
        var stCircle1 = new _ol.style.Circle({
            radius: 8,
            stroke: new _ol.style.Stroke({ color: '#ff5722', width: 1 }),
            fill: new _ol.style.Fill({ color: '#ff5722' })
        });
        var stCircle2 = new _ol.style.Circle({
            radius: 4,
            stroke: new _ol.style.Stroke({ color: '#005722', width: 1 }),
            fill: new _ol.style.Fill({ color: '#005722' })
        });
        var projectMarkerStyle = {
            'Point': new _ol.style.Style({
                image: stCircle1
            })
        };
        var ProjectStyleFunction = function (feature) {
            return projectMarkerStyle[feature.getGeometry().getType()];
        };
        var TehranTileStyle = function (feature) {
            let props = feature.getProperties();
            let name = props['name:fa'] || props['name']

            if (props['highway'] === 'primary' || props['highway'] === 'tertiary' || props['highway'] === 'trunk' || props['highway'] === 'motorway') {
                if (name) {
                    return new _ol.style.Style({
                        stroke: new _ol.style.Stroke({
                            color: 'white',
                            width: widthCalculator(100, map)
                        }),
                        text: new _ol.style.Text({
                            text: " " + name + " ",
                            font: '12px "irsans"',
                            placement: 'line',
                            fill: new _ol.style.Fill({
                                color: '#0288d1'
                            }),
                            maxAngle: 0,
                            overflow: false,
                            stroke: new _ol.style.Stroke({
                                color: 'white',
                                width: 6
                            }),
                            padding: [200, 200, 200, 200]
                        })
                    })
                } else {
                    return new _ol.style.Style({
                        stroke: new _ol.style.Stroke({
                            color: 'white',
                            width: widthCalculator(100, map)
                        })
                    })
                }
            } else if (props['highway'] === 'primary_link' || props['highway'] === 'tertiary_link' || props['highway'] === 'trunk_link' || props['highway'] === 'motorway_link') {
                if (name) {
                    return new _ol.style.Style({
                        stroke: new _ol.style.Stroke({
                            color: 'white',
                            width: widthCalculator(100, map)
                        }),
                        text: new _ol.style.Text({
                            text: " " + name + " ",
                            font: '12px "irsans"',
                            placement: 'line',
                            fill: new _ol.style.Fill({
                                color: '#c00'
                            }),
                            maxAngle: 0,
                            overflow: false,
                            stroke: new _ol.style.Stroke({
                                color: 'white',
                                width: 6
                            }),
                            padding: [200, 200, 200, 200]
                        }),
                        zIndex: 100
                    })
                } else {
                    return new _ol.style.Style({
                        stroke: new _ol.style.Stroke({
                            color: 'white',
                            width: widthCalculator(80, map)
                        })
                    })
                }
            } else if (props['highway'] === 'secondary' || props['highway'] === 'secondary_link') {
                if (name) {
                    return new _ol.style.Style({
                        stroke: new _ol.style.Stroke({
                            color: 'white',
                            width: widthCalculator(60, map)
                        }),
                        text: new _ol.style.Text({
                            text: " " + name + " ",
                            font: '12px "irsans"',
                            placement: 'line',
                            fill: new _ol.style.Fill({
                                color: '#0288d1'
                            }),
                            maxAngle: 0,
                            overflow: false,
                            stroke: new _ol.style.Stroke({
                                color: 'white',
                                width: 6
                            }),
                            padding: [200, 200, 200, 200]
                        }),
                        zIndex: 100
                    })
                } else {
                    return new _ol.style.Style({
                        stroke: new _ol.style.Stroke({
                            color: 'white',
                            width: widthCalculator(60, map)
                        })
                    })
                }
            } else if (props['highway'] === 'residential' || props['highway'] === 'service') {
                if (name) {
                    return new _ol.style.Style({
                        stroke: new _ol.style.Stroke({
                            color: 'white',
                            width: widthCalculator(45, map)
                        }),
                        text: new _ol.style.Text({
                            text: " " + name + " ",
                            font: '12px "irsans"',
                            placement: 'line',
                            fill: new _ol.style.Fill({
                                color: '#c00'
                            }),
                            maxAngle: 0,
                            overflow: false,
                            stroke: new _ol.style.Stroke({
                                color: 'white',
                                width: 6
                            }),
                            padding: [200, 200, 200, 200]
                        }),
                        zIndex: 100
                    })
                } else {
                    return new _ol.style.Style({
                        stroke: new _ol.style.Stroke({
                            color: 'white',
                            width: widthCalculator(45, map)
                        })
                    })
                }
            } else {
                console.log(props)
            }

        };
        var TehranTileStyleStrokes = function (feature) {
            let props = feature.getProperties();

            if (props['highway'] === 'primary' || props['highway'] === 'tertiary' || props['highway'] === 'trunk' || props['highway'] === 'motorway') {
                return new _ol.style.Style({
                    stroke: new _ol.style.Stroke({
                        color: 'lightgray',
                        width: widthCalculator(130, map)
                    })
                })
            } else if (props['highway'] === 'primary_link' || props['highway'] === 'tertiary_link' || props['highway'] === 'trunk_link' || props['highway'] === 'motorway_link') {
                return new _ol.style.Style({
                    stroke: new _ol.style.Stroke({
                        color: 'lightgray',
                        width: widthCalculator(130, map)
                    })
                })
            } else if (props['highway'] === 'secondary' || props['highway'] === 'secondary_link') {
                return new _ol.style.Style({
                    stroke: new _ol.style.Stroke({
                        color: 'lightgray',
                        width: widthCalculator(90, map)
                    })
                })
            } else if (props['highway'] === 'residential' || props['highway'] === 'service') {
                return new _ol.style.Style({
                    stroke: new _ol.style.Stroke({
                        color: 'lightgray',
                        width: widthCalculator(75, map)
                    })
                })

            } else {
                console.log(props)
            }

        };
        var AddPopupOverLay = function () {
            var _popup = new _ol.Overlay({
                element: element,
                positioning: 'bottom-center',
                autoPan: true,
                autoPanMargin: 20,
                autoPanAnimation: {
                    duration: 250
                },
                stopEvent: false
            });
            return _popup;
        };
        var popup = AddPopupOverLay();

        var MosharekatLayer = new _ol.layer.Vector({
            title: 'پروژه های مشارکتی',
            source: mosharekatSource,
            style: PointStyleFunction1
        });

        var MotalebatLayer = new _ol.layer.Vector({
            title: 'مطالبات',
            source: motalebatSource,
            style: PointStyleFunction2
        });
        var SayerLayer = new _ol.layer.Vector({
            title: 'ساير',
            source: sayerSource,
            style: PointStyleFunction3
        });
        var AdminLevel10Layer = new _ol.layer.Vector({
            title: 'محدوده مناطق',
            source: new ol.source.Vector({
                url: settings.layers._adminLevel10url,
                crossOrigin: 'anonymous',
                opacity: 0.2,
                format: new _ol.format.GeoJSON(),
                wrapX: false
            }),
            style: AdminLevel10StyleFunction
        });
        var osmRaster = new _ol.layer.Tile({
            title: 'OSM Online',
            type: 'base',
            visible: true,
            source: new _ol.source.OSM({
                attributions: ' <i style="font-family:irsans">تمامی حقوق برای شهرداری منطقه 6 تهران محفوظ است </i>'
            })
        });
        var TehranTileStrokes = new _ol.layer.VectorTile({
            source: new _ol.source.VectorTile({
                title: 'OSM Vector1',
                type: 'base',
                visible: false,
                attributions: ' <i style="font-family:irsans;font-size:11px">لايه وکتور و رندرينگ از اسماعيل عمادی - </i>',
                format: new _ol.format.MVT(),
                url: 'http://10.6.248.37/R6Energy/tehran/{z}/{x}/{y}.pbf'
            }),
            style: TehranTileStyleStrokes
        });
        var R6VectorTile = new ol.layer.VectorTile({
            source: new ol.source.VectorTile({
                title: 'OSM Vector2',
                type: 'base',
                visible: false,
                attributions: ' <i style="font-family:irsans;font-size:11px">اين لايه در سايت منطقه شش شهرداری تهران تهيه شده و همه حقوق آن برای شهرداری منطقه شش تهران محفوظ است </i>',
                format: new ol.format.MVT(),
                url: 'http://10.6.248.37/R6Energy/tehran/{z}/{x}/{y}.pbf'
            }),
            style: TehranTileStyle,
            declutter: true
        });
        overlayGroup.getLayers().push(AdminLevel10Layer);
        overlayGroup.getLayers().push(MosharekatLayer);
        overlayGroup.getLayers().push(MotalebatLayer);
        overlayGroup.getLayers().push(SayerLayer);
        _map = new _ol.Map({
            target: 'map',
            //layers: [osmRaster, TehranTileStrokes, R6VectorTile, overlayGroup],
            layers: [osmRaster],
            view: new _ol.View({
                center: _ol.proj.transform([51.4055, 35.6816], 'EPSG:4326', 'EPSG:3857'),
                zoom: 11
            })
        });
        redraw();
        var sidebar = new _ol.control.Sidebar({ element: 'sidebar', position: 'left' });
        _map.addOverlay(popup);
        _map.addControl(new _ol.control.ScaleLine({ units: 'metric' }));
        _map.addControl(new _ol.control.ZoomSlider());
        _map.addControl(layerSwitcher);
        _map.addControl(sidebar);
        _map.on('click', function (evt) {
            var feature = _map.forEachFeatureAtPixel(evt.pixel,
                function (feature, layer) {
                    return feature;
                });
            if (feature) {
                var geometry = feature.getGeometry();
                var coord = geometry.getCoordinates();
                popup.setPosition(coord);
                var projectType = parseInt(feature.get('ProjectType'));
                var htmlContent = "";
                if (geometry.getType() === "Point" && projectType==1) {
                    $(element).popover('destroy');
                    htmlContent += "<div style='font-family:irsans;'>";
                    htmlContent += "<i class='fa fa-arrow-down' style='position:absolute;z-index:100;font-size:22px;color:#fff;left:213px;top:94%;' />";
                    htmlContent += "<b style='font-size:12px;color:#c00'>";
                    htmlContent += feature.get('ProjectTitle');
                    htmlContent += "</b> ";
                    htmlContent += "<br/>";
                    htmlContent += "<span style='font-size:12px;'><b style='color:#1b4590'>شرح</b>:&nbsp;";
                    htmlContent += feature.get('ProjectDetails');
                    htmlContent += "</span ><br/>";
                    htmlContent += "<span style='font-size:12px;'><b style='color:#1b4590'>شماره پرونده</b>:&nbsp;";
                    htmlContent += feature.get('FileNo');
                    htmlContent += "</span ><br/>";
                    htmlContent += "<span style='font-size:12px;'><b style='color:#1b4590'>شماره قرارداد</b>:&nbsp;";
                    htmlContent += feature.get('AggrementContract');
                    htmlContent += "</span ><br/>";
                    htmlContent += "<span style='font-size:12px;'><b style='color:#1b4590'>مالکيت</b>:&nbsp;";
                    htmlContent += feature.get('Ownership');
                    htmlContent += "</span ><br/>";
                    htmlContent += "<span style='font-size:12px;'><b style='color:#1b4590'>قدرالسهم شهرداری</b>:&nbsp;";
                    htmlContent += feature.get('MunicipalityShareDescription');
                    htmlContent += "</span ><br/>";
                    htmlContent += "<span style='font-size:12px;'><b style='color:#1b4590'>وضعيت نهايی</b>:&nbsp;";
                    htmlContent += feature.get('ProjectStatus');
                    htmlContent += "</span ><br/>";
                    htmlContent += "<span style='font-size:12px;'><b style='color:#1b4590'>نشانی</b>:&nbsp;";
                    htmlContent += feature.get('Address');
                    htmlContent += "</span ><br/>&nbsp;&nbsp;";
                    htmlContent += "<a style='font-size:10px;' target='_blank' href='#' data-addcomment='true' data-targetid='";
                    htmlContent += feature.get(' ProjectPkid');
                    htmlContent += "' > <i class='fa fa-user' /> &nbsp; ثبت پيگيری...</a ></div > ";
                    setTimeout(() => {
                        $(element).popover({
                            'placement': 'top',
                            'html': true,
                            'content': htmlContent
                        });
                        $(element).popover('show');
                    }, 500);
                }
                else if (geometry.getType() === "Point" && projectType == 2) {
                    $(element).popover('destroy');
                    htmlContent += "<div style='font-family:irsans;'>";
                    htmlContent += "<i class='fa fa-arrow-down' style='position:absolute;z-index:100;font-size:22px;color:#fff;left:213px;top:94%;' />";
                    htmlContent += "<b style='font-size:12px;color:#c00'>";
                    htmlContent += feature.get('Address');
                    htmlContent += "</b> ";
                    htmlContent += "<br/>";
                    htmlContent += "<span style='font-size:12px;'><b style='color:#1b4590'>پلاک ثبتی</b>:&nbsp;";
                    htmlContent += feature.get('PSPlate');
                    htmlContent += "</span ><br/>";
                    htmlContent += "<span style='font-size:12px;'><b style='color:#1b4590'>شماره پرونده</b>:&nbsp;";
                    htmlContent += feature.get('FileNo');
                    htmlContent += "</span ><br/>";
                    htmlContent += "<span style='font-size:12px;'><b style='color:#1b4590'>نام ارگان</b>:&nbsp;";
                    htmlContent += feature.get('OrganName');
                    htmlContent += "</span ><br/>";
                    htmlContent += "<span style='font-size:12px;'><b style='color:#1b4590'>عوارض شهرداری</b>:&nbsp;<b style='font-weight:700'>";
                    htmlContent += MoneySeperator(feature.get('AvarezShahrsazi'));
                    htmlContent += "</b></span ><br/>";
                    htmlContent += "<span style='font-size:12px;'><b style='color:#1b4590'>عوارض ايمنی</b>:&nbsp;<b style='font-weight:700'>";
                    htmlContent += MoneySeperator(feature.get('AvarezImeni'));
                    htmlContent += "</b></span ><br/>";
                    htmlContent += "<span style='font-size:12px;'><b style='color:#1b4590'>عوارض حمل و نقل</b>:&nbsp;<b style='font-weight:700'>";
                    htmlContent += MoneySeperator(feature.get('AvarezHamloNaghl'));
                    htmlContent += "</b></span ><br/>";
                    htmlContent += "<span style='font-size:12px;'><b style='color:#1b4590'>عوارض آموزش و پرورش</b>:&nbsp;<b style='font-weight:700'>";
                    htmlContent += MoneySeperator(feature.get('AvarezAmoozeshParvares'));
                    htmlContent += "</b></span ><br/>";
                    htmlContent += "<span style='font-size:12px;'><b style='color:#1b4590'>مجموع</b>:&nbsp;<b style='color:#c00;font-weight:700'>";
                    htmlContent += MoneySeperator(feature.get('AvarezRowTotal'));
                    htmlContent += "<b style='font-weight:700'></span ><br/>&nbsp;&nbsp;";
                    htmlContent += "<a style='font-size:10px;' target='_blank' href='#' data-addmotalebatcomment='true' data-targetid='";
                    htmlContent += feature.get(' ProjectPkid');
                    htmlContent += "' > <i class='fa fa-user' /> &nbsp; ثبت پيگيری...</a ></div > ";
                    setTimeout(() => {
                        $(element).popover({
                            'placement': 'top',
                            'html': true,
                            'content': htmlContent
                        });
                        $(element).popover('show');
                    }, 500);
                }
                else if (geometry.getType() === "Point" && projectType == 3) {
                    $(element).popover('destroy');
                    htmlContent += "<div style='font-family:irsans;'>";
                    htmlContent += "<i class='fa fa-arrow-down' style='position:absolute;z-index:100;font-size:22px;color:#fff;left:213px;top:94%;' />";
                    htmlContent += "<b style='font-size:12px;color:#c00'>";
                    htmlContent += feature.get('Address');
                    htmlContent += "</b> ";
                    htmlContent += "<br/>";
                    htmlContent += "<span style='font-size:12px;'><b style='color:#1b4590'>پلاک ثبتی</b>:&nbsp;";
                    htmlContent += feature.get('PSPlate');
                    htmlContent += "</span ><br/>";
                    htmlContent += "<span style='font-size:12px;'><b style='color:#1b4590'> کد شناسايی</b>:&nbsp;";
                    htmlContent += feature.get('ShenasaeeCode');
                    htmlContent += "</span ><br/>";
                    htmlContent += "<span style='font-size:12px;'><b style='color:#1b4590'>شماره پرونده</b>:&nbsp;";
                    htmlContent += feature.get('FileNo');
                    htmlContent += "</span ><br/>";
                    htmlContent += "<span style='font-size:12px;'><b style='color:#1b4590'>نام مالک</b>:&nbsp;";
                    htmlContent += feature.get('MalekName');
                    htmlContent += "</span ><br/>";
                    htmlContent += "<span style='font-size:12px;'><b style='color:#1b4590'>چک برگشتی</b>:&nbsp;";
                    htmlContent += feature.get('AvarezTypeDesc');
                    htmlContent += "</span ><br/>";
                    htmlContent += "<span style='font-size:12px;'><b style='color:#1b4590'>مبلغ کل</b>:&nbsp;<b style='font-weight:700'>";
                    htmlContent += MoneySeperator(feature.get('MablaghKol'));
                    htmlContent += "</b></span ><br/>&nbsp;&nbsp;";
                    htmlContent += "<a style='font-size:10px;' target='_blank' href='#' data-addSayercomment='true' data-targetid='";
                    htmlContent += feature.get(' ProjectPkid');
                    htmlContent += "' > <i class='fa fa-user' /> &nbsp; ثبت پيگيری...</a ></div > ";
                    setTimeout(() => {
                        $(element).popover({
                            'placement': 'top',
                            'html': true,
                            'content': htmlContent
                        });
                        $(element).popover('show');
                    }, 500);
                }
                else {
                    $(element).popover('destroy');
                }
            } else {
                $(element).popover('destroy');
            }
        });
        _map.on('pointermove', function (e) {
            if (e.dragging) {
                $(element).popover('destroy');
                return;
            }
            var pixel = _map.getEventPixel(e.originalEvent);
            var hit = _map.hasFeatureAtPixel(pixel);
            //displayFeatureInfo(pixel);
            //map.getTarget().style.cursor = hit ? 'hand' : '';
            //console.log(map.getTarget().style.cursor);
        });
        cb(_map)
    };
    var animateMap = (_lat, _lon) => {
        var oldZoom = _map.getView().getZoom();
        var newZoom = 16;
        _map.getView().animate({ center: ol.proj.fromLonLat([_lon, _lat]), zoom: newZoom, duration: 3000, easing: elastic });
    };
    var _utils = {
        GetJSONAsync: function (_url) {
            return $.ajax({
                method: "GET",
                url: _url,
                contentType: "application/json"
            });
        },
        GetJSONParamAsync: function (_url, _data) {
            return $.ajax({
                method: "GET",
                url: _url,
                data: _data,
                contentType: "application/json"
            });
        },
        PostJSONAsync: function (_url, _data) {
            return $.ajax({
                method: "POST",
                url: _url,
                data: _data
            });
        },
    }

    return {
        MainMap: _map,
        MosharekatSource: mosharekatSource,
        MotalebatSource: motalebatSource,
        SayerSource : sayerSource,
        InitMap: initMap,
        Redraw : redraw,
        AnimateMap: animateMap,
        Utils : _utils
    }
}