import React, { Component } from 'react';
import { Dimensions,StyleSheet,ActivityIndicator,DeviceEventEmitter,TouchableOpacity, View, Text, } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon, Provider, Drawer } from '@ant-design/react-native';
import BarBottom from './view/BarBottom';   // 底部按钮
import CenterScreen from './view/Center';       // 个人中心
import WISHttpUtils from '@wis_component/http';   // http 


import theme,{brandPrimary} from './theme'; // 使用自定义样式


import NavigationService from './view/NavigationService'

// 页面
import HomeScreen from './view/Home';    // 首页
import LoginScreen from './view/Login';   // 登录
import WarehouseListScreen from './view/warehouseList';   // 仓库





import takeScreen from './view_page/take/index';     // ASN 收货
import takeDetailedScreen from './view_page/take/detailed.js';     // ASN 收货单明细
import singleTakeScreen from './view_page/take/take';     // 逐条收货


import qualityScreen from './view_page/quality/index.js';   // 质检任务 详情
import qualityDetailedScreen from './view_page/quality/detailed.js';   // 质检任务 详情


import putawayScreen from './view_page/putaway/index.js';   // 上架
import putawayDetailedScreen from './view_page/putaway/detailed.js';   // 上架 详情
import putawayDetailedAllScreen from './view_page/putaway/detailedAll.js';   // 批量上架 




import packagesScreen from './view_page/packages/index.js';   // 包装
import packagesDetailedScreen from './view_page/packages/detailed.js';   // 包装 移库
import transportScreen from './view_page/transport/index.js';   // 发运


import orderPickingScreen from './view_page/orderPicking/index.js';   // 拣货
import logisticWorkerScreen from './view_page/orderPicking/logisticWorker.js';   // 配货员 拣货
import logisticWorkerScreen2 from './view_page/orderPicking/logisticWorker2.js';   // 小车拣货 配货员 拣货2

import carBindingScreen from './view_page/orderPicking/binding.js';   // 绑定小车
import cardPickingScreen from './view_page/orderPicking/cardPicking.js';   // 小车拣货
import cancelResponseScreen from './view_page/orderPicking/cancelResponse.js';   // 取消响应
import recombinationScreen from './view_page/orderPicking/recombination.js';   // 移复核区 校验 




import shiftingStandardScreen from './view_page/shiftingStandard/index.js';   // 标准移库 
import shiftingStandardDetailedScreen from './view_page/shiftingStandard/detailed.js';   // 标准移库 详情


import examineScreen from './view_page/examine/index.js';   // 复核 
import partScreen from './view_page/examine/part.js';   // 零件标签页 
import logisticsScreen from './view_page/examine/logistics.js';   // 物料信息 
import logisticsNumScreen from './view_page/examine/logisticsNum.js';   // 输入物流编号 
import shipmentsScreen from './view_page/examine/shipments.js';   // 输入物流编号 



// import malfunctionScreen from './view_page/malfunction/index';     // 屏幕绑定
// import malfunctionListScreen from './view_page/malfunctionList/index';     // 故障机列表
// import awaitDetailsScreen from './view_page/malfunctionList/awaitDetails.js';     // 待维修 详情


// import NGScreen from './view_page/ng/index';     // NG 出口手动触发


import passwordScreen from './view_page/password/index';     // 重置密码






// import Config from 'react-native-config';
// const base_url=Config.base_url;





//------------------------------  react func  ----------------------------------------------

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

class App extends Component {
  constructor (props) {
    super(props);

    this.state={
      activityIndicatorVisible: false,    // loding
    }  
  }
  
  componentDidMount() {
    let that=this;

    // loding
    this.listener =DeviceEventEmitter.addListener('globalEmitter_toggle_loding',function(active){
      that.setState({
        activityIndicatorVisible:active
      });
    });

  }

  componentWillUnmount(){
    this.listener.remove();
  }

