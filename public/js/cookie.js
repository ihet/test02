//设置cookie 
function setCookie(c_name, value, expiredays){
var exdate=new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie=c_name+ "=" + escape(value) + ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
}

//根据时间设置cookie
function setCookieTime(c_name,value,time){
    var exdate = new Date(time);
    document.cookie=c_name+ "=" + escape(value) + ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
}
//设置当天的cookie
function setCookieToday(c_name,value){
    var adate = new Date();
    var anum = adate.getTime();
    var nowDayTime =Math.floor((Math.floor(anum/1000)+3600*8)%86400);
    var exdate = new Date(anum+(86400-nowDayTime)*1000);
  //  var exdate = new Date(time);
    document.cookie=c_name+ "=" + escape(value) +   ";expires="+exdate.toGMTString();
}

// 获取cookie
function getCookie(c_name){
　　　　if (document.cookie.length>0){　　// 先查询cookie是否为空，为空就return ""
　　　　　　c_start=document.cookie.indexOf(c_name + "=")　　// 通过String对象的indexOf()来检查这个cookie是否存在，不存在就为
														// -1
　　　　　　if (c_start!=-1){ 
　　　　　　　　c_start=c_start + c_name.length+1　　// 最后这个+1其实就是表示"="号啦，这样就获取到了cookie值的开始位置
　　　　　　　　c_end=document.cookie.indexOf(";",c_start)　　// 其实我刚看见indexOf()第二个参数的时候猛然有点晕，后来想起来表示指定的开始索引的位置...这句是为了得到值的结束位置。因为需要考虑是否是最后一项，所以通过";"号是否存在来判断
　　　　　　　　if (c_end==-1) c_end=document.cookie.length　　
　　　　　　　　return unescape(document.cookie.substring(c_start,c_end))　　// 通过substring()得到了值。想了解unescape()得先知道escape()是做什么的，都是很重要的基础，想了解的可以搜索下，在文章结尾处也会进行讲解cookie编码细节
　　　　　　} 
　　　　}
　　　　return ""
　　}

//删除cookies 
function delCookie1(name) 
{ 
    var exp = new Date(); 
    exp.setTime(exp.getTime() - 1); 
    var cval=getCookie(name); 
    if(cval!=null) 
        document.cookie= name + "="+cval+";expires="+exp.toGMTString()+";path=/;domain=.51tv.com"; 
} 
