function option1 (name) {
    option = {
        series : [
            {
                name: '中国',
                type: 'map',
                mapType: name,
                selectedMode : 'multiple',
                itemStyle:{
                    normal:{label:{show:true}},
                    emphasis:{label:{show:true}}
                },
                data:[]

            }
        ]
    };

    return option;
}