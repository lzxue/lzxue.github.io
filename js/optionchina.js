function chinaOption(chinadata) {
	chinaoption = {
		backgroundColor : '#1b1b1b',
		color : ['rgba(255, 255, 255, 0.8)', 'rgba(14, 241, 242, 0.8)', 'rgba(37, 140, 249, 0.8)'],
		title : {
			text : '签到数据点亮中国',
			x : 'center',
			textStyle : {
				color : '#fff'
			}
		},
		legend : {
			orient : 'vertical',
			x : 'left',
			data : ['强', '中', '弱'],
			textStyle : {
				color : '#fff'
			}
		},
		toolbox : {
			show : true,
			orient : 'vertical',
			x : 'right',
			y : 'center',
			feature : {
				mark : {
					show : true
				},
				dataView : {
					show : true,
					readOnly : false
				},
				restore : {
					show : true
				},
				saveAsImage : {
					show : true
				}
			}
		},
		series : [{
				name : '弱',
				type : 'map',
				mapType : 'china',
				scaleLimit : {
					max : 2,
					min : 0.8
				},
				itemStyle : {
					normal : {
						borderColor : 'rgba(100,149,237,1)',
						borderWidth : 1.5,
						areaStyle : {
							color : '#1b1b1b'
						}
					}
				},
				data : [],
				markPoint : {
					symbolSize : 1,
					large : true,
					effect : {
						show : false
					},
					data : chinadata[0]
				}
			}, {
				name : '中',
				type : 'map',
				mapType : 'china',
				data : [],
				markPoint : {
					symbolSize : 1,
					large : true,
					effect : {
						show : false
					},
					data : chinadata[1]
				}
			}, {
				name : '强',
				type : 'map',
				mapType : 'china',
				hoverable : false,
				roam : false,
				data : [],
				markPoint : {
					symbol : 'diamond',
					symbolSize : 1,
					large : true,
					effect : {
						show : false
					},
					data : chinadata[2]
				}
			}
		]
	}
	return chinaoption;
}
function option0(data, title, mapType) {
	chinaoption = {
		backgroundColor : '#1b1b1b',
		color : ['rgba(255, 255, 255, 0.8)', 'rgba(14, 241, 242, 0.8)', 'rgba(37, 140, 249, 0.8)'],
		title : {
			text : title + "新浪微博POI签到数据可视化",
			x : 'center',
			textStyle : {
				color : '#fff'
			}
		},
		legend : {
			orient : 'vertical',
			x : 'left',
			data : ['强', '中', '弱'],
			textStyle : {
				color : '#fff'
			}
		},
		toolbox : {
			show : true,
			orient : 'vertical',
			x : 'right',
			y : 'center',
			feature : {
				mark : {
					show : true
				},
				dataView : {
					show : true,
					readOnly : false
				},
				restore : {
					show : true
				},
				saveAsImage : {
					show : true
				}
			}
		},
		series : [{
				name : '弱',
				type : 'map',
				mapType : mapType,
				hoverable : false,
				roam : false,
				scaleLimit : {
					max : 2,
					min : 0.8
				},
				itemStyle : {
					normal : {
						borderColor : 'rgba(100,149,237,1)',
						borderWidth : 1.5,
						label : {
							show : true,
							color : "red"
						},
						emphasis : {
							label : {
								show : true
							}
						},
						areaStyle : {
							color : '#1b1b1b'
						}
					}
				},
				data : [],
				markPoint : {
					symbolSize : 1,
					large : true,
					effect : {
						show : true
					},
					data : data[0]
				}
			}, {
				name : '中',
				type : 'map',
				mapType : mapType,
				data : [],
				markPoint : {
					symbolSize : 1,
					large : true,
					effect : {
						show : true
					},
					data : data[1]
				}
			}, {
				name : '强',
				type : 'map',
				backgroundColor : '#1b1b1b',
				mapType : mapType,
				data : [],
				markPoint : {
					symbol : 'diamond',
					symbolSize : 3,
					large : true,
					effect : {
						show : true
					},
					data : data[2]
				}
			}
		]
	}
	return chinaoption;
}
var option2 = {
	title : {
		text : '各省份POI总数'
	},
	tooltip : {
		trigger : 'axis',
		formatter : function (params) {
			var html = "<h4>" + params[0].name + "</h2>";
			html += "POI数：" + params[0].value * 1000 + "（个）<br>";
			html += "签到次数：" + params[1].value * 10000 + "（次）<br>";
			html += "照片数：" + params[2].value * 10000 + "（张）<br>";
			html += "GDP：" + params[3].value * 100 + "（亿元）<br>";
			html += "人口：" + params[4].value + "（万人）<br>";
			return html;
		}
	},
	legend : {
		data : ['POI数（千）', '签到次数（万次）', "照片数（万）", 'GDP(百亿)', "人口（万人)"]
	},
	toolbox : {
		show : true,
		feature : {
			mark : {
				show : true
			},
			dataView : {
				show : true,
				readOnly : false
			},
			magicType : {
				show : true,
				type : ['line', 'bar', 'stack', 'tiled']
			},
			restore : {
				show : true
			},
			saveAsImage : {
				show : true
			}
		}
	},
	calculable : true,
	xAxis : [{
			type : 'category',
		    'axisLabel':{'interval':0},
			data : (function () {
				var data = [];
				 var i=0;
				provincedata.forEach(function (item) {
				   i++;
				 var name=item.name;
				 if(i%2==0)
				   name="\n"+item.name;
					data.push(name)
				})

				return data;
			})()
		}
	],
	yAxis : [{
			type : 'value'
		}
	],
	series : [{
			name : 'POI数（千）',
			type : 'line',
			data : (function () {
				var data = [];
				provincedata.forEach(function (item) {
					data.push(parseInt(item.count / 1000))
				})
				return data;
			})()
		}, {
			name : '签到次数（万次）',
			type : 'line',
			data : (function () {
				var data = [];
				provincedata.forEach(function (item) {
					data.push(parseInt(item.checkin_num / 10000))
				})
				return data;
			})()
		}, {
			name : 'GDP(百亿)',
			type : 'line',
			data : (function () {
				var data = [];
				provincedata.forEach(function (item) {
					data.push(parseInt(item.gdp / 100))
				})
				return data;
			})()
		}, {
			name : '照片数（万）',
			type : 'line',
			data : (function () {
				var data = [];
				provincedata.forEach(function (item) {
					data.push(parseInt(item.photo_num / 10000))
				})
				return data;
			})()
		}, {
			name : "人口（万人)",
			type : 'line',
			data : (function () {
				var data = [];
				citydata.forEach(function (item) {
					data.push(Number(item.pop))
				})
				return data;
			})()
		}
	]
};
var option4 = {
	title : {
		text : '签到人数平均签到次数'
	},
	tooltip : {
		trigger : 'axis'
	},
	legend : {
		data : ["签到次数"]
	},
	toolbox : {
		show : true,
		feature : {
			mark : {
				show : true
			},
			dataView : {
				show : true,
				readOnly : false
			},
			magicType : {
				show : true,
				type : ['bar', 'line']
			},
			restore : {
				show : true
			},
			saveAsImage : {
				show : true
			}
		}
	},
	calculable : true,
	xAxis : [{
			type : 'category',
			data : (function () {
				var data = [];
				provincedata.forEach(function (item) {
					data.push(item.name)
				})
				return data;
			})()
		}
	],
	yAxis : [{
			type : 'value'
		}
	],
	series : [{
			name : "签到次数",
			type : 'line',
			data : (function () {
				var data = [];
				provincedata.forEach(function (item) {
					data.push(item.count)
				})
				return data;
			})()
		}
	]
};
var option5 = {
	title : {
		text : '重点城市可视化'
	},
	tooltip : {
		trigger : 'axis',
		formatter : function (params) {
			var html = "<h4>" + params[0].name + "</h4>";
			html += "房价：" + params[0].value + "（元）<br>";
			html += "POI数：" + params[2].value * 100 + "（个）<br>";
			html += "签到次数：" + params[3].value * 1000 + "（次）<br>";
			html += "照片数：" + params[4].value * 1000 + "（张）<br>";
			html += "GDP：" + params[1].value * 100 + "（亿元）<br>";
			html += "人口：" + params[5].value * 10 + "（万人）<br>";
			return html;
		}
	},
	legend : {
		data : ["房价", "GDP", "POI数", "签到数", "照片数", "人口（千人)"]
	},
	toolbox : {
		show : true,
		feature : {
			mark : {
				show : true
			},
			dataView : {
				show : true,
				readOnly : false
			},
			magicType : {
				show : true,
				type : ['bar', 'line']
			},
			restore : {
				show : true
			},
			saveAsImage : {
				show : true
			}
		}
	},
	calculable : true,
	xAxis : [{
			type : 'category',
            axisLabel:{'interval':0,'textStyle':{'fontSize':8}},
            data : (function () {
                var data = [];
                var i=0;
                citydata.forEach(function (item) {
                   i++;
                   var name="";
                     i%3==0 ? name=item.name :i%3==1 ? name="\n"+item.name:name="\n\n"+item.name;
                    data.push(name)
                })
                return data;
		   })()
		   }
	],
	yAxis : [{
			type : 'value'
		}
	],
	series : [{
			name : "房价",
			type : 'line',
			data : (function () {
				var data = [];
				citydata.forEach(function (item) {
					data.push(Number(item.price))
				})
				return data;
			})()
		}, {
			name : "GDP",
			type : 'line',
			data : (function () {
				var data = [];
				citydata.forEach(function (item) {
					data.push(Number(item.gdp))
				})
				return data;
			})()
		}, {
			name : "POI数",
			type : 'line',
			data : (function () {
				var data = [];
				citydata.forEach(function (item) {
					data.push(Number(item.count) / 100)
				})
				return data;
			})()
		}, {
			name : "签到数",
			type : 'line',
			data : (function () {
				var data = [];
				citydata.forEach(function (item) {
					data.push(Number(item.checkin_num) / 1000)
				})
				return data;
			})()
		}, {
			name : "照片数",
			type : 'line',
			data : (function () {
				var data = [];
				citydata.forEach(function (item) {
					data.push(Number(item.photo_num) / 1000)
				})
				return data;
			})()
		}, {
			name : "人口（万人)",
			type : 'line',
			data : (function () {
				var data = [];
				citydata.forEach(function (item) {
					data.push(Number(item.pop * 10))
				})
				return data;
			})()
		}
	]
};
var option6 = {
	title : {
		text : '重点城市可视化'
	},
	tooltip : {
		trigger : 'axis'
	},
	legend : {
		data : ["GDP", "POI数(个)", '照片数', '人口', '签到数']
	},
	toolbox : {
		show : true,
		feature : {
			mark : {
				show : true
			},
			dataView : {
				show : true,
				readOnly : false
			},
			magicType : {
				show : true,
				type : ['bar', 'line']
			},
			restore : {
				show : true
			},
			saveAsImage : {
				show : true
			}
		}
	},
	calculable : true,
	xAxis : [{
			type : 'category',
			'axisLabel':{'interval':0},
			data : (function () {
				var data = [];
				var i=0;
				citydata.forEach(function (item) {
				   i++;
				   var name="";
				    i%2==0? name=item.name :name="\n"+item.name;
					data.push(name)
				})
				return data;
			})()
		}
	],
	yAxis : [{
			type : 'value'
		}
	],
	series : [{
			name : "GDP(十亿)",
			type : 'line',
			data : (function () {
				var data = [];
				citydata.forEach(function (item) {
					data.push(Number(item.gdp) * 10)
				})
				return data;
			})()
		}, {
			name : "POI数（个）",
			type : 'line',
			data : (function () {
				var data = [];
				citydata.forEach(function (item) {
					data.push(Number(item.count))
				})
				return data;
			})()
		}, {
			name : "照片数（十）",
			type : 'line',
			data : (function () {
				var data = [];
				citydata.forEach(function (item) {
					data.push(Number(item.photo_num) / 10)
				})
				return data;
			})()
		}, {
			name : "人口（百万）",
			type : 'line',
			data : (function () {
				var data = [];
				citydata.forEach(function (item) {
					data.push(Number(item.pop) * 100)
				})
				return data;
			})()
		}, {
			name : "签到数（百）",
			type : 'line',
			data : (function () {
				var data = [];
				citydata.forEach(function (item) {
					data.push(Number(item.checkin_num) / 100)
				})
				return data;
			})()
		}
	]
};
var placeHoledStyle = {
	normal : {
		barBorderColor : 'rgba(0,0,0,0)',
		color : 'rgba(0,0,0,0.2)'
	},
	emphasis : {
		barBorderColor : 'rgba(0,0,0,0)',
		color : 'rgba(0,0,0,0.2)'
	}
};
var dataStyle = {
	normal : {
		label : {
			show : true,
			position : 'insideLeft',
			formatter : '{c}',
			textStyle : {
				color : '#000'
			}
		}
	}
};
option81 = {
	title : {
		text : 'POI数据分布'
	},
	tooltip : {
		trigger : 'axis',
		axisPointer : {
			type : 'shadow'
		}
	},
	legend : {
		y : 55,
		data : ['签到数', 'POI数', '照片数'],
		selected : {
			'POI数' : false,
			'照片数' : false
		},
		selectedMode : "single"
	},
	toolbox : {
		show : true,
		feature : {
			mark : {
				show : true
			},
			dataView : {
				show : true,
				readOnly : false
			},
			restore : {
				show : true
			},
			saveAsImage : {
				show : true
			}
		}
	},
	grid : {
		y : 80,
		y2 : 30
	},
	xAxis : [{
			type : 'value',
			position : 'top',
			splitLine : {
				show : false
			},
			axisLabel : {
				show : false
			}
		}
	],
	yAxis : [{
			type : 'category',
			splitLine : {
				show : false
			},
			data : (function () {
				var data = [];
                provincedata.sort(function(a,b){
                				  if(a.count>b.count)
                				    return 1;
                				  else
                				   return -1;

                				})
				provincedata.forEach(function (item) {
					data.push(item.name)
				})
				return data;
			})()
		}
	],
	series : [{
			name : 'POI数',
			type : 'bar',
			itemStyle : dataStyle,
			data : (function () {
				var data = [];
				provincedata.sort(function(a,b){
                				  if(a.count>b.count)
                				    return 1;
                				  else
                				   return -1;

                				})
				provincedata.forEach(function (item) {
					data.push(parseInt(item.count))
				})
				return data;
			})()
		}, {
			name : '照片数',
			type : 'bar',
			itemStyle : dataStyle,
			data : (function () {
				var data = [];
				provincedata.sort(function(a,b){
                  if(a.photo_num>b.photo_num)
                    return 1;
                  else
                   return -1;

                })
				provincedata.forEach(function (item) {
					data.push(parseInt(item.photo_num))
				})
				return data;
			})()
		}, {
			name : '签到数',
			type : 'bar',
			itemStyle : dataStyle,
			data : (function () {
				var data = [];
				provincedata.sort(function(a,b){
                      if(a.checkin_num>b.checkin_num)
                        return 1;
                      else
                       return -1;

                    })
				provincedata.forEach(function (item) {
					data.push(parseInt(item.checkin_num))
				})
				return data;
			})()
		}
	]
};
option8 = {
	tooltip : {
		trigger : 'item',
		axisPointer : {
			type : 'shadow'
		}
	},
	legend : {
		y : 40,
		data : (function () {
			var data = [];
			provincedata.forEach(function (item) {
				data.push(item.name)
			})
			return data;
		})()
	},
	toolbox : {
		show : true,
		feature : {
			mark : {
				show : true
			},
			dataView : {
				show : true,
				readOnly : false
			},
			magicType : {
				show : true,
				type : ['line', 'bar', 'stack', 'tiled']
			},
			restore : {
				show : true
			},
			saveAsImage : {
				show : true
			}
		}
	},
	calculable : true,
	grid : {
		y : 100
	},
	xAxis : [{
			type : 'value'
		}
	],
	yAxis : [{
			type : 'category',
			data : ["POI数量", "签到数", "照片数"]
		}
	],
	series : (function () {
		var series = [];
		provincedata.forEach(function (item) {
			var serie = {
				type : 'bar',
				stack : '总量',
				barHeight : 80,
				itemStyle : {
					normal : {
						label : {
							show : false,
							position : 'insideRight'
						}
					}
				}
			};
			serie.name = item.name;
			serie.data = [item.count * 20, item.checkin_num, item.photo_num * 2];
			series.push(serie);
		})
		return series;
	})()
};
option7 = {
	title : {
		text : '签到数与GDP的关系散点图'
	},
	tooltip : {
		trigger : 'axis',
		showDelay : 0,
		axisPointer : {
			type : 'cross',
			lineStyle : {
				type : 'dashed',
				width : 1
			}
		}
	},
	legend : {
		data : ['地区']
	},
	toolbox : {
		show : true,
		feature : {
			mark : {
				show : true
			},
			dataZoom : {
				show : true
			},
			dataView : {
				show : true,
				readOnly : false
			},
			restore : {
				show : true
			},
			saveAsImage : {
				show : true
			}
		}
	},
	xAxis : [{
			type : 'value',
			scale : true,
			axisLabel : {
				formatter : '{value} 次'
			}
		}
	],
	yAxis : [{
			type : 'value',
			scale : true,
			axisLabel : {
				formatter : '{value} 亿'
			}
		}
	],
	series : [{
			name : '地区',
			type : 'scatter',
			 symbolSize: function (value){
			      var size=Math.round(value[0] /100000);
                  if(size>15)
			          size=15;
                    return size;
               },
			tooltip : {
				trigger : 'item',
				formatter : function (params) {
				    var city="";
					if (params.value.length > 1) {

					    citydata.forEach(function (item) {
					      if(Number(item.checkin_num)==params.value[0])
					         city=item.name;
					    })
						return "<h4>"+city+':<\h4>'+"签到次数"+params.value[0]+'次<br>'+"GDP"+params.value[1] +'亿';
//

					} else {
						return params.seriesName + ' :<br/>'
						+params.name + ' : '
						+params.value + '亿';
					}
				}
			},
			data : (function () {
				var datas = [];
				citydata.forEach(function (item) {
					var data = [Number(item.checkin_num), Number(item.gdp)];
					datas.push(data);
				});
				return datas;
			})()
		}
	]
};
function option10(topdata) {
	var option = {
		title : {
			text : 'TOP100类型百分比',
			x : 'center'
		},
		tooltip : {
			trigger : 'item',
			formatter : "<h4>{b}</h4>个数 :{c}<br>百分比： {d}%"
		},
		legend : {
			orient : 'vertical',
			x : 'left',
			data : (function () {
				var data = [];
				for (var a in topdata) {
					data.push(a);
				}
				return data;
			})()
		},
		toolbox : {
			show : true,
			feature : {
				mark : {
					show : true
				},
				dataView : {
					show : true,
					readOnly : false
				},
				magicType : {
					show : true,
					type : ['pie', 'funnel'],
					option : {
						funnel : {
							x : '25%',
							width : '50%',
							funnelAlign : 'left',
							max : 30
						}
					}
				},
				restore : {
					show : true
				},
				saveAsImage : {
					show : true
				}
			}
		},
		calculable : true,
		series : [{
				name : 'POI数',
				type : 'pie',
				radius : '60%',
				center : ['50%', '60%'],
				data : (function () {
					var data = [];
					for (var a in topdata) {
						data.push({
							value : topdata[a],
							name : a
						})
					}
					data.sort(function(a,b){
					     if(a.value>b.value)
                        	return 1;
                          else
                         return -1;

					})
					return data;
				})()
			}
		]
	};
	return option;
}
var option3 = {
	title : {
		text : '各省POI数量百分比',
		x : 'center'
	},
	tooltip : {
		trigger : 'item',
		formatter : "<h4>{b}</h4>POI数: {c}<br>百分比： {d}%"
	},
	legend : {
		orient : 'vertical',
		x : 'left',
		data : (function () {
			var data = [];
			provincedata.forEach(function (item) {
				data.push(item.name)
			})
			return data;
		})()
	},
	toolbox : {
		show : true,
		feature : {
			mark : {
				show : true
			},
			dataView : {
				show : true,
				readOnly : false
			},
			magicType : {
				show : true,
				type : ['pie', 'funnel'],
				option : {
					funnel : {
						x : '25%',
						width : '50%',
						funnelAlign : 'left',
						max : 800000
					}
				}
			},
			restore : {
				show : true
			},
			saveAsImage : {
				show : true
			}
		}
	},
	calculable : true,
	series : [{
			name : 'POI数',
			type : 'pie',
			radius : '60%',
			center : ['50%', '50%'],
			data : (function () {
				var data = [];
				provincedata.sort(function(a,b){
				  if(a.count>b.count)
				    return 1;
				  else
				   return -1;

				})
				provincedata.forEach(function (item) {
					data.push({
						value : item.count,
						name : item.name
					})
				})
				return data;
			})()
		}
	]
};
function option9(top100checknum) {
	var i = 0;
	var topitem = "";
	top100checknum.forEach(function (item) {
		i++;
		if (i > 10)
			return;
		topitem += "<div class=\"panel panel-default\">" + "<div class=\"panel-heading\" role=\"tab\" id=\"heading" + i + "\">" + "<h4 class=\"panel-title\">" + " <a data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#collapse" + i + "\" aria-expanded=\"true\" aria-controls=\"collapse" + i + "\">" +
		i + "." + item.title + " </a>" + "</h4>" + "  </div>" + "<div id=\"collapse" + i + "\" class=\"panel-collapse collapse in\" role=\"tabpanel\" aria-labelledby=\"heading" + i + "\">" + "<div class=\"panel-body\">" + "地点：" + item.poi_street_address + "<br>签到次数：" + item.checkin_num + "<br>照片数：" + item.photo_num + "<br>POI类型：" + item.category_name + "</div>" + "</div>" + "</div>" + " </div>"
	});
	$("#accordion").html(topitem);
	$('.collapse').collapse();
	var option = {
		title : {
			text : '签到次数TOP100',
			x : 'center',
			textStyle : {
				color : '#fff'
			}
		},
		tooltip : {
			trigger : 'item',
			 formatter: function (v) {
                       console.log(v);
                       var html="";
                      top100checknum.forEach(function(item){

                           if(item.title==v[1])
                           {

                            html="<h4>"+item.title+":</h4>"+"排名："+v[2]+"<br>地点："+item.poi_street_address+"<br>POI类型："+item.category_name+"<br>签到数："+item.checkin_num+"<br>照片数："+item.photo_num;

                           }

                      });
                      return html;
                    }
		},
		legend : {
			orient : 'vertical',
			x : 'left',
			data : ["签到次数Top100"]
		},
		dataRange : {
			min : 0,
			max : 100,
			x : 'left',
			y : 'bottom',
			text : ['低', '高'],
			calculable : true,
			color : ['lightgreen','yellow','orange','red',]
		},
		toolbox : {
			show : true,
			orient : 'vertical',
			x : 'right',
			y : 'center',
			feature : {
				mark : {
					show : true
				},
				dataView : {
					show : true,
					readOnly : false
				},
				restore : {
					show : true
				},
				saveAsImage : {
					show : true
				}
			}
		},
		series : [{
				name : '签到次数Top100',
				type : 'map',
				mapType : 'china',
				hoverable : false,
				roam : false,
				data : [],
				markPoint : {
					symbolSize : function (value) {
						return 15 - value/ 10;
					},
					itemStyle : {
						normal : {
							borderColor : '#87cefa',
							borderWidth : 1,
							label : {
								show : true
							}
						},
						emphasis : {
							borderColor : '#1e90ff',
							borderWidth : 5,
							label : {
								show : false
							}
						}
					},
					data : (function () {
						var data = [];
						for (var i = 10; i < top100checknum.length; i++) {
							data.push({
								name : top100checknum[i].title,
								value : i+1
							});
						}
						return data;
					})()
				},
				geoCoord : (function () {
					var data = {};
					for (var i = 0; i < top100checknum.length; i++) {
						data[top100checknum[i].title] = [top100checknum[i].lon, top100checknum[i].lat];
					}
					return data;
				})()
			}, {
				name : 'Top10',
				type : 'map',
				mapType : 'china',
				data : [],
				markPoint : {
					symbolSize : function (value) {
						return 15 - value / 10;
					},
					itemStyle : {
						normal : {
							label : {
								show : true,

							}
						}
					},
					data : (function () {
						var data = [];
						for (var i = 0; i < 10; i++) {
							data.push({
								name : top100checknum[i].title,
								value : i+1
							});
						}
						return data;
					})()
				}
			}
		]
	};
	return option;
}
option91 = {
	title : {
		text : '全国主要城市空气质量（pm2.5）',
		subtext : 'data from PM25.in',
		sublink : 'http://www.pm25.in',
		x : 'center'
	},
	tooltip : {
		trigger : 'item'
	},
	legend : {
		orient : 'vertical',
		x : 'left',
		data : ['pm2.5']
	},
	dataRange : {
		min : 0,
		max : 100,
		x : 'left',
		y : 'bottom',
		text : ['低', '高'],
		calculable : true,
		color : ['lightgreen', 'yellow', 'orange', 'red']
	},
	toolbox : {
		show : true,
		orient : 'vertical',
		x : 'right',
		y : 'center',
		feature : {
			mark : {
				show : true
			},
			dataView : {
				show : true,
				readOnly : false
			},
			restore : {
				show : true
			},
			saveAsImage : {
				show : true
			}
		}
	},
	series : [{
			name : 'pm2.5',
			type : 'map',
			mapType : 'china',
			hoverable : false,
			roam : false,
			data : [],
			markPoint : {
				symbolSize : function (value) {
					return 15 - value / 10;
				},
				itemStyle : {
					normal : {
						borderColor : '#87cefa',
						borderWidth : 1,
						label : {
							show : true
						}
					},
					emphasis : {
						borderColor : '#1e90ff',
						borderWidth : 5,
						label : {
							show : false
						}
					}
				},
				data : (function () {
					var data = [];
					for (var i = 10; i < top100checknum.length; i++) {
						data.push({
							name : top100checknum[i].title,
							value : i + 1
						});
					}
					return data;
				})()
			},
			geoCoord : (function () {
				var data = {};
				for (var i = 0; i < top100checknum.length; i++) {
					data[top100checknum[i].title] = [top100checknum[i].lon, top100checknum[i].lat];
				}
				return data;
			})()
		}, {
			name : 'Top10',
			type : 'map',
			mapType : 'china',
			data : [],
			markPoint : {
				symbol : 'star',
				symbolSize : function (value) {
					return 13 - value / 10;
				},
				effect : {
					show : true,
					shadowBlur : 0
				},
				itemStyle : {
					normal : {
						label : {
							show : true
						}
					}
				},
				data : (function () {
					var data = [];
					for (var i = 0; i < 10; i++) {
						data.push({
							name : top100checknum[i].title,
							value : i + 1
						});
					}
					return data;
				})()
			}
		}
	]
};
function getmapname(title) {
	var code = "";
	provincedata.forEach(function (item) {
		if (item.name == title) {
			code = "map" + item.code + ".json";
		}
	})
	return code;
}
function setprovincebutton() {
	var item = "";
	provincedata.forEach(function (province) {
		item += "<button type=\"button\" onclick=showProvinceMap(\'" + province.name + "\') class=\"btn btn-default\">" + province.name + "</button>";
	})
	document.getElementById("province").innerHTML = item;
}
function showchinaMap(myChart0) {
	$.get("./result/china.json", function (data) {
		var optionMap = chinaOption(data);
		myChart0.setOption(optionMap);
		myChart0.hideLoading();
		myChart0.resize();
	})
}
function showProvinceMap(title) {
	var name = getmapname(title);
	myChart1.showLoading({
		effect : 'bubble'
	});
	myChart1.clear();
	$.get("./result/" + name, function (data) {
		var optionMap = option0(data, title, title);
		myChart1.setOption(optionMap);
		myChart1.hideLoading();
		myChart1.resize();
	})
}
$("#photonum").click(function () {
	var op = option9(top100photonum)
		myChart9.setOption(op);
	myChart9.hideLoading();
	myChart10.setOption(option10(photostat));
	myChart10.hideLoading();
})
$("#checkinNum").click(function () {
	var op = option9(top100checknum)
		myChart9.setOption(op);
	myChart9.hideLoading();
	myChart10.setOption(option10(checknum));
	myChart10.hideLoading();
})
