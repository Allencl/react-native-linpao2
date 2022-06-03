import React,{Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {origin} from './origin';     // 服务地址

import {DeviceEventEmitter} from 'react-native';
import { Toast } from '@ant-design/react-native';
import { Base64 } from 'js-base64';
import JSEncrypt from 'jsencrypt/bin/jsencrypt.min.js'


// 密钥
const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDDUWQteEr5ZCpOgO0NJ7SM706M\n' +
  'fUleLNxE/8tYhiEkViZ1TISv1oycR8oxO2PCQEAp8ek+RxpJVxGmhl6PWUIVCvr4\n' +
  'ZhBBv3B1aRhq1o5ZIvBkosDnFm+jWfX/LJ4R4uXMHXS7/xxPSz8OKOMs2IG9KdOq\n' +
  '+TLKFsTgqjKDWuOL9QIDAQAB'
const privateKey = 'MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAMNRZC14SvlkKk6A\n' +
  '7Q0ntIzvTox9SV4s3ET/y1iGISRWJnVMhK/WjJxHyjE7Y8JAQCnx6T5HGklXEaaG\n' +
  'Xo9ZQhUK+vhmEEG/cHVpGGrWjlki8GSiwOcWb6NZ9f8snhHi5cwddLv/HE9LPw4o\n' +
  '4yzYgb0p06r5MsoWxOCqMoNa44v1AgMBAAECgYEAsE9NZbo7u4oOopTA52obEkmH\n' +
  'F0yVKPzHzUU2Mu/JBPr7dlEfSXcbsIshWnWo5JWJFhP4Hy6h7Og6155dx3qkKbOL\n' +
  'FQ9Shwr6ffJ8obLhmdQHIBCt5j58bth7oBGO/kCRGKAtCCnzfwJn/OuwSLQDgUkd\n' +
  '/ED9euQt7wXGj4zsGBUCQQDy8qvkGm2WeGTDCw/3DBswGK3yY591E45Gpn8bdddI\n' +
  'ByTWQpCsW6PlVQhYPe8ugUn1DWU7p9qo5Nbl7HXO2D6TAkEAzc+m0BH42WVaEyDi\n' +
  'JJa8yLQQk67b2jWIeg+NlJhNk+1dkLowPlVdd8F2GPDuxF4Cfnnsg/XP3OSxh5Ap\n' +
  'RSWYVwJAEUkw78btmzIvwSztUt+ao55t6fwqoVLl4aMBEjwdODPB7DjKQGk4zR1y\n' +
  'vYySkxWB5JyyYj88MJ4vqCZd73y1XwJAD9l4+DcaGevTNvvmTnkJSs+LI0RpC/Hp\n' +
  'c7T060ebWdQCy517D6HVU96jMKKFULwIpyLOkw8AFfvKrCzu8LNHewJBALFSNdle\n' +
  'XX5yzD1eMbIRTMKZ8PlD8JdFoPjX7sq5JLURjPkoc/Z6kNoLpDrvgW4U0Ipk/xiz\n' +
  'Yn9C33IPqIqjg5k='



// 加密
function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对数据进行加密
}

// 解密
function decrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey) // 设置私钥
  return encryptor.decrypt(txt) // 对数据进行解密
} 



/**
 * 网络请求的工具类
 * 方法是静态的 可以直接 WISHttpUtils.post|get
 */
export default class WISHttpUtils extends Component{

    constructor(props){
        super(props); 
    }

    /**
     * 获取服务器 地址
     */
    static getHttpOrigin(){  
        return origin;
    }  

