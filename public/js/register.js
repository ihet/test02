/**
 * Created by qxl on 2016/8/4.
 */
var debug=false;
// var serverAddress="http://10.0.0.222:8070/aibbNewServlet?";
// var aibbAddress="http://aibb.51tv.com:8070/huoXiuServlet?";
var serverAddress="/aibbNewServlet?";
var aibbAddress="/huoXiuServlet?";
var actionFirmRegister="firmRegister";
var actionFirmLogin="firmLogin";

function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
//60秒后重新发送
var setVCTimeout=function(time){
    this.stop=false;
    var _self=this;
    var s=time;
    var update=function(){
        $('#getVC').html(s+'秒后重新发送');
        s-=1;
        if(s>1){
            window.setTimeout(function(){
                if(!_self.stop)
                    update(s);
            },1000)
        }
        else{
            $('#getVC').removeClass('disable').html('获取验证码');
        }
    };
    update();
};
var PageLogin=function(){
    //来源url
    this.redirectUrl=null;
    //默认主页，登录成功后跳转来源URL，如果没有就跳转默认主页
    this.defaultUrl="index.html";
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
            $('#vCode').on('blur',function(){
                _self.checkVCode($(this));
            });
        });
        $("#btnRegist").on('click',function(){
            if(_self.checkUsername($('#mail')) && _self.checkVCode($('#vCode')) && _self.checkPSW($('#psd'))){
                console.dir(true);
                _self.checkReg();
            }
        });
        //发送验证码
        $('#getVC').on('click',function(e){
            e.preventDefault();
            if($(this).hasClass('disable')){return;}

            //正确发送验证码后开始倒计时
            _self.sendVCode();
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
    //检查验证码
    checkVCode:function(){
        var val=$("#vCode").val();
        if(val==""){
            return false;
        }
        return true;
    },
    sendVCode:function(){
        //发送验证码
        var _self=this;
        if(!this.checkUsername($("#mail"))){return;}
        $(this).addClass('disable');
        var username=$("#mail").val();
        setVCTimeout(60);
        //发送验证码
        $.ajax({
            url:aibbAddress,
            dataType:'jsonp',
            jsonpCallback:'callback2',
            data:{
                'action':'sendcodeweb',
                'appname':'huoxiu',
                'userphone':username
            }
        }).done(function(data){
            if(data.status=="success"){
                //验证码发送成功
            }
            else{
                _self.regError({'errorCode':data.errorCode});
            }
        }).fail(function(jqXHR,textStatus){
            _self.regError({'errorCode':"网络错误"});
            console.dir("textStatus:"+textStatus);
        });
    },
    checkReg:function(){
        //注册新账号
        var _self=this;
        $.ajax({
            url:serverAddress,
            data:{
                'action':actionFirmRegister,
                'email': $("#mail").val(),
                'emailcode': $("#vCode").val(),
                'password':$("#psd").val(),
                'type':pageType || '1'
            },
            jsonpCallback:'callback',
            dataType:'jsonp'
        }).done(function(data){
            //登录接口获取成功
            if(data.status=="success"){
                //注册成功
                _self.regOK();
            }
            else{
                console.dir(data);
                //登录失败并返回错误原因
                _self.regError({'errorCode':data.errorCode});
            }
        }).fail(function(jqXHR,textStatus){
            _self.regError({'errorCode':"网络错误"});
            console.dir("textStatus:"+textStatus);
        });
    },
    regOK:function(){
        //注册成功后跳转页面，如果有来源页面就跳转到来源页面
        if(this.redirectUrl != null && this.redirectUrl!=""){
            location.href=decodeURI(this.redirectUrl);
        }else{
            location.href=this.defaultUrl;
        }
    },
    regError:function(e){
        if(e && e.errorCode){
            $("#errorMSG").html(e.errorCode);
        }
        else{
            $("#errorMSG").html("注册错误");
        }
    }
}
;
var page=new PageLogin();