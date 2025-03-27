import React, { useEffect, useState } from 'react'
import css from './auth.module.css'
import image from "../Images/headphone.png";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';


function Login() {
    const navigate = useNavigate()
    const [userData,setUserData] = useState({
       email:"",
       password:""
    })
    const addUser = async() =>{  
   
      try {
        
        console.log(userData);
      await  axios({
            method: 'post',
            url: 'https://authentication-seven-umber.vercel.app/api/login',
            data:userData, // Body
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer YOUR_TOKEN'
            }
          })
          .then(response => {
            toast.success('Welcome Back',{duration:2000});
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
      let value = e.target.value;
      console.log(name, value);
      
        setUserData({
            ...userData,
            [name]:value,
          })
          
      
    }



  return (
    <div className={css.maincontainer}>
       <div className="container" style={{
            
            width:"465px",
            height:"490px",
            backgroundColor:"#121212",
            borderRadius:"5px",
            display:"flex",
            justifyContent:"center",
            alignItems:"center"

        }}>
            <div style={{width:"520px",height:"438px",padding:"20px"}}>
                <div style={{margin:"auto",borderBottom:".5px solid gray"}}>
                     <div style={{textAlign:"center"}}><img width="45px" height="45px" src={image} alt="" /></div>
                    <div style={{fontSize:"30px",textAlign:"center"}}>Log in to Alpha</div>
                </div>
                <div style={{margin:"auto",marginTop:"30px",position:"absolute",left:"50%",transform:"translate(-50%, 0)"}}>
                    <form  method='post' onSubmit={handleOnSubmit}>
                    <div>
                    <label htmlFor="email" style={{fontWeight:"normal",fontSize:"15px"}}>Email</label><br />
                    <input id='email' name='email' onChange={handleOnChnage} type="email" style={{width:"350px",height:"30px",padding:"10px",fontSize:"16px",backgroundColor:"transparent",border:"1px solid rgb(85, 85, 85)",borderRadius:"3px"}}/><br />
                    </div>
                    <div style={{marginTop:"20px"}}>
                    <label htmlFor="password"  style={{fontWeight:"normal",fontSize:"15px"}}>Password</label><br />
                    <input id='password' name="password" type="password" onChange={handleOnChnage} style={{width:"350px",height:"30px",padding:"10px",fontSize:"16px",backgroundColor:"transparent",border:"1px solid rgb(85, 85, 85)",borderRadius:"3px"}}/><br />
                    </div>
                    <div style={{textAlign:"center"}}>
                        <input id='subButton' type="submit" value="Login" style={{height:"40px",width:"300px",marginTop:"40px",borderRadius:"30px",border:"none",backgroundColor:"rgb(30 215 96)",color:"black",fontWeight:"bold",fontSize:"15px"}}/>
                    </div>
                    </form>
                </div>
            </div>

       </div>
    </div>
  )
}

export default Login
