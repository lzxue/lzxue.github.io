option2 = {
    title : {
        text: '各省份POI总数'

    },
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data:['POI数','签到次数','GDP(亿)']
    },
    toolbox: {
        show : true,
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            data : dataid
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        {
            name:'POI数',
            type:'line',
            data:datacount
        },
        {
            name:'签到次数',
            type:'line',
            data:dataNum
        },
        {
            name:'GDP(亿)',
            type:'line',
            data:(function(){
                var datas=[];
                provincedata.forEach(function(item){
                    datas.push(item.gdp*1000);
                })
                return datas;
            })()
        }
    ]
};
option4= {
    title : {
        text: '签到人数平均签到次数'

    },
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data:["签到次数"]
    },
    toolbox: {
        show : true,
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            magicType : {show: true, type: ['bar','line']},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            data : dataid
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        {
            name:"签到次数",
            type:'line',
            data:dataaveChe
        }

    ]
};
                    