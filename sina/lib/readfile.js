/**
 * Created by Administrator on 2014/12/1.
 */
var fs=require("fs");
var data=fs.readFileSync('data.txt',{encoding:'utf-8'});
var datas=data.split("\n");

var provincedata=[];
datas.forEach(function(items){
    var item=items.substring(0,items.length-1).split(",");
     var pro={};
     pro.id=item[0];
     pro.featurecode=item[1]+item[2];
    pro.name=item[3];
    pro.isuse=item[4];
    provincedata.push(pro);

})
console.log(provincedata);
