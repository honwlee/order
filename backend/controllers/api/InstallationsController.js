const Installation=require("../../models/Installation").Installation,Order=require("../../models/Order").Order,parse=require("../../helpers/parseList").parse,validate=require("../../helpers/validation").validate;module.exports={index:function(e,t){parse("installations",e,t,["name"])},select:function(e,t){let n=Installation.findAll({type:"main"});t.json(n)},show:function(e,t){let n={};n[e.query.key]=e.query.value;let s=Installation.findByReg(n);s?t.json(s):t.json({status:!1,msg:"no results!"})},update:function(e,t){e.body.file=e.file,Order.findBy({id:e.body.orderId}).update({installation:e.body}),t.json({status:!0,result:{}})},create:function(e,t){e.body.file=e.file,Order.update({id:e.body.orderId,installation:e.body}),t.json({status:!0,result:e.body})},delete:function(e,t){Installation.delete(e.body),t.json({status:!0,msg:"删除成功！"})},import:function(e,t){t.json(Installation.importData())}};