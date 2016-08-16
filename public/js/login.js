/**
 * Created by qxl on 2016/8/4.
 */
var debug=false;
// var serverAddress="http://10.0.0.222:8070/aibbNewServlet?";
var serverAddress="/aibbNewServlet?";
var actionFirmRegister="firmRegister";
var actionFirmLogin="firmLogin";

function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
var PageLogin=function(){
    //来源url
    this.redirectUrl=null;
    //默认主页，登录成功后跳转来源URL，如果没有就跳转默认主页
    this.defaultUrl="homePage.jsp";
    this.init();
};
PageLogin.prototype={
    init:function(){
        var _self=this;
        $(document).ready(function(){
            $('#mail').on('blur',function(){
                _self.checkUsername($(this));
            });
            $('#psd').on('blur',function(){
                _self.checkPSW($(this));
            });
        });
        $("#btnLogin").on('click',function(){
            if(_self.checkUsername($('#mail')) && _self.checkPSW($('#psd'))){
                console.dir(true);
                _self.checkLogin();
            }
        });
        //初始化来源URL
        this.redirectUrl=GetQueryString("redirectUrl");
    },
    //检查密码
    checkPSW:function($dom){
        var psdValue = document.getElementById('psd').value;
        // var psd = /^(?=.{6,16}$)(?![0-9]+$)(?!.*(.).*\1)[0-9a-zA-Z]+$/;
        var psd = /[0-9a-zA-Z]{6,16}/;
        if (psd.test(psdValue)) {
            $dom.parent(".inputWrapper").siblings(".tips").html("");
            return true;
        }
        else if(psdValue == ''){
            $dom.parent(".inputWrapper").siblings(".tips").html("密码不能为空");
        }
        else{
            $dom.parent(".inputWrapper").siblings(".tips").html("请输入6-12位数字字母组合的密码");
        };
        return false;
    },
    //检查用户名
    checkUsername:function($dom){
        var phone = document.getElementById('mail').value;
        var tel = phone;
        var reg = /^0?1[3|4|5|8][0-9]\d{8}$/;
        var numbers = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        // if (reg.test(tel)) {
        //     /*alert("正确");*/
        //     $dom.parent(".inputWrapper").siblings(".tips").html("正确");
        //     return true;
        // }
        if(numbers.test(tel)){
            /*alert("正确");*/
            $dom.parent(".inputWrapper").siblings(".tips").html("");
            return true;
        }
        else if(phone == ''){
            /* alert("账号不能为空");*/
            $dom.parent(".inputWrapper").siblings(".tips").html("账号不能为空");
        }
        else{
            /*alert("请输入正确的手机号或邮箱格式");*/
            $dom.parent(".inputWrapper").siblings(".tips").html("账号格式错误，请输入注册时的邮箱");
        };
        return false;
    },
    checkLogin:function(){
        //验证登录
        var _self=this;
        $.ajax({
            url:serverAddress,
            data:{
                'action':actionFirmLogin,
                'email': $("#mail").val(),
                'password':$("#psd").val()
            },
            jsonpCallback:'callback',
            dataType:'jsonp'
        }).done(function(data){
            console.dir(data);
            //登录接口获取成功
            if(data.status=="success"){
                //登录成功
                _self.loginOK();
            }
            else{
                //登录失败并返回错误原因
                _self.loginError({'errorCode':data.errorCode});
            }
        }).fail(function(jqXHR,textStatus){
            _self.loginError({'errorCode':"网络错误"});
            console.dir("textStatus:"+textStatus);
        });
    },
    loginOK:function(){
        //登陆成功后跳转页面，如果有来源页面就跳转到来源页面
        if(this.redirectUrl != null && this.redirectUrl!=""){
            location.href=decodeURI(this.redirectUrl);
        }else{
            location.href=this.defaultUrl;
        }
    },
    loginError:function(e){
        if(e && e.errorCode){
            $("#errorMSG").html(e.errorCode);
        }
        else{
            $("#errorMSG").html("登录错误");
        }
    }
}
;
var page=new PageLogin();