    /**
     * 获取 用户数据
     */
    static getUserData(option={}){

        // this.post("api-user/main",{
        //     params:{
        //         userId: option["id"]
        //     },
        //     hideLoading:true
        // },(result) => {

        //     if(result){
        //         try{
        //             // 缓存 登录数据
        //             AsyncStorage.setItem("login_config",JSON.stringify(result.data));
        //         } catch (error) {
        //         } 
        //     }
        // });


        // 登录信息
        // this.post("api-supply/main",{
        //     params:{
        //         userId: option["id"]
        //     },
        //     hideLoading:true
        // },(result) => {

        //     if(result){
        //         try{

        //             // 缓存 登录数据
        //             AsyncStorage.setItem("login_config",JSON.stringify(result.data));


        //             // 缓存 登录数据
        //             // console.log(result);
        //             // 数据字典
        //             AsyncStorage.setItem("config_supply_entrys",JSON.stringify(result.data.entrys));
        //         } catch (error) {
        //         } 
        //     }
        // });

    }


    
    /**
     * 登录 方法
    */
    static loginFunc(option,callback){
        
        var that=this;

        // 关闭 loading
        if(!option["hideLoading"]){
            // 打开 loding
            DeviceEventEmitter.emit('globalEmitter_toggle_loding',true);            
        }


        // fetch(origin+"api-uaa/oauth/user/token",{
        fetch(origin+"auth/login",{
            method:'POST',
            mode:"cors",
            headers:{
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
                // 'Content-Type': 'application/json;charset=UTF-8',
                // 'Content-Type': 'application/x-www-form-urlencoded',
                // 'Authorization': 'Basic d2ViQXBwOndlYkFwcA=='
            },
            body:JSON.stringify({
                username:option.userName,
                // password:option.password
                password:encrypt( option.password )
            })
            // body: "username="+option.userName+"&password="+option.password+"&lang=zh_CN&j_captcha=NO"
            // body: "j_username="+option.userName+"&j_password="+option.password+"&lang=zh_CN&j_captcha=NO&customKey='toName=home'"
        })
        .then((response) => {
            // console.log(response);
 
            // 关闭 loding
            DeviceEventEmitter.emit('globalEmitter_toggle_loding',false);
            
            // return;
            // 账户 密码 错误
            // if( response["status"]==401 ){
            //     response.json().then((json)=>{
            //         Toast.offline(json.message,1);
            //     })
            // }


            if(response.ok){
                return response.json();
            }else{
                Toast.offline('服务器报错！',1);
                // Toast.offline(response.message);
            }
        })
        .then((json) => {

            // 关闭 loding
            DeviceEventEmitter.emit('globalEmitter_toggle_loding',false);

            // console.log(json)


            if(json.code!=200){
                Toast.info(json["msg"],1);
                return
            }

            var token=json.data.access_token;

            // 提示
            if(json && json["message"]){
                Toast.info(json["message"],1);
            }
      

            if(json){
                // console.log(json);
                // that.getUserData(json.data);

                try{
                    // 缓存 登录信息
                    AsyncStorage.setItem("login_message",JSON.stringify({
                        // userName: Base64.decode(option.userName),
                        // password:Base64.decode(option.password),
                        userName: option.userName,
                        password:option.password,
                    }));


                    // 缓存 token 信息
                    AsyncStorage.setItem("token_config",JSON.stringify(Object.assign(
                        json.data,
                        // {buffer_new_expires_in: new Date().getTime()+(json.data["buffer_new_expires_in"]*1000) } 
                        // {buffer_new_expires_in: new Date().getTime()+(500000) }                
                    )));                  

                    // 登录成功
                    if(json.code==200){
                        callback();
                    }
                    // 缓存 token
                    AsyncStorage.setItem("_token",token).then(()=>{
                        callback();
                    });

                } catch (error) {

                }             

            } else{
                Toast.info(json["message"],1);
            }
        })   
        .catch(error => {
            Toast.offline('服务器响应失败！',1);
            // 关闭 loding
            DeviceEventEmitter.emit('globalEmitter_toggle_loding',false);
        });      
    }


    /**
     * 普通的get请求 
     * @param {*} url 地址
     * @param {*} params  参数
     * @param {*} callback  成功后的回调
     */
    static get(url,params,callback){        

    };


    /**
     * token 失效
     */
    static async disabledToken(){

        try{
            var config= await AsyncStorage.getItem("token_config");
            var buffer_new_expires_in = JSON.parse(config||{})["buffer_new_expires_in"];


            // 失效|有效
            return (new Date().getTime()>=buffer_new_expires_in);

        } catch (error) {

        }

    }
  

    /**
     * @param {*} url 
     * @param {*} params 
     * @param {*} callback 
     */
    static async get(url,option,callback){
        var that=this;


        this.getAjax(url,option,callback);


        // var okToken= await this.disabledToken();

        // // token 失效|有效
        // if(okToken){


        //     // 缓存的 登录信息
        //     AsyncStorage.getItem("login_message").then((option)=>{
        //         if(option){
        //             try{
        //                 let loginMessage=JSON.parse(option);

        //                 that.loginFunc({
        //                     // userName: Base64.encode(loginMessage["userName"]),
        //                     // password: Base64.encode(loginMessage["password"]),
        //                     userName: loginMessage["userName"],
        //                     password: loginMessage["password"],
        //                     hideLoading:true
        //                 },()=>{
        //                     that.getAjax(url,option,callback);
        //                 });
        //             } catch (error) {
            
        //             }          
        //         }
        //     });

        // }else{

        //     this.getAjax(url,option,callback);
        // }
    
    };



