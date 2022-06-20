import React from 'react';
import { BackHandler,DeviceEventEmitter,window,TouchableOpacity,Text,Image, View, StyleSheet } from 'react-native';
import { Icon,Button, Provider, InputItem, List, Toast, Flex } from '@ant-design/react-native';
import { createForm, formShape } from 'rc-form';

import WISHttpUtils from '@wis_component/http';   // http 

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Base64 } from 'js-base64';

class LoginScreenForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      toggleEye:true,  // 显示密码

      userName:"",
      password:"",
    };
  }

  componentDidMount() {
    let that=this;

    // 缓存的 登录信息
    AsyncStorage.getItem("login_message").then((option)=>{
      if(option){
        try{
          let loginMessage=JSON.parse(option);
          that.setState({
            userName:loginMessage["userName"],
            password:loginMessage["password"],
          });
        } catch (error) {

        }          
      }
    });

    BackHandler.addEventListener('hardwareBackPress',this.onBackButtonPressAndroid);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress',this.onBackButtonPressAndroid);
  }  

  /**
   * 
   * @returns 禁用返回键
   */
  onBackButtonPressAndroid = () => {
    if (this.props.navigation.isFocused()) {
        if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
          // //最近2秒内按过back键，可以退出应用。
          // return false;
          BackHandler.exitApp();//直接退出APP
        }
        this.lastBackPressed = Date.now();
        Toast.info('再按一次退出应用',1);
        return true;
    }
  }  


  /**
   * 登录
   * @param
   */
   submit = () => {
    let that=this;

    that.props.form.validateFields((error, value) => {
        // 表单 不完整
        if(error){
          Toast.fail('用户名或密码未填！');
        } else{
          const {navigation} = that.props;

          // let _name = Base64.encode(value["userName"].trim());
          // let _password = Base64.encode(value["password"].trim());

          // fetch("http://10.6.12.4:8080/"+"phoneMain/phoneLogin.do",{
          //   method: 'POST',
          //   mode: 'cors',
          //   body: JSON.stringify({
          //     'j_username': value["userName"].trim(),
          //     'j_password': value["password"].trim()
          //   }),
          // }).then(res => {
          //   Toast.fail(111);
          //   // Toast.fail(res.status);
          //   console.log(res);
          //   // console.log();

          // }).then(json => {

          // }).catch(err => {

          // })


          WISHttpUtils.loginFunc({
            userName:value["userName"].trim(),
            password:value["password"].trim(),
          },()=>{

            // 登录状态
            AsyncStorage.removeItem("login_type").then(()=>{
              AsyncStorage.setItem("login_type","in");
            });

            Toast.success("登录成功！",1);
            
            setTimeout(()=>{
              navigation.navigate('WarehouseList');    
            },600)

            // navigation.navigate('Home');    
            // DeviceEventEmitter.emit('globalEmitter_get_menu');

          })
       
        }
    });
  }


  render() {

    const {navigation} = this.props;
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;
    const {userName,password,toggleEye}=this.state;
  
    return (
      <Provider>
        <View
          style={styles.container}
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >

        <Flex style={{marginTop:50,marginBottom:12,paddingLeft:16}}>
          <Flex.Item>
            <Image

              source={require('./img/logo3.png')}
            /> 
          </Flex.Item>
        </Flex>
        <View style={{marginTop:8,marginBottom:28,paddingLeft:16}}>
              <Text style={{fontWeight:'bold',color:'#202123',fontSize:18}}>售后备件 WMS</Text>
            </View>

          <View >

            {/* <View style={styles.headTitle}>
              <Text style={styles.headTitleText}>	盈合机器人</Text>
            </View> */}

            {/* <View style={{height:8}}></View> */}

              <View style={{paddingRight:18}}>
                <InputItem
                  {...getFieldProps('userName',{
                    rules:[{required:true}],
                    initialValue:userName
                  })}
                  error={getFieldError('userName')}
                  placeholder="请输入手机号"
                >
                  手机号
                </InputItem>

                <InputItem
                  {...getFieldProps('password',{
                    rules:[{required:true}],
                    initialValue:password
                  })}
                  error={getFieldError('password')}
                  type={toggleEye?"password":"text"}
                  extra={
                    <TouchableOpacity onPress={()=>{
                        this.setState({
                          toggleEye:!toggleEye
                        });
                    }}>
                      <Icon name={toggleEye?"eye-invisible":"eye"} />
                    </TouchableOpacity>
                  
                  }
                  placeholder="请输入密码"

                >
                  密码
                </InputItem>
              </View>
              <View style={styles.footerBox}>
                <Button
                  style={styles.footerBtn}
                  onPress={this.submit}
                  // type="primary"
                >
                  <Text style={{fontSize:22,color:"#fff"}}>登 录</Text>
                </Button>
              </View>
          </View>

           <View style={{paddingLeft:12}}>
              <View style={{marginTop:80}}> 
                <Text style={{fontSize:16}}>问题支持电话</Text>
              </View>
              <View>
                <Text>611007/19906781007</Text>
              </View>
            </View>         
        </View>
      </Provider>
    );
  }
}



const styles = StyleSheet.create({
  imgBox:{
    alignItems:"center",
    marginTop:50,
    marginBottom:30
  },
  container:{
    paddingLeft:8,
    paddingRight:8,
    flex: 1,    
    flexDirection: 'column',
    backgroundColor:"#fff"
  },
  headTitle:{
    paddingTop:60,
    paddingLeft:32,
    paddingBottom:50
  },
  headTitleText:{
    color:"#2d8cf0",
    fontSize:46,
    fontWeight:"bold",
    fontStyle:'italic',
    textAlign:"center"
  },
  footerBox:{
    paddingTop:60,
    paddingLeft:8,
    paddingRight:8,
  },
  footerBtn:{
    backgroundColor:"#202123",
    borderWidth:0,
    borderRadius:6,
    fontSize:32
  }

});


export default createForm()(LoginScreenForm);