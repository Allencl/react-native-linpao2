import React, { Component } from 'react';

import { Linking,DeviceEventEmitter,StyleSheet, Text, View,NativeModules , PermissionsAndroid,ScrollView, TouchableOpacity } from 'react-native';
import { Toast,Modal,Card, WhiteSpace, WingBlank, Button, Icon } from '@ant-design/react-native';

import WISHttpUtils from '@wis_component/http';   // http 
import AsyncStorage from '@react-native-async-storage/async-storage';
import {brandPrimary} from './../theme'; // 使用自定义样式


class HomeScreen extends Component{
    constructor(props) {
        super(props);
    
        this.state={

            showMenu:false,

            modalVisible:false,
            warehouseMap:[],  // 仓库
            menuList:[],  // 菜单数据



            lanyaStatus:9,
            isProcurement: false,  // 采购商
            isFinancing:false,   //  财务

            visible: !true,    // 版本更新
            version:'1.0.1',  // 当前版本号

            numberConfig:{},  // 数字


        }
      }

    componentWillUnmount(){
        this.listener.remove();
        this.toCenter.remove();
        this.getMenu.remove();

    }


    componentDidMount(){

        var that=this;
        var {navigation} = this.props;


        // 未登录   
        AsyncStorage.getItem("login_type").then((option)=>{
            // Toast.offline(option,1);
            if( option !="in" ){
                navigation.navigate('Login');
            }else{
             

            }
        });  


        // 初始化菜单
        this.initMenu();


        // 获取菜单
        this.getMenu =DeviceEventEmitter.addListener('globalEmitter_get_menu',function(){
            that.initMenu();
        });


        // 到个人中心
        this.toCenter =DeviceEventEmitter.addListener('globalEmitter_to_center',function(){
            navigation.navigate('centerPage'); 
        });

        // 退出登录
        this.listener =DeviceEventEmitter.addListener('globalEmitter_logOut',function(){
            AsyncStorage.setItem("login_type","out").then(()=>{
                navigation.navigate('Login'); 
            });
        });
    }
    




    /**
     * 初始化 菜单
     */
    initMenu=()=>{
        let that=this;

        this.setState({
            menuList:[]    
        });

        AsyncStorage.getItem("menu_buffer_list").then((data)=>{
            that.setState({
                menuList:JSON.parse(data)
            })
            // console.log( JSON.parse(data) )
        })

    }



    /**
     * 页面跳转
     * @param {路由名称} code 
    */
    authority=async (code)=>{
        const that=this;
        const {navigation} = this.props;
        // const {ToastExample}=NativeModules;
        // let _list=[];

       
        navigation.navigate(code);


        // try {
        //     // 获取权限
        //     const granted1 = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
        //     const granted2 = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS);
        //     const granted3 = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
        //     const granted4 = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        //     const granted5 = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
        //     const granted6 = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);



        //     _list.push(granted1);
        //     _list.push(granted2);
        //     _list.push(granted3);
        //     _list.push(granted4);
        //     _list.push(granted5);
        //     _list.push(granted6);


        //     // 未获取权限
        //     if( _list.includes("denied") ){
        //         Toast.offline('未获取到所需权限！',1);
        //     }else{
        //         navigation.navigate(code);
        //     }
  
        // } catch(err){
        //     console.warn(err);
        // }
        
    }

    /**
     * 路由跳转  动态
     * @returns 
     */
     authorityDynamic=(option)=>{
        const {navigation} = this.props;
        const {path}=option;

        if(!path){
            Toast.offline("菜单不存在！",1);
            return
        }

        switch (path) {
            case "receipt":  // 收货
                navigation.navigate("take");
                break;
            case "iqcTask":  // 质检任务
                navigation.navigate("quality");
                break; 
            case "packageTask":  // 包装
                navigation.navigate("packages");
                break;                
            case "mmTask":  // 上架
                navigation.navigate("putaway");
                break;                 

            case "out":  // 拣货
                navigation.navigate("orderPicking");
                break;  
            case "reviewBoxing":  // 装箱
                navigation.navigate("examine");
                break;  
            case "shipment":  // 发运
                navigation.navigate("transport");
                break;  

            default:
                break;
        }

        // console.log(option)
     }

