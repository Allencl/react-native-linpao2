import React, { Component } from 'react';
import { TouchableOpacity,TextInput,DeviceEventEmitter,Dimensions,StyleSheet, ScrollView, View,Text,PermissionsAndroid,NativeModules   } from 'react-native';
import { Icon,InputItem,WingBlank,Modal, DatePicker, List, Tag, WhiteSpace, Toast,Button,Tabs } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisInput,WisSelect, WisFormHead, WisDatePicker, WisTextarea,WisCamera } from '@wis_component/form';   // form 
import { WisTable,WisButtonFloat } from '@wis_component/ul';   // ul 
import RNFS from "react-native-fs";
import moment from "moment";
import CheckBox from '@react-native-community/checkbox';


import WISHttpUtils from '@wis_component/http'; 
import {WisTableCross,WisBluetooth} from '@wis_component/ul';
import {WisFormText} from '@wis_component/form';   // form 


// 任务下发
class Page extends Component {
  constructor(props) {
    super(props);


    this.state={

        visible:false,
        visibleReplenish:false,
        bufferData:[],
        replenishList:[
          // {
          //   "code": 15, 
          //   "name": "1-1" 
          // },
        ],  // 补打 列表
        no:"",  // 印刷No
        date:"",  // 作业日



        baseConfig:{},  // 基础数据
        prinConfig:{},  // 打印 信息

        columns1:[
          {
            label:"产线",
            key:"lineCode"
          },
          {
            label:"台车",
            key:"trolleyGroup"
          },    
          {
            label:"屏幕",
            key:"screenNo"
          },
          {
            label:"台车名称",
            key:"trolleyName"
          },                                     
        ],
        dataList1:[],

        columns2:[
          {
            label:"印刷NO",
            key:"printNo"
          },
          {
            label:"顺位NO",
            key:"sequenceNo"
          },    
          {
            label:"作业日",
            key:"workDay"
          },
          {
            label:"页数",
            key:"totalPage"
          },                                     
        ],
        dataList2:[],

        columns3:[
          {
            label:"印刷NO",
            key:"printNo"
          },
          {
            label:"顺位NO",
            key:"sequenceNo"
          },    
          {
            label:"作业日",
            key:"workDay"
          },
          {
            label:"页数",
            key:"totalPage"
          },                                     
        ],
        dataList3:[]


    }

  }

  componentWillMount(){

  }

  componentDidMount(){
    let that=this;
    let {onGetPageIndex}=this.props;

    // 模拟
    // setTimeout(()=>{
    //   that.scanHandle("0001")
    // },1000);

    // 监听扫码枪
    this.honeyWellPrint=DeviceEventEmitter.addListener('globalEmitter_honeyWell',function(key=""){
      let _key=key;
      if(key&&key.length>11){
        _key =(key.split("-")[0]).slice(3);
      }

      // 判断设备
      if( !(/^\d{2}\.\d{2}\.\d{2}\.\d{2}$/.test(_key)) ){
        Toast.fail('错误设备编号！');
        return
      }

      if(onGetPageIndex()==0){
        that.scanHandle(_key);
      }


    });
  }

  componentWillUnmount(){
    this.honeyWellPrint.remove();
  }

  /**
   * 扫码
   */
  scanHandle=(key)=>{
    let that=this;

    WISHttpUtils.post("tmBatchingTask/initTask.do",{
      params:{
        "screenNo":key
      },
      // hideLoading:true
    },(result) => {
      let {data={}}=result;

      // console.log(result);

      that.setState({
        baseConfig:data,
        dataList1:[data.base||{}],
        dataList2:data.waitList||[],
        dataList3:data.completeList||[]
      });
      // that.setState({
      //   departmentList:rows,
      // });
    });  
  }




