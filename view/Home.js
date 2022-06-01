import React, { Component } from 'react';

import { Linking,DeviceEventEmitter,StyleSheet, Text, View,NativeModules , PermissionsAndroid,ScrollView, TouchableOpacity } from 'react-native';
import { Toast,Modal,Card, WhiteSpace, WingBlank, Button, Icon } from '@ant-design/react-native';

import WISHttpUtils from '@wis_component/http';   // http 
import AsyncStorage from '@react-native-async-storage/async-storage';


class HomeScreen extends Component{
    constructor(props) {
        super(props);
    
        this.state={
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
                // navigation.navigate('Login');
            }else{
             

            }
        });  


        // 初始化菜单
        this.initMenu()


        // 获取菜单
        this.getMenu =DeviceEventEmitter.addListener('globalEmitter_get_menu',function(){
            that.getWarehouseFunc()
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

        AsyncStorage.getItem("menu_buffer_list").then((data)=>{
            that.setState({
                menuList:JSON.parse(data)
            })
            console.log( JSON.parse(data) )
        })

    }


    /**
     * 获取 仓库
    */
    getWarehouseFunc=()=>{

        let that=this;
    
        WISHttpUtils.get("system/user/selectUserStore",{
          params:{
    
          }
        },(result)=>{

            const {rows}=result
    
            that.setState({
                modalVisible:true,
                warehouseMap:rows
            })
    
        })


    }

    /**
     * 绑定 菜单
     */
     getMenuFunc=(option)=>{
        const that=this;
        const {tmBasStorageId}=option;
    
        WISHttpUtils.get(`system/user/selectStorage/${tmBasStorageId}`,{
          params:{
    
          }
        },(result)=>{
            that.getMenuData();
            // console.log(1123)
            //  console.log(result)
             // const {code,rows=[]}=result;
        })
     }

    /**
     * 获取 菜单
     */
     getMenuData=()=>{
        const that=this;

        WISHttpUtils.get(`system/menu/getRouters/A/2527`,{
            params:{
      
            }
          },(result)=>{
            const {data=[]}=result;

      
            if(data.length){
                let _list=(data[0]["children"])||[];
                AsyncStorage.setItem("menu_buffer_list",JSON.stringify(_list));
                that.initMenu();
            }      
          })
     }
 

    /**
     * 
     * @param {*} code 
     */
    onClose =()=> {
        this.setState({
            visible: false,
        });
    }

    lanyard = async ()=>{


       
    }

    /**
     * 下载 最新版
     * @param {*} code 
     */
    onDownload=()=>{
        var downloadURL = 'http://www.baidu.com/';  // 下载页面         
  
        Linking.canOpenURL(downloadURL).then(supported => {         
            if (!supported) {            
                console.warn('Can\'t handle url: ' + downloadURL);            
            } else {            
                return Linking.openURL(downloadURL);            
            }            
        }).catch(err => console.error('An error occurred',downloadURL));           
    }


    /**
     * 页面跳转
     * @param {路由名称} code 
    */
    authority=async (code)=>{
        let that=this;
        const {navigation} = this.props;
        const {ToastExample}=NativeModules;
        let _list=[];

       
        try {
            // 获取权限
            const granted1 = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
            const granted2 = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS);
            const granted3 = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
            const granted4 = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            const granted5 = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
            const granted6 = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);



            _list.push(granted1);
            _list.push(granted2);
            _list.push(granted3);
            _list.push(granted4);
            _list.push(granted5);
            _list.push(granted6);


            // 未获取权限
            if( _list.includes("denied") ){
                Toast.offline('未获取到所需权限！',1);
            }else{
                navigation.navigate(code);
            }
  
        } catch(err){
            console.warn(err);
        }
        
    }

    render() {
        const that=this;
        const {navigation} = this.props;
        const {menuList,modalVisible,warehouseMap,isProcurement,lanyaStatus,isFinancing,version,numberConfig}=this.state;

        return (
        <ScrollView style={styles.page}>

            {/* <View style={{height:10}}></View>
            <Button type="primary" onPress={this.lanyard}>测试蓝牙</Button> */}


            {/* <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    console.log("2222")
                }}
            > */}

            <Modal
                animationType="slide"
                title={`选择仓库 (${warehouseMap.length})`}
                onClose={()=>{
                    that.setState({modalVisible:false})
                }}
                visible={modalVisible}
                closable
                transparent
            >
                <View style={{paddingVertical: 20 }}>
                    <ScrollView style={{height:300,}}>
                        <View>
                            { warehouseMap.map((o,i)=>{
                                return (<Button onPress={()=> that.getMenuFunc(o) } key={String(i)} type="ghost" style={styles.warehouseButton}>
                                <View style={styles.warehouseButtonBox}>
                                    <View style={styles.warehouseButtonIcon} >
                                        <Icon name="cloud" color="#ffad33"/>
                                    </View>
                                    <View >
                                        <Text numberOfLines={1} style={styles.warehouseButtonText}>{o.storageName}</Text>
                                    </View>
                                </View>

                                </Button>)
                            })         
                            }
                        </View>
                    </ScrollView>        
                </View>
            </Modal>





            {/* <Modal
            title="版本更新"
            transparent
            onClose={this.onClose}
            maskClosable
            visible={this.state.visible}
            closable
            //   footer={footerButtons}
            >
            <View style={{ paddingVertical: 20 }}>
                <View style={styles.versionContent}>
                    <Text style={{ fontSize:16 }}>当前版本1：</Text>
                    <Text style={{ fontSize:16 }}>1.0.1</Text>
                </View>
                <View style={styles.versionContent}>
                    <Text style={{ fontSize:16 }}>更新版本1：</Text>
                    <Text style={{ fontSize:16 }}>1.0.3</Text>
                </View>

                <View style={{paddingTop:8}}>
                    <Button type="primary" onPress={this.onDownload}>点击下载安装版</Button>
                </View>
            </View>
            <Button type="ghost" onPress={this.onClose}>取消</Button>
            </Modal> */}



            <WingBlank size="md" style={styles.wingBlank}>
                { menuList.map((o,i)=>{
                    return <Card key={i} style={styles.card}>
                        <Card.Header
                            title={<Text style={{fontWeight:"bold",fontSize:14}}>{o.menuName}</Text>}
                            thumb={<Icon name="audit" size="md" color="#1890ff" style={{fontSize:16,marginRight:6}} />}
                        />
                        <Card.Body>
                            <View style={styles.cardContent}>
                                <View style={styles.flexBox}>
                                    { o.children.map((k,j)=>{
                                        return ( <View key={j} style={styles.flexBoxCol}>
                                                <View style={styles.flexBoxColChild}>
                                                    <TouchableOpacity onPress={() => this.authority('malfunctionList') }>
                                                        <View style={styles.menu_child}>
                                                            <Icon style={styles.menu_child_icon} name="unordered-list" size="lg" color="#009" />
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