    render() {
        const that=this;
        const {navigation} = this.props;
        const {showMenu,menuList,modalVisible,warehouseMap=[],isProcurement,lanyaStatus,isFinancing,version,numberConfig}=this.state;

        return (
        <ScrollView style={styles.page}>

  
            <WingBlank size="md" style={styles.wingBlank}>

                { showMenu ? 
                    <Card style={styles.card}>
                        <Card.Header
                            title="测试页面-在这里"
                            thumb={<Icon name="audit" size="md" color="#1890ff" style={{marginRight:6}} />}
                        />
                        <Card.Body>
                            <View style={styles.cardContent}>
                                <View style={styles.flexBox}>
                                    <View style={styles.flexBoxCol}>
                                        <View style={styles.flexBoxColChild}>
                                            <TouchableOpacity onPress={() => this.authority('take') }>
                                                <View style={styles.menu_child}>
                                                    <Icon style={styles.menu_child_icon} name="folder-add" size="lg" color="#1890ff" />
                                                    <Text style={styles.menu_child_text}>ASN收货</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>  
                                    <View style={styles.flexBoxCol}>
                                        <View style={styles.flexBoxColChild}>
                                            <TouchableOpacity onPress={() => this.authority('quality') }>
                                                <View style={styles.menu_child}>
                                                    <Icon style={styles.menu_child_icon} name="unordered-list" size="lg" color="#009" />
                                                    <Text style={styles.menu_child_text}>质检任务</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View> 
                                    <View style={styles.flexBoxCol}>
                                        <View style={styles.flexBoxColChild}>
                                            <TouchableOpacity onPress={() => this.authority('putaway') }>
                                                <View style={styles.menu_child}>
                                                    <Icon style={styles.menu_child_icon} name="export" size="lg" color="#ffad33" />
                                                    <Text style={styles.menu_child_text}>上架任务</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>  

                                    <View style={styles.flexBoxCol}>
                                        <View style={styles.flexBoxColChild}>
                                            <TouchableOpacity onPress={() => this.authority('packages') }>
                                                <View style={styles.menu_child}>
                                                    <Icon style={styles.menu_child_icon} name="export" size="lg" color="#ffad33" />
                                                    <Text style={styles.menu_child_text}>包装任务</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>  
                                    
                                    <View style={styles.flexBoxCol}>
                                        <View style={styles.flexBoxColChild}>
                                            <TouchableOpacity onPress={() => this.authority('examine') }>
                                                <View style={styles.menu_child}>
                                                    <Icon style={styles.menu_child_icon} name="export" size="lg" color="#ffad33" />
                                                    <Text style={styles.menu_child_text}>复核</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>  

                                    <View style={styles.flexBoxCol}>
                                        <View style={styles.flexBoxColChild}>
                                            <TouchableOpacity onPress={() => this.authority('orderPicking') }>
                                                <View style={styles.menu_child}>
                                                    <Icon style={styles.menu_child_icon} name="export" size="lg" color="#ffad33" />
                                                    <Text style={styles.menu_child_text}>拣货</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View style={styles.flexBoxCol}>
                                        <View style={styles.flexBoxColChild}>
                                            <TouchableOpacity onPress={() => this.authority('transport') }>
                                                <View style={styles.menu_child}>
                                                    <Icon style={styles.menu_child_icon} name="export" size="lg" color="#ffad33" />
                                                    <Text style={styles.menu_child_text}>发运</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>                                  
                                                                                            
                                </View>
                                    
                            </View>         
                        </Card.Body>
                    </Card>
                    :
                    <View></View>
                }


                { (menuList||[]).map((o,i)=>{
                    return <Card key={i} style={styles.card}>
                        <Card.Header
                            title={<Text style={{fontWeight:"bold",fontSize:14}}>{o.menuName}</Text>}
                            thumb={<Icon name="audit" size="md" color={brandPrimary} style={{fontSize:16,marginRight:6}} />}
                        />
                        <Card.Body>
                            <View style={styles.cardContent}>
                                <View style={styles.flexBox}>
                                    { o.children.map((k,j)=>{
                                        return ( <View key={j} style={styles.flexBoxCol}>
                                                <View style={styles.flexBoxColChild}>
                                                    <TouchableOpacity onPress={() => this.authorityDynamic(k) }>
                                                        <View style={styles.menu_child}>
                                                            <Icon style={styles.menu_child_icon} name="unordered-list" size="lg" color={brandPrimary} />
                                                            <Text style={styles.menu_child_text}>{k.menuName}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            </View> 
                                        )
                                    })

                                    }                                    
                                </View>
                            </View>         
                        </Card.Body>
                    </Card>
                })

                }


                <View style={styles.footer}><Text style={styles.footerText}>——到底了——</Text></View>
            </WingBlank>
        </ScrollView>
        );
    }
}



