import React, { Component } from 'react';
import { Dimensions,StyleSheet,ActivityIndicator,DeviceEventEmitter,TouchableOpacity, View, Text, } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon, Provider, Drawer } from '@ant-design/react-native';
import BarBottom from './view/BarBottom';   // 底部按钮
import CenterScreen from './view/Center';       // 个人中心
import WISHttpUtils from '@wis_component/http';   // http 




// 页面
import HomeScreen from './view/Home';    // 首页
import LoginScreen from './view/Login';   // 登录


import takeScreen from './view_page/take/index';     // ASN 收货
import takeDetailedScreen from './view_page/take/detailed.js';     // ASN 收货单明细
import singleTakeScreen from './view_page/take/take';     // 逐条收货


import qualityScreen from './view_page/quality/index.js';   // 质检任务 详情
import qualityDetailedScreen from './view_page/quality/detailed.js';   // 质检任务 详情


import putawayScreen from './view_page/putaway/index.js';   // 上架


import packagesScreen from './view_page/packages/index.js';   // 包装
import packagesDetailedScreen from './view_page/packages/detailed.js';   // 包装 移库





import shiftingStandardScreen from './view_page/shiftingStandard/index.js';   // 标准移库 
import shiftingStandardDetailedScreen from './view_page/shiftingStandard/detailed.js';   // 标准移库 详情





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
        backgroundColor:'#1890ff',
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
      <Provider>
        { activityIndicatorVisible ?
          <View style={{...styles.activityIndicatorStyle,
            marginTop:70,
            width:Dimensions.get('window').width,
            height:Dimensions.get('window').height-160
          }}>
            <ActivityIndicator size={58} color="#1890ff" />
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
        <NavigationContainer>
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

            <Stack.Screen name="qualityDetailed" options={{title:'质检任务-详情',...headOption}}>
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



            <Stack.Screen name="shiftingStandard" options={{title:'标准移库',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator screenOptions={{headerShown:false}} tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="shiftingStandard" component={shiftingStandardScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>
            <Stack.Screen name="shiftingStandardDetailed" options={{title:'标准移库-详情',...headOption}}>
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

            {/* <Stack.Screen name="awaitDetails" options={{title:'故障机明细-详情',...headOption}}>
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