import React, { Component } from 'react';
import { TouchableOpacity,StyleSheet,Text, View,ScrollView } from 'react-native';
import { Checkbox,Card, WhiteSpace, WingBlank,Icon,Flex,Toast } from '@ant-design/react-native';


import WISHttpUtils from '@wis_component/http';   // http 
import AsyncStorage from '@react-native-async-storage/async-storage';
import {brandPrimary} from './../../theme'; // 使用自定义样式


class TableComponent extends Component {
    constructor(props) {
        super(props);

        this.props.onRef && this.props.onRef(this);


        this.state={
            pageSize:10,   // 每页条数
            page:1,    // 页数
            total:0,   // 总数，
            tableData:[],   // 数据

            totalPage:1,  // 总页数
            checkboxValue:false,
  
        };
    }


    componentDidMount(){
        this.initFunc();
    }

    /**
     * 初始化
     * @param {*} value 
     */
    initFunc=(option={})=>{
        const that=this;
        const {pageSize,page}=this.state;
        const {RequestURL,Parames,onInitHandle}=this.props


        // console.log({
        //     pageNum:page,
        //     pageSize:pageSize,
        //     ...Parames,
        //     ...option.params
        // })

        WISHttpUtils.get(RequestURL,{
            params:{
                pageNum:page,
                pageSize:pageSize,
                ...Parames,
                ...option.params
            },
            // hideLoading:true
        },(result)=>{
            const {total=0,rows=[]}=result;

            // console.log(result)
            onInitHandle && onInitHandle(result);

            that.setState({
                total:total,
                totalPage:Math.ceil((total/pageSize)),
                tableData:rows.map(o=>Object.assign(o,{_checked:false}))
            })
        })  

    }


    /**
     * Checkbox all
     * @returns 
    */
    checkboxAllFunc=(value)=>{
        // const {onCheckedAll} = this.props;
        const {tableData=[]}=this.state;

        this.setState({
            checkboxValue:value
        })

        this.setState({
            tableData:tableData.map(o=>Object.assign(o,{_checked:value}))
        })
        // console.log(value)
        // onCheckedAll && onCheckedAll(value)
    }


    /**
     * 分页
     * @returns 
     */
    pageChange=(isNext)=>{
        const that=this;
        const {totalPage,page}=this.state;

        let _page=isNext? (page+1):(page-1);

        if(_page<1){
            Toast.offline('当前第一页！',1);
            return
        }

        if(_page>totalPage){
            Toast.offline('最后一页！',1);
            return
        }   

        this.setState({
            page:_page
        },()=>{
            that.initFunc()
        })


    }   

    /**
     * 
     * @param {*} active 
     * @param {*} index 
     */
    renderBodyCallBack=(active,index)=>{
        const {tableData}=this.state;

        let _newList=tableData.map((o,i)=>{
            return (i==index)?Object.assign(o,{_checked:active}):o
        })

        this.setState({
            checkboxValue:false,
            tableData:_newList
        })
        // console.log(aaa)
    }


    /**
     * 返回 选中 数据
     * @returns 
    */
    getSelectData=()=>{
        const {tableData}=this.state;
        return tableData.filter(o=>o._checked)
    }

    render() {
        let that=this;
        let {title='',renderHead,renderBody,reloadButton=false,maxHeight=0,onCheckedAll,onRowClick} = this.props;
        let {page,total,tableData,checkboxValue}=this.state;

        return (
            <View>
                <View style={{paddingLeft:0,paddingBottom:8,paddingTop:12}}>
                    <Flex>
                        <Flex.Item style={{flex:1}}>
                            <TouchableOpacity onPress={() =>  that.pageChange(false) }>
                                <Icon style={{fontSize:26,color:brandPrimary}} name="left-circle" />
                            </TouchableOpacity>
                        </Flex.Item>
                        <Flex.Item style={{flex:1,paddingLeft:2}}>
                            <TouchableOpacity onPress={() =>  that.pageChange(true) }>
                                <Icon style={{fontSize:26,color:brandPrimary}} name="right-circle" />
                            </TouchableOpacity>
                        </Flex.Item>

                        { reloadButton ? 
                            <Flex.Item style={{flex:1,paddingLeft:2}}>
                                <TouchableOpacity onPress={() =>{    this.initFunc()  }}>
                                    <Icon style={{fontSize:26,color:brandPrimary}} name="reload" />
                                </TouchableOpacity>
                            </Flex.Item>
                            :
                            <View></View>
                        }

                        <Flex.Item style={{flex:5,marginLeft:0}}>
                            <Text style={{fontSize:15}}>{` 第${page}页 共${total}条`}</Text>
                        </Flex.Item>    

                        <Flex.Item style={{flex:2,marginLeft:0}}>

                            { onCheckedAll ? 
                                <View style={{flexDirection:"row",justifyContent:'flex-end'}}>
                                    <Text>全选 </Text>
                                    <Checkbox
                                        checked={checkboxValue}
                                        onChange={event => {
                                            that.checkboxAllFunc(event.target.checked)
                                        }}
                                        >
                                    </Checkbox>
                                </View>
                                :
                                <View></View>
                            }

                        </Flex.Item>          

                    </Flex>
                </View>

                <View style={{padding:10,borderWidth:1,borderColor:'#e6ebf1',borderRadius:6,backgroundColor:'#fff'}}>
                
                { title ?
                    <Flex style={{paddingBottom:16}}>
                        <Flex.Item style={{flex:3}}>
                            <View>
                                <Text style={{fontSize:13,fontWeight:'600',color:"#1890ff"}}>{title}</Text>
                            </View>
                        </Flex.Item>
                        <Flex.Item style={{flex:3}}>
                            { onCheckedAll ? 
                                <View style={{flexDirection:"row",justifyContent:'flex-end'}}>
                                    <Text>全选 </Text>
                                    <Checkbox
                                        checked={checkboxValue}
                                        onChange={event => {
                                            that.checkboxAllFunc(event.target.checked)
                                        }}
                                        >
                                    </Checkbox>
                                </View>
                                :
                                <View></View>
                            }
                        </Flex.Item>
                    </Flex>
                    :
                    <View></View>                
                }

                { renderHead ? <View style={{marginBottom:6}}>{ renderHead() }</View> : <View></View> }


                <ScrollView style={maxHeight?{maxHeight:maxHeight}:{}}>
                    { (tableData).map((o,i)=>{
                        return <TouchableOpacity key={i} disabled={!onRowClick} onPress={() =>{ 
                            onRowClick && onRowClick(o)
                        }}>
                            { renderBody(o,i,that.renderBodyCallBack) }
                        </TouchableOpacity>       
                    })}
                    { !tableData.length ?
                        <Flex>
                            <Flex.Item>
                                <Text style={{textAlign:'center'}}>—无数据—</Text>
                            </Flex.Item>
                        </Flex>
                        :
                        <View></View>
                    }
                </ScrollView>
                </View>
            </View>
        );
    }
}


const styles=StyleSheet.create({

});


export default TableComponent;
