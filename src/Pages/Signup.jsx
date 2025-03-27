import React, { useState } from 'react'
import css from './auth.module.css'
import image from "../Images/headphone.png";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
function Signup() {
  const navigate = useNavigate()
    const [userData,setUserData] = useState({
       name:"",
       email:"",
       password:""
    })
    const addUser = async() =>{  
   
      try {
        
          
      await  axios({
            method: 'post',
            url: 'https://authentication-seven-umber.vercel.app/api/register',
            data:userData, // Body
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(response => {
            toast.success('Registration sucessfull',{duration:2000});
            localStorage.setItem('token',response.data.token)
              document.getElementById('subButton').disabled = false
              document.getElementById('subButton').style.backgroundColor = "rgb(30 215 96)"
              navigate('/')
            
            
          }
        )
        .catch((error)=>{
          console.log(error.response.data.message);
        toast.error(error.response.data.message,{duration: 2000})
             document.getElementById('subButton').disabled = false
              document.getElementById('subButton').style.backgroundColor = "rgb(30 215 96)"
        })
      } catch (error) {
        console.log(error);
        
      }
         
    }

    const handleOnSubmit = (e) =>{ 
      document.getElementById('subButton').disabled = true
      document.getElementById('subButton').style.backgroundColor = "rgb(29 204 91 / 31%)"
        e.preventDefault()
        addUser()
       

    }

    const handleOnChnage = (e) =>{
   
      let name = e.target.name;
      let value = e.target.value
          setUserData({
            ...userData,
            [name]:value,
          })
          
      
    }
 

  return (
    <div className={css.maincontainer}>
    <div className="container" style={{
         
         width:"465px",
         height:"550px",
         backgroundColor:"#121212",
         borderRadius:"5px",
         display:"flex",
         justifyContent:"center",
         alignItems:"center"

     }}>
         <div style={{width:"520px",height:"495px",padding:"20px"}}>
             <div style={{margin:"auto",borderBottom:".5px solid gray"}}>
                  <div style={{textAlign:"center"}}><img width="45px" height="45px" src={image} alt="" /></div>
                 <div style={{fontSize:"30px",textAlign:"center"}}>Sign up to Alpha</div>
             </div>
             <div style={{margin:"auto",marginTop:"30px",position:"absolute",left:"50%",transform:"translate(-50%, 0)"}}>
                 <form  method='post' onSubmit={handleOnSubmit}>
                 <div>
                 <label htmlFor="name" style={{fontWeight:"normal",fontSize:"15px"}}>Name</label><br />
                 <input id='name' name='name' onChange={handleOnChnage} type="text" style={{width:"350px",height:"30px",padding:"10px",fontSize:"16px",backgroundColor:"transparent",border:"1px solid rgb(85, 85, 85)",borderRadius:"3px"}} required/><br />
                 </div>
                 <div style={{marginTop:"20px"}}>
                 <label htmlFor="email" style={{fontWeight:"normal",fontSize:"15px"}}>Email</label><br />
                 <input id='email' name='email' type="email" onChange={handleOnChnage} style={{width:"350px",height:"30px",padding:"10px",fontSize:"16px",backgroundColor:"transparent",border:"1px solid rgb(85, 85, 85)",borderRadius:"3px"}} required/><br />
                 </div>
                 <div style={{marginTop:"20px"}}>
                 <label htmlFor="password" style={{fontWeight:"normal",fontSize:"15px"}}>Set password</label><br />
                 <input id='password' name='password' onChange={handleOnChnage} type="password" style={{width:"350px",height:"30px",padding:"10px",fontSize:"16px",backgroundColor:"transparent",border:"1px solid rgb(85, 85, 85)",borderRadius:"3px"}} required/><br />
                 </div>
                 <div style={{textAlign:"center"}}>
                     <input  id='subButton' type="submit" value="Sign Up" style={{height:"40px",width:"300px",marginTop:"40px",borderRadius:"30px",border:"none",backgroundColor:"rgb(30 215 96)",color:"black",fontWeight:"bold",fontSize:"15px"}}/>
                 </div>
                 </form>
             </div>
         </div>

    </div>
 </div>
  )
}

export default Signup