  /**
   * 打印
  */
  printHandle=(value)=>{
    const {ToastExample}=NativeModules;
    let that=this;
    let {base,waitList}=this.state.baseConfig;


    if(!waitList.length){
      ToastExample.show("没有可打印的单子！");
      return
    }

    let _json={
      screenNo:base["screenNo"],
      corporationId:base["corporationId"],
      lineCode:base["lineCode"],
      lineName:base["lineName"],
      trolleyCode:base["trolleyCode"],
      trolleyName:base["trolleyName"],
      trolleyGroup:base["trolleyGroup"],
      num:base["num"],

      printNo:waitList[0]["printNo"],
      sequenceNo:waitList[0]["sequenceNo"],
      amount:waitList[0]["amount"],
      totalPage:waitList[0]["totalPage"],
      workDay:waitList[0]["workDay"],
      printList:JSON.stringify(waitList[0]["detail"]),
    };


    WISHttpUtils.post("tmBatchingTask/saveTask.do",{
      params:_json,
      // hideLoading:true
    },(result={}) => {
      let {data={}}=result;

      // console.log(result);

      that.props.onSetBase(data);

      // 最后一块屏幕
      if(data["isEnd"]){
        // 打印
        that.printLanya(data,false)
      }else{
        that.setState({
          visible:true
        });
      }

      that.setState({
        prinConfig:data
      });

    });  

  }



  /**
   * 蓝牙打印
   * @param {l} option 
   */
  printLanya=(option,active)=>{
    let that=this;
    const {ToastExample}=NativeModules;
    let {base={}}=this.state.baseConfig;
    let {prinConfig}=this.state;


    // let _option={
    //   isEnd: true,
    //   taskId: 22
    // }



    let _json={
      taskId:option["taskId"]||prinConfig["taskId"],
      screenNo:base.screenNo,
      isAgain:active,  // 是否补打
    }

    // console.log(_json)


    WISHttpUtils.post("tmBatchingTask/printTask.do",{
      params:_json,
      // hideLoading:true
    },(result={}) => {
      let {data,success}=result;

      // console.log("32323-----------32323")
      // console.log(result)


      if(success && data){
        // base.screenNo
        Toast.success("提交成功！");


        that.setState({
          visible:false,
          visibleReplenish:false,
        },()=>{

          let _dress=(base.screenNo).replace(/\./g, ":");

          that.bluetoothRef.lanyaHandle(
            _dress,
            data
          );

        })

      }

    }); 



  }

  /**
   * 补打
  */
  reprintHandle=(value)=>{
    // console.log("补打");
    let that=this;


    this.props.form.validateFields((error,value) => {
      // 表单 不完整
      if(error){

        if(!value["no"]){
          Toast.fail('印刷No未填！');
          return
        }

        if(!value["date"]){
          Toast.fail('作业日未选择！');
          return
        }
      } else{

        let _date=new Date(value["date"]).getTime();

        WISHttpUtils.post("tmBatchingTask/getHistoryTask.do",{
          params:{
            printNo:(value.no).trim(),
            workDay:moment(_date).format('YYYYMMDD')
          },
          // hideLoading:true
        },(result) => {
          let {data,success}=result;
          // console.log(result);

          if(!data.length){
            Toast.fail('没有可补打的单子！');
          } else{
            this.setState({
              visibleReplenish:true,
              replenishList:data
            });
          }
          // this.setState({
          //   visibleReplenish:true
          // });
        }); 
        // console.log(value)

      }
  });

  }

  /**
   * 查询
  */
  queryHandle=(value)=>{
    let {base={}}=this.state.baseConfig;

    if(!base.screenNo){
      Toast.info("请扫码！",1);
    }else{
      this.scanHandle(base.screenNo);
    }
    
  }

    /**
   * 
   * @param
   */
  onClose = () => {
    this.setState({
        visible:false
    });
  } 



  /**
   * 关闭 补打
   */
  onCloseReplenish=()=>{
    this.setState({
      visibleReplenish:false
    }); 
  }

  /**
   * 选中
   * @returns 
   */
  checkBoxChange(row,index){
      let {bufferData}=this.state;
      // 暂时 只支持单选

      if(bufferData.filter(o=>o.code==row.code)[0]){
        // this.setState({
        //     bufferData:[]
        // });
      }else{
        this.setState({
            bufferData:[row]
        });
      }

  }


  /**
   * 补打
   * @returns 
   */
  //  printLanyaReplenish=()=>{
  //     let {bufferData}=this.state;
  //     console.log(bufferData)
  //  }

