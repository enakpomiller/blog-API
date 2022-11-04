const express = require('express');
const { ParameterStatusMessage } = require('pg-protocol/dist/messages');
const Sequelize = require('sequelize');
const bcrypt = require("bcrypt");
const { response } = require('express');
// const { Sequelize } = require('sequelize');
 
const app = express();
// configuring body for url via postmane
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// using sequelize to link to DATABASE
const sequelize = new Sequelize('crud_api_DB','root','',{
  dialect:"mysql",
});
//test the sequelize connection
sequelize.authenticate().then(()=>{
    console.group(' conection to database made successfully');
}).catch((error)=>console.log(error,' there is an error'));

// design the  TABLE
    const blog_user_table =  sequelize.define('blog_user_table',{
        firstname:Sequelize.STRING,
        othernames:Sequelize.STRING,
        email:Sequelize.STRING,
        username:Sequelize.STRING,
        password:Sequelize.STRING,  
        // desc:Sequelize.TEXT,

    },{tableName:"blog_user_table"}
    ); 
//executing the command to create the TABLE
    blog_user_table.sync();


const port = 7000;

// routing
// app.get("/",(req,res)=>{
//   res.send(' this is the first rout');
// })

// inserting data into database
app.post("/createuser",async(req,res)=>{
   const {firstname,othernames,email,username}=req.body
   const password = await bcrypt.hash(req.body.password,10);
   if(password.length <=5){
    res.send(`sorry ${firstname} your password is length is too shoort`);
   }else{ 
   const SaveBlog = blog_user_table.build({ 
    firstname,
    othernames,
    email,
    username,
    password
})
  await SaveBlog.save();
  res.send(`blog created for ${firstname}`);
   }

});

// read all record
app.get("/viewusers",async(req,res)=>{
  const getdata  = await blog_user_table.findAll();
  res.json(getdata); 
})

// get a single user
app.get("/getsingleuser/:id",(req,res)=>{
    const {id,firstname,othernames,email,username}=req.body;
    const getsingledata =   blog_user_table.findOne({
       where:{
         id:id 
         }
     }).then(getsingledata =>{
       if(getsingledata ){
          res.send(getsingledata);
      }else{
        return res.json(404).send(" error");
      }
    })



 });

//update record
app.put("/updateuser/:id",(req,res)=>{
    const {firstname,othernames,email,username} =req.body;
   blog_user_table.update({
     firstname:firstname,
     othernames:othernames,
     email:email,
     username:username
   
   },
     {
      where:{
        id:req.params.id, 
        }, 
    }
   );
   res.json(` ${firstname} your record is successfully updated`);

});

// delete record 
app.delete("/deleteuser/:id",(req,res)=>{  

    blog_user_table.destroy(
        {
       where:{
        id:req.params.id, 
         }
      });
    res.json(` record is successfully deleted`);
});


app.listen(port,()=>{
  console.log(' server running at port '+port);
})