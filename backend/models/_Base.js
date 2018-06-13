let jsondb;const path=require("path"),dbpath=path.join(__dirname,"../dbs"),Q=require("q"),fs=require("fs"),request=require("request"),dbms=require("../lib/dbms/"),_=require("lodash"),shortid=require("shortid"),uploadPath=path.join(__dirname,"../../public"),refresh=function(){return jsondb=dbms(dbpath,{master_file_name:"master.json"})};refresh();class Model{constructor(){this.name=""}static guid(){function e(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}return e()+e()+"-"+e()}static refresh(){return refresh()}static db(e){return refresh(),Model.encodeSrcWithChain(jsondb.get(e))}static list(e,t="id",r="asc",i){let n=Model.db(e).sortBy(t);return"desc"==r&&(n=n.reverse()),i?n:n.value()}static first(e){return Model.db(e).first().value()}static last(e){return Model.db(e).last().value()}static findBy(e,t){return Model.db(e).find(t).value()}static findAll(e,t){return Model.db(e).filter(function(e){let r=!0;for(let i in t)r=r&&e[i]==t[i];return r}).value()}static prevAndNext(e,t,r){let i=Model.db(e).filter(function(e){return"true"==e.published}).sortBy(function(e){return _.get(e,"publishedDate")}),n=i.filter(function(e){return e[t]>r}).map(function(e){return{id:e.id,publishedDate:e.publishedDate,title:e.title}}).take(1).value(),l=i.reverse().filter(function(e){return e[t]<r}).map(function(e){return{id:e.id,publishedDate:e.publishedDate,title:e.title}}).take(1).value();return{next:n[0]||{},prev:l[0]||{}}}static format(e){return e}static encodeSrcWithChain(e){return e.map(function(e){let t={};for(let r in e)"src"==r&&e.file?t[r]=e[r].replace(e.file.filename,encodeURIComponent(e.file.filename)):t[r]=e[r];return t})}static encodeSrc(e){e&&e.src&&e.file&&(e.src=e.src.replace(e.file.filename,encodeURIComponent(e.file.filename)))}static findByReg(e,t){return Model.db(e).filter(function(e){let r=!0;for(let i in t){let n=new RegExp(t[i],"i");r=r&&e[i].length==t[i].length&&e[i].match(n)}return r}).value()}static where(e,t,r,i){let n=Model.db(e).filter(function(e){return _.includes(r,e[t])});return i?n:n.value()}static create(e,t){refresh(),t.id=shortid.generate(),t.createdAt=new Date,t.updatedAt=new Date,t.file&&t.file.path&&(t.file.path=t.file.path.replace(uploadPath,""),t.src=t.file.path);let r=jsondb.get(e).push(t).last().write();return Model.encodeSrc(r),r}static findOrCreate(e,t,r){refresh();let i={};i[t]=r[t];let n=jsondb.get(e).find(i).value();return n||(r.id=shortid.generate(),r.createdAt=new Date,r.updatedAt=new Date,r.file&&r.file.path&&(r.file.path=r.file.path.replace(uploadPath,""),r.src=r.file.path),n=Model.create(e,r)),Model.encodeSrc(n),n}static update(e,t,r){refresh();let i={};i[t]=r[t],r.updatedAt=new Date;let n=jsondb.get(e).find(i);if(!n.value())return console.log(t+"!!!! record not found!!!!! "+i[t]),{};if(n.value()&&r.file&&r.file.path){let e=n.value().file;if(e&&e.path){let t=path.join(uploadPath,e.path);fs.existsSync(t)&&fs.unlinkSync(t)}r.file.path=r.file.path.replace(uploadPath,""),r.src=r.file.path}else r.file=n.value().file;return n.assign(r).write(),Model.encodeSrc(n),n}static delete(e,t={}){refresh();let r=jsondb.get(e).find(t).value();if(r){let e=r.file;if(r.src){let e=path.join(__dirname,"../../public",r.src);fs.existsSync(e)&&fs.unlinkSync(e)}if(e&&e.path){let t=path.join(uploadPath,e.path);fs.existsSync(t)&&fs.unlinkSync(t)}}return r=jsondb.get(e).remove(t).write()}static size(e){return Model.db(e).size().value()}}exports.Model=Model;