  render() {
    let that=this;
    let {activityIndicatorVisible}=this.state;

    // 公共头部
    let headOption={
      headerStyle: {
        backgroundColor:brandPrimary,
        borderWidth:0
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize:15
      },
      headerRight: (props) => (
        <TouchableOpacity onPress={() =>{ 
          DeviceEventEmitter.emit('globalEmitter_to_center');

        }}>
          <View style={{paddingTop:5,paddingRight:10}}><Icon style={{color:"#fff"}} name={"setting"}/></View>
        </TouchableOpacity> ),

    }

    // 个人中心
    let headOptionCenterPage={
      headerTransparent:true,
      headerStyle: {
        backgroundColor: '#1890ff',
        borderWidth:0
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        borderWidth:0
      },      
    }


    return(
      <Provider theme={theme}>
        { activityIndicatorVisible ?
          <View style={{...styles.activityIndicatorStyle,
            marginTop:70,
            width:Dimensions.get('window').width,
            height:Dimensions.get('window').height-160
          }}>
            <ActivityIndicator size={58} color={brandPrimary} />
          </View>
          :
          <View></View>
        }



        {/* <Drawer
          sidebar={<CenterScreen onClose={()=> that.drawer.closeDrawer() } />}
          position="left"
          // open={false}
          drawerRef={el => (this.drawer = el)}
          // onOpenChange={this.onOpenChange}
          drawerBackgroundColor="#fff"
        > */}

        {/* 菜单 */}
        <NavigationContainer ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
        >
          <Stack.Navigator 
            initialRouteName="Home"
            // screenOptions={({ route, navigation }) =>{
            //   // 首页
            //   // console.log(route.route.params.routeParams);
            //   // if(route["name"]=="Home"){
            //   //   console.log("fafnan 2323,000,9099oo");
            //   // }
            // }}            
            onTransitionEnd={(route,isInitRouter)=>{
              DeviceEventEmitter.emit('globalEmitter_updata_home');
            }}
            // transitionStart={(...aaa)=>{
            //   // console.log("fafnan 2323");
            //   // console.log(aaa);
            // }}
          >

            <Stack.Screen name="Login"
              options={{
                title:' ',
                headerShown: false
              }} 
              component={LoginScreen} 
              // component={malfunctionScreen}
            /> 


            <Stack.Screen name="Home" options={{title:'首页',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator screenOptions={{headerShown:false}} tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="Home" component={HomeScreen} />
                </Tab.Navigator>
              )}
            </Stack.Screen>             

            {/* <Stack.Screen name="centerPage" options={{title:'个人中心',...headOptionCenterPage}} component={CenterScreen}>
            </Stack.Screen>  */}
            <Stack.Screen name="centerPage" options={{title:'个人中心',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator screenOptions={{headerShown:false}} tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="centerPage" component={CenterScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>

            <Stack.Screen name="WarehouseList" options={{title:'选择仓库',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator screenOptions={{headerShown:false}} tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="WarehouseList" component={WarehouseListScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>

            


            <Stack.Screen name="take" options={{title:'收货',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator screenOptions={{headerShown:false}} tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="take" component={takeScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>


            <Stack.Screen name="takeDetailed" options={{title:'收货单明细',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator screenOptions={{headerShown:false}} tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="takeDetailed" component={takeDetailedScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>

            <Stack.Screen name="singleTake" options={{title:'逐条收货',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator screenOptions={{headerShown:false}} tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="singleTake" component={singleTakeScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>

            



            <Stack.Screen name="quality" options={{title:'质检任务',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator screenOptions={{headerShown:false}} tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="quality" component={qualityScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>

            <Stack.Screen name="qualityDetailed" options={{title:'质检任务-明细',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator screenOptions={{headerShown:false}} tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="qualityDetailed" component={qualityDetailedScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>


            
            

            <Stack.Screen name="putaway" options={{title:'上架任务',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator screenOptions={{headerShown:false}} tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="putaway" component={putawayScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>
            <Stack.Screen name="putawayDetailed" options={{title:'上架任务-明细',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator screenOptions={{headerShown:false}} tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="putawayDetailed" component={putawayDetailedScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>
            <Stack.Screen name="putawayDetailedAll" options={{title:'上架任务-批量上架',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator screenOptions={{headerShown:false}} tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="putawayDetailedAll" component={putawayDetailedAllScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>

            

            



            <Stack.Screen name="shiftingStandard" options={{title:'标准移库',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator screenOptions={{headerShown:false}} tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="shiftingStandard" component={shiftingStandardScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>
            <Stack.Screen name="shiftingStandardDetailed" options={{title:'标准移库-明细',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator screenOptions={{headerShown:false}} tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="shiftingStandardDetailed" component={shiftingStandardDetailedScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>      


            
            <Stack.Screen name="packages" options={{title:'包装任务',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator screenOptions={{headerShown:false}} tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="packages" component={packagesScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>   
            <Stack.Screen name="packagesDetailed" options={{title:'包装任务-移库',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator screenOptions={{headerShown:false}} tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="packagesDetailed" component={packagesDetailedScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>             

            
            <Stack.Screen name="transport" options={{title:'发运',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator screenOptions={{headerShown:false}} tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="transport" component={transportScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>           

            <Stack.Screen name="orderPicking" options={{title:'拣货',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator screenOptions={{headerShown:false}} tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="orderPicking" component={orderPickingScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>       
            <Stack.Screen name="logisticWorker" options={{title:'拣货-配货员拣货',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator screenOptions={{headerShown:false}} tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="logisticWorker" component={logisticWorkerScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>   
            <Stack.Screen name="logisticWorker2" options={{title:'拣货-配货员拣货',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator screenOptions={{headerShown:false}} tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="logisticWorker2" component={logisticWorkerScreen2} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>   

            

            <Stack.Screen name="carBinding" options={{title:'小车拣货-绑定小车',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator screenOptions={{headerShown:false}} tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="carBinding" component={carBindingScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>   
            <Stack.Screen name="cardPicking" options={{title:'小车拣货',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator screenOptions={{headerShown:false}} tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="cardPicking" component={cardPickingScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>   
            <Stack.Screen name="cancelResponse" options={{title:'拣货下架-取消响应',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator screenOptions={{headerShown:false}} tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="cancelResponse" component={cancelResponseScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>  
            
            

            

            <Stack.Screen name="examine" options={{title:'复核',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator screenOptions={{headerShown:false}} tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="examine" component={examineScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>  
            <Stack.Screen name="part" options={{title:'零件扫描',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator screenOptions={{headerShown:false}} tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="part" component={partScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>             
            <Stack.Screen name="logistics" options={{title:'录入包装和物流信息',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator screenOptions={{headerShown:false}} tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="logistics" component={logisticsScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>   
            <Stack.Screen name="logisticsNum" options={{title:'输入物流编号',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator screenOptions={{headerShown:false}} tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="logisticsNum" component={logisticsNumScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>   
            <Stack.Screen name="shipments" options={{title:'拣货单移库发运区',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator screenOptions={{headerShown:false}} tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="shipments" component={shipmentsScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>  
            <Stack.Screen name="recombination" options={{title:'移复核区',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator screenOptions={{headerShown:false}} tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="recombination" component={recombinationScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>  
            

            
            


            {/* <Stack.Screen name="malfunction" options={{title:'屏幕绑定',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator screenOptions={{headerShown:false}} tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="malfunction" component={malfunctionScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>

            <Stack.Screen name="malfunctionList" options={{title:'顺位出库单',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator screenOptions={{headerShown:false}} tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="malfunctionList" component={malfunctionListScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen> */}

            {/* <Stack.Screen name="awaitDetails" options={{title:'故障机明细-明细',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator screenOptions={{headerShown:false}} tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="awaitDetails" component={awaitDetailsScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>             */}

            

            {/* <Stack.Screen name="NG" options={{title:'NG出入口手动触发',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator screenOptions={{headerShown:false}} tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="NG" component={NGScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>             */}
                


            <Stack.Screen name="password" options={{title:'重置密码',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator screenOptions={{headerShown:false}} tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="password" component={passwordScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>


            
            

     
              
          </Stack.Navigator>
        </NavigationContainer>
      
      
      {/* </Drawer> */}
      </Provider>
    );
  }  
}


const styles = StyleSheet.create({
  activityIndicatorStyle:{
    position:"absolute",
    top:0,
    left:0,
    zIndex:999999,
    justifyContent:'center',
    backgroundColor:'#dde5dd24'
  }
})

export default App;