  render() {
    let that=this;
    let {replenishList,bufferData,prinConfig,visible,visibleReplenish,no,date, columns1,dataList1,columns2,dataList2,columns3,dataList3}=this.state;
    let {navigation,form} = this.props;
    const {width, height, scale} = Dimensions.get('window');
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;
    const {ToastExample}=NativeModules;



    return (
      <ScrollView style={{height:height-180}}>


        <WisBluetooth 
          onRef={(ref)=>{this.bluetoothRef=ref}}
        />

        <Modal
          title="补打信息"
          transparent
          closable
          maskClosable
          visible={visibleReplenish}
          onClose={this.onCloseReplenish}

        >
          <ScrollView style={{maxHeight:200,paddingBottom:18}}>
            <View style={{paddingTop:10}}>
              { replenishList.map((o,index)=>{
                return  <View style={styles.checkBoxContainer} key={index}>
                  <CheckBox
                      value={ bufferData.filter(k=>k.code==o["code"])["length"]?true:false}
                      tintColors={{true:'#57a3f3',false:'#dcdee2'}}
                      onValueChange={()=>{
                          that.checkBoxChange(o,index);
                      }}
                  />
                  <Text style={styles.checkBoxText}>{o.name}</Text>
                </View>
              }) 

              }

            </View>
          </ScrollView>
          <Button onPress={()=> {

            if(!bufferData.length){
              ToastExample.show("请选择需要打印的单子！");
            }else{
              that.printLanya({
                taskId:(bufferData[0]||{}).code
              },true)
            }

          }} type="primary">
            打印
          </Button>
        </Modal>


        <Modal
          title="打印信息"
          transparent
          closable
          maskClosable
          visible={visible}
          onClose={this.onClose}

        >
        
          <View style={{ paddingVertical: 20 }}>
            <View style={{flexDirection:"row"}}>
              <Text style={{width:89,textAlign:'right',fontWeight:'600'}}>总屏幕数: </Text>
              <Text>{prinConfig.totalScreenNum}</Text>
            </View>             
            <View style={{flexDirection:"row"}}>
              <Text style={{width:89,textAlign:'right',fontWeight:'600'}}>完成屏幕数: </Text>
              <Text>{prinConfig.completeScreenNum}</Text>
            </View>
            <View style={{flexDirection:"row"}}>
              <Text style={{width:89,textAlign:'right',fontWeight:'600'}}>待印刷屏幕数: </Text>
              <Text>{prinConfig.waitScreenNum}</Text>
            </View>
          
            {/* <Text>{lanyaConfig.id}</Text>
            <Text style={{ textAlign: 'center' }}>状态</Text>
            <Text style={{ textAlign: 'center' }}>Content...</Text> */}
          </View>

          <Button onPress={ ()=> {
            this.setState({
              visible:false
            },()=>{
              that.printLanya({},false)
            })
          }} type="primary">
            打印
          </Button>

        </Modal>


        <View style={{height:8}}></View>
        <WisTableCross
          columns={columns1}
          data={dataList1}
        />

        <View><Text style={{fontSize:12,fontWeight:'600',color:"#1890ff",paddingLeft:12}}>待印刷:</Text></View>
        <WisTableCross
          columns={columns2}
          data={dataList2}
        />

        <View><Text style={{fontSize:12,fontWeight:'600',color:"#1890ff",paddingLeft:12}}>已印刷:</Text></View>
        <WisTableCross
          columns={columns3}
          data={dataList3}
        />


        <View style={{height:12}}></View>

        <View>

          <WisInput  
            form={form} 
            name="no"
            requiredSign={true}
            {...getFieldProps('no',{
              rules:[{required:true }],
              initialValue:no
            })} 
            error={getFieldError('no')}               
            lableName="印刷No"
            
          />

          <WisDatePicker
            form={form} 
            name="date"
            requiredSign={true}
            {...getFieldProps('date',{
              rules:[{required:true }],
              initialValue:date
            })} 
            error={getFieldError('date')}               
            lableName="作业日"
          />



          <WingBlank
            style={{
              marginTop: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Button type="primary" onPress={this.printHandle}>打印</Button>
            <Button type="warning" onPress={this.reprintHandle}>补打</Button>
            <Button type="ghost" onPress={this.queryHandle}>查询</Button>


          </WingBlank>
          <View style={{height:18}}></View>

        </View>

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    // backgroundColor:"red",

  },
  checkBoxContainer:{
    flexDirection:'row',

  },
  checkBoxText:{
    marginTop:6
  }
});

export default createForm()(Page);

