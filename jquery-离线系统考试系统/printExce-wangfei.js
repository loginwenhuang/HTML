$(function(){
	
})

var res;// 保存读取完成的数据
// 导入
function impexcel(obj) {
	if (!obj.files) {
		sel.style.display="none";
		return;
	}
	var f = obj.files[0];
	//console.log(f,obj)
	//新建文件读取
	var reader = new FileReader();
	reader.onload = function(e) {
		var data = e.target.result;
		//将文件读取为二进制字符串
		var wb = XLSX.read(data, {type : 'binary'});
		console.log(wb.SheetNames[0]);
		// wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
		// wb.Sheets[Sheet名]获取第一个Sheet的数据
		res=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
		
		sel.style.display="inline-block";
		printQA(20);
	};
	reader.readAsBinaryString(f);
}

//将尖括号转为占位符
function changeZZ(data){
	var rel = data.replace(/[<>]/g, function(m,p,o){
	  if(m === '<') return '&lt;';
	  if(m === '>') return '&gt';
	});
	return rel;
}
var userAnswer=[];//用户保存的答案
var trueAnswer=[];//正确答案
//保存答案的模板
function saveAnswer(objAry,answer,id){
	var a={
		"answer":answer,
		"id":id
	}
	objAry.push(a);
}
function userSubmit(){
	var falg=true;
	$(trueAnswer).each(function(index){
		var str="";
		$("input[name='gn"+this.id+"']:checked").each(function(){
			str+=$(this).val();
		})
		var ta=trueAnswer[index].answer;
		if(str!=ta){
			$("#Anchorpoint a").eq(index).css("background-color","#f2dede");
		}else{
			$("#Anchorpoint a").eq(index).css("background-color","#dff0d8");
		}
		saveAnswer(userAnswer,str,this.id);
	})
	$(".aw").css("display","inline");
}
//打印数据
function printQA(num){
	//先清空数据
	$("#area").empty();
	$("#Anchorpoint").empty();
	trueAnswer.length=0;
	userAnswer.length=0;
	
	if(num=="all"){
		$(res).each(function(index,el){
			createQA(this,index);
		})
		return;
	}
	var n=Number(num);
	var ary=getRandom(n);
	for(var i=0;i<ary.length;i++){
		createQA(res[ary[i]],i);
	}
	
	// $("#area").on("click onchange","input",function(){
	// 	//$("#"+this.name+"").css("background-color","#337ab7");
	// 	//$(document.getElementById("#my"+this.name+"")).css("background-color","#337ab7");
	// })
	
}
//打印到前端
function createQA(obj,index){
	var str=moban.innerHTML;
	if(obj["答案"].length>1){
		str=str.replaceAll("radio","checkbox");
	}
	str=str.replace("nth",index+1)
		.replace("question",changeZZ(obj["题目"]))
		.replace("answer",obj["答案"])
		.replaceAll("gropname","gn"+obj["编号"])
		.replace("opt1",changeZZ(obj["选项A"]))
		.replace("opt2",changeZZ(obj["选项B"]))
		.replace("opt3",changeZZ(obj["选项C"]))
		.replace("opt4",changeZZ(obj["选项D"]));
	var mydiv=document.createElement("div");
	mydiv.innerHTML=str;
	area.appendChild(mydiv);
	var mydiv2=document.createElement("div");
	mydiv2.innerHTML=moban2.innerHTML.replace("gid","#gn"+obj["编号"]).replace("mid",index+1);
	Anchorpoint.appendChild(mydiv2);
	saveAnswer(trueAnswer,obj["答案"],obj["编号"]);
}
function getRandom(n){
	var queLength=res.length;
	var x=function(){return parseInt(Math.random()*queLength);};
	var ary=[x()];
	for(var i=1;i<n;i++){
		var falg=true;
		var num=x();
		for(var j=0;j<i;j++){
			if(ary[j]==num){
				falg=false;
				i--;
				break;
			}
			if(num>queLength){
				console.log(num);
			}
		}
		if(falg){
			ary[i]=num;//ary.push(num)
		}
	}
	ary.sort(function(a, b){return a - b});
	return ary;
}

