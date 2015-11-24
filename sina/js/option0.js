var mapcode=[

    {
        "_id": "新疆",
        "code":"65"

    },

    {
        "_id": "西藏",

        "code":"54"

    },
    /* 5 */
    {
        "_id": "内蒙古",
        "code":"15"

    },

    /* 29 */
    {
        "_id": "青海",
        "code":"63"
    },
    /* 23 */
    {
        "_id": "四川",

        "code":"51"

    },
    /* 8 */
    {
        "_id": "黑龙江",

        "code":"23"

    },
    /* 28 */
    {
        "_id": "甘肃",

        "code":"62"

    },

    /* 25 */
    {
        "_id": "云南",

        "code":"53"

    },

    /* 20 */
    {
        "_id": "广西",
        "code":"45"

    },
    /* 18 */
    {
        "_id": "湖南",
        "code":"43"

    },
    /* 27 */
    {
        "_id": "陕西",
        "code":"61"

    },
    /* 3 */
    {
        "_id": "河北",
        "code":"13"

    },
    /* 7 */
    {
        "_id": "吉林",
        "code":"22"

    },
    /* 17 */
    {
        "_id": "湖北",
        "code":"42"

    },


    /* 19 */
    {
        "_id": "广东",
        "code":"44"

    },

    /* 24 */
    {
        "_id": "贵州",
        "code":"52"

    },

    /* 14 */
    {
        "_id": "江西",
        "code":"36"

    },

    /* 16 */
    {
        "_id": "河南",
        "code":"41"

    },


    /* 4 */
    {
        "_id": "山西",
        "code":"14"

    },
    /* 15 */
    {
        "_id": "山东",
        "code":"37"
    },

    /* 6 */
    {
        "_id": "辽宁",
        "code":"21"
    },


    /* 12 */
    {
        "_id": "安徽",
        "code":"34"
    },

    /* 13 */
    {
        "_id": "福建",
        "code":"35"
    },

    /* 10 */
    {
        "_id": "江苏",
        "code":"32"
    },

    /* 11 */
    {
        "_id": "浙江",
        "code":"33"
    },

    /* 22 */
    {
        "_id": "重庆",
        "code":"50"
    },


    /* 30 */
    {
        "_id": "宁夏",
        "code":"64"

    },


    {
        "_id": "台湾",
        "code":"88"

    },


    /* 21 */
    {
        "_id": "海南",
        "code":"46"

    },


    {
        "_id": "北京",
        "code":"11"

    },

    /* 2 */
    {
        "_id": "天津",
        "code":"12"

    },


    /* 9 */
    {
        "_id": "上海",
        "code":"31"

    },


    /* 32 */
    {
        "_id": "香港",
        "code":"81"

    },

    /* 33 */
    {
        "_id": "澳门",
        "code":"82"

    }
];
function getmapname(title){
    var code="";
    mapcode.forEach(function(item){

       if(item._id==title){
           code="map"+item.code+".json";
       }
    })

    return code;
}
function option0 (data,title,mapType) {

    chinaoption = {
       backgroundColor: '#1b1b1b',
        color: [
            'rgba(255, 255, 255, 0.8)',
            'rgba(14, 241, 242, 0.8)',
            'rgba(37, 140, 249, 0.8)'
        ],
        title : {
            text: title+"新浪微博POI签到数据可视化",

            x:'center',
            textStyle : {
                color: '#fff'
            }
        },
        legend: {
            orient: 'vertical',
            x:'left',
            data:['强','中','弱'],
            textStyle : {
                color: '#fff'
            }
        },
        toolbox: {
            show : true,
            orient : 'vertical',
            x: 'right',
            y: 'center',
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        series : [
            {
                name: '弱',
                type: 'map',
                mapType: mapType,
                scaleLimit:{max:2,min:0.8},
                itemStyle:{
                    normal:{
                        borderColor:'rgba(100,149,237,1)',
                        borderWidth:1.5,
                        label:{show:true,color:"red"},
                        emphasis:{label:{show:true}},
                        areaStyle:{
                            color: '#1b1b1b'
                        }
                    }
                },
                data : [],
                markPoint : {
                    symbolSize: 1,
                    large: true,
                    effect : {
                        show: true
                    },
                    data : data[0]
                }
            },
            {
                name: '中',
                type: 'map',
                mapType: mapType,
                data : [],
                markPoint : {
                    symbolSize: 1,
                    large: true,
                    effect : {
                        show: true
                    },
                    data : data[1]
                }
            },
            {
                name: '强',
                type: 'map',
                backgroundColor: '#1b1b1b',
                mapType: mapType,
                hoverable: false,
                roam:true,
                data : [],
                markPoint : {
                    symbol : 'diamond',
                    symbolSize: 3,
                    large: true,
                    effect : {
                        show: true
                    },
                    data : data[2]
                }
            }
        ]
    }

    return chinaoption;
}