const styles = StyleSheet.create({
      warehouseButton:{
        marginTop:16
      },
      warehouseButtonBox:{
        width:120,
        flexDirection:"row",
        textAlign:'left',
        // backgroundColor:'red'
      },
      warehouseButtonIcon:{
        // flex:1,
        // backgroundColor:'red',
        // width:28,
        // height:22,
        // // marginTop:16,
        // // marginRight:6,
        // // backgroundColor:"red",
        // paddingTop:4,
        // paddingRight:1
        // position:'absolute',
        // top:36
      },
      warehouseButtonText:{
        
        paddingLeft:8,
        fontSize:16
      },
      warehouseBox:{
        backgroundColor:'red'
      }, 
    cardContent:{
        paddingTop:8
    },
    flexBox:{
        // backgroundColor:'red',
        // alignItems: 'flex-start',

        // flexDirection:"row",
        flexDirection:'row',
        flexWrap:'wrap',
        paddingLeft:3,
        paddingRight:3
    },
    flexBoxCol:{
        marginBottom:8,
        marginRight:4,
        marginLeft:4
        // flex:1,
    },
    flexBoxColChild:{
        alignItems: 'center'
    },    
    versionContent:{
        flexDirection:'row',
        paddingBottom:12
        // justifyContent:'space-between',        
    },
    page:{ 
        backgroundColor:"white"
    },
    wingBlank:{
        paddingBottom:50
    },
    card:{
        marginTop:16
    },
    menu_box: {
        flexDirection: "row",
        flexWrap:"wrap",
        // height: 100,
        // padding: 12
        paddingTop:10,
        // paddingLeft:12,
        // paddingRight:12,
    },
    menu_child_icon:{
        fontSize:26
    },
    menu_child_icon_text:{
        marginTop:8,
        fontSize:12,
        paddingTop:3
    },    
    menu_child: {
        justifyContent: 'center',
        alignItems: 'center',
        width:90,
        height:90,   
        borderWidth: 1,
        borderColor: "#e8eaec",
        borderRadius: 6,
        // marginRight:12,
        marginBottom:3,
        // paddingLeft:6,
        // paddingRight:6
    },
    menu_child_text: {
        textAlign:"center",
        marginTop:3,
        fontSize:12,
        paddingTop:3,
        paddingLeft:8,
        paddingRight:8,
        color:"#000000d9"
 
    },
    footer:{
        justifyContent: 'center',
        alignItems: 'center',  
        paddingTop:16, 
        fontSize:10
    },
    footerText:{
        color:"#000000d9"
    }
  });

export default HomeScreen;
