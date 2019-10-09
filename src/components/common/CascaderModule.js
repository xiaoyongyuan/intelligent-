import React, { Component } from 'react';
import {Cascader} from "antd";
import {post} from "../../axios/tools";


class CascaderModule extends Component {
    constructor(props){
        super(props);
        this.state={
           options:[]
        };
    }
    componentDidMount() {
        var params={
          url:"/api/zonecode/gets_province",
          data:{},
          id:'province_id',
          name:'province_name',
          sub:true,
          grade:0
        }
        this.getsData(params).then((res)=>{
          if(res) this.setState({options:res});
        })
        this.props.onRef(this)

    }
    getsData=(params)=>{
      const _this=this;
      return new Promise((resolve,reject)=>{
        post({url:params.url,data:params.data}, (res)=>{ //省
          if(res.success){
            resolve(_this.forEachData(res.data,params.id,params.name,params.sub,params.grade))
          }else reject(false)
        })
      })
      
    }
    formref = () => { //将form传给父组件由父组件控制表单提交
        return {
          zonecode:this.state.zonecode,
          usertype:this.state.usertype,
          zonename:this.state.zonename
        };
    };
    onChange = (value, selectedOptions) => {
      var zonename='';
      selectedOptions.map((el,i)=>{zonename=zonename+el.label})
      this.setState({
        zonecode:value.length?value[value.length-1]:'',
        usertype:value.length-1,
        zonename:zonename
      })   
    }
    loadData = (selectedOptions) => {
      const targetOption = selectedOptions[selectedOptions.length - 1];
      targetOption.loading = true;
      var params={};
      if(targetOption.grade===0){
        params={
          url:"/api/zonecode/gets_city",
          data:{province_id:targetOption.value},
          id:'city_id',
          name:'city_name',
          sub:true,
          grade:1
        }
      }else if(targetOption.grade===1){
        params={
          url:"/api/zonecode/gets_county",
          data:{city_id:targetOption.value},
          id:'county_id',
          name:'county_name',
          sub:true,
          grade:2
        }
      }else if(targetOption.grade===2){
        params={
          url:"/api/zonecode/gets_town",
          data:{county_id:targetOption.value},
          id:'town_id',
          name:'town_name',
          sub:false,
          grade:3
        }
      }
      
      this.getsData(params).then((res)=>{
        if(res){
          targetOption.loading = false;
          targetOption.children=res;
          this.setState({
            options: [...this.state.options],
          });
        }
      })

    }
    forEachData=(data,id,name,sub,grade)=>{ //循环改造数组为需要的格式，grade为省市区等级，sub为可否有下一级
      var neaData=[]
      data.map((el,i)=>{
        var ex={
          label:el[name],
          value:el[id],
          grade
        }
        if(sub)ex.isLeaf=false
         neaData.push(ex) 
      })
      return neaData
    }
    render() {
        return (
            <div className="CascaderModule" style={{width:'100%'}}>
              <Cascader options={this.state.options}
              loadData={this.loadData}
              onChange={this.onChange}
              placeholder="请选择区域"
              style={{width:'100%'}}
              />
            </div>
        )
    }
}

export default CascaderModule;