    /**
     * post Ajax
     */
    static async getAjax(url,option,callback){

        try {

            const _bufferParmasURL=Object.entries((option["params"]||{}));
            let _parmasURL="";  

            // 格式化 url
            if(_bufferParmasURL.length){
                _bufferParmasURL.map(o=>{ _parmasURL+=`${o[0]}=${o[1]}&` });
                _parmasURL=`?${_parmasURL.slice(0,_parmasURL.length-1)}`
            }

                // 关闭 loading
                if(!option["hideLoading"]){
                    // open loding
                    DeviceEventEmitter.emit('globalEmitter_toggle_loding',true);
                }



                fetch(`${origin}${url}${_parmasURL}`,{
                    method:'GET',
                    headers: {
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                        // "Connection": "keep-alive",
                        // 'Access-Control-Allow-Origin': '*',
                        'Authorization': 'Bearer '+data
                    },
                })
                .then((response) => {

                    // console.log("post 返回数据");
                    // console.log(response); 
                    // console.log( response.json()); 


                    // 关闭 loding
                    DeviceEventEmitter.emit('globalEmitter_toggle_loding',false);

                    // 如果相应码为200 将字符串转换为json对象
                    if(response.ok){
                        return response.json();
                    }else{
                        (!option["hideToast"]) && Toast.offline(`服务器报错！[${response.status}]`,1);
                        // Toast.offline(response.message);
                    }                  
                })
                .then((json) => {


                    // console.log(1111)
                    // console.log(json)

                    // 关闭 loding
                    DeviceEventEmitter.emit('globalEmitter_toggle_loding',false);

                    // 提示
                    if(json && json["message"]){
                        Toast.info(json["message"],1);
                    }

                    // 返回数据
                    if(json){
                        callback(json);
                    }
                })
                .catch(error => {
                    // console.log(error.message)
                    // Toast.offline('服务器响应失败！',1);
                    // 关闭 loding
                    DeviceEventEmitter.emit('globalEmitter_toggle_loding',false);
                });    



            
            // AsyncStorage.getItem("_token").then((data)=>{
            

            
            // });
        } catch (error) {

        }
    }


    /**
     * @param {*} url 
     * @param {*} params 
     * @param {*} callback 
     */
    static async post(url,option,callback){
        var that=this;
        var okToken= await this.disabledToken();

        // token 失效|有效
        if(okToken){


            // 缓存的 登录信息
            AsyncStorage.getItem("login_message").then((option)=>{
                if(option){
                    try{
                        let loginMessage=JSON.parse(option);

                        that.loginFunc({
                            // userName: Base64.encode(loginMessage["userName"]),
                            // password: Base64.encode(loginMessage["password"]),
                            userName: loginMessage["userName"],
                            password: loginMessage["password"],
                            hideLoading:true
                        },()=>{
                            that.postAjax(url,option,callback);
                        });
                    } catch (error) {
            
                    }          
                }
            });

        }else{

            this.postAjax(url,option,callback);
        }
    
    };



    /**
     * post Ajax
     */
    static async postAjax(url,option,callback){

        try {


            // 模拟 form 数据提交
            var formData = '';
            Object.entries(option["params"]).map((o)=>formData+='&'+o[0]+'='+String(o[1]));

            
            AsyncStorage.getItem("_token").then((data)=>{
            

                // 关闭 loading
                if(!option["hideLoading"]){
                    // open loding
                    DeviceEventEmitter.emit('globalEmitter_toggle_loding',true);
                }



                fetch(origin+url,{
                    method:'POST',
                    headers: option["headers"]?Object.assign({'Authorization': 'Bearer '+data},option["headers"]):{
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-Requested-With':'XMLHttpRequest',
                        'Authorization': 'Bearer '+data
                    },
                    // body: formData
                    body: option["body"] || formData.slice(1)
                })
                .then((response) => {

                    // console.log("post 返回数据");
                    // console.log(response); 
                    // console.log( response.json()); 


                    // 关闭 loding
                    DeviceEventEmitter.emit('globalEmitter_toggle_loding',false);

                    // 如果相应码为200 将字符串转换为json对象
                    if(response.ok){
                        return response.json();
                    }else{
                        (!option["hideToast"]) && Toast.offline(`服务器报错！[${response.status}]`,1);
                        // Toast.offline(response.message);
                    }                  
                })
                .then((json) => {


                    // console.log(1111)
                    // console.log(json)

                    // 关闭 loding
                    DeviceEventEmitter.emit('globalEmitter_toggle_loding',false);

                    // 提示
                    if(json && json["message"]){
                        Toast.info(json["message"],1);
                    }

                    // 返回数据
                    if(json){
                        callback(json);
                    }
                })
                .catch(error => {
                    // console.log(error.message)
                    // Toast.offline('服务器响应失败！',1);
                    // 关闭 loding
                    DeviceEventEmitter.emit('globalEmitter_toggle_loding',false);
                });                
            });
        } catch (error) {

        }
    }
}