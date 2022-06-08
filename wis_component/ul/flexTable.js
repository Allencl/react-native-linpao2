import React, { Component } from 'react';
import { TouchableOpacity,StyleSheet,Text, View,ScrollView } from 'react-native';
import { Checkbox,Card, WhiteSpace, WingBlank,Icon,Flex } from '@ant-design/react-native';

class TableComponent extends Component {
    constructor(props) {
        super(props);

        this.state={
            checkboxValue:false,
            dataList:[]
        };
    }


    /**
     * Checkbox all
     * @returns 
    */
    checkboxAllFunc=(value)=>{
        const {onCheckedAll} = this.props;

        this.setState({
            checkboxValue:value
        })

        onCheckedAll && onCheckedAll(value)
    }


    render() {
        let that=this;
        let {title='',data,renderHead,renderBody,maxHeight=0,onCheckedAll} = this.props;
        let {dataList,checkboxValue}=this.state;

        return (
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
                    { (data || dataList).map((o,i)=>{
                        return renderBody(o,i)
                    })}
                </ScrollView>
            </View>
        );
    }
}


const styles=StyleSheet.create({

});


export default TableComponent;
