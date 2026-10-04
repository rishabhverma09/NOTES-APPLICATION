
import User from "../module/user.js";
import { jwtMiddleware,generatetoken } from "../jwt.js";
import   express from "express";

  


const router = express.Router();
router.post('/signup',async(req,res)=>{
    try{
        const userData = req.body;
        // for email validation
        
        if(!userData.email|| !userData.email.includes('@')){
          return res. status(400).json({error:'Please Enter a valid email'});
        }
        if(!userData.password||userData.password.length<6){
            return res.status(400).json({error:'Password must be at least 6 characters'});
        }
        const newuserData = new User(userData);
      const   response = await newuserData.save();

      const safeuser={
        id :response._id,
        name:response.name,
        email:response.email
      };
       

       const payload ={
        id:newuserData.id
       }
       console.log(JSON.stringify(payload));
       const token = generatetoken(payload);
       console.log('token is:',token);
        res.status(200).json({user:safeuser,token:token});

    }catch(error){
        console.log(error);

        if (error.code===11000){
            return res.status(409).json({error:'Email allready registered'});
        }
        res.status(500).json({error:'internal server error'});

    }
});

router.post('/login', async(req,res)=>{
    try{
        const {email , password}= req.body;
        const user = await User.findOne({email:email});
        if(!user||(!await user.comparePassword(password))){
         return   res.status(401).json({error:'Incorrect username or password'});
        }
        const payload={
            id:user.id
        }
        const token = generatetoken(payload);
         const safeuser={
            _id: user.id,
            name:user.name,
            email:user.email
         }
         return res.status(200).json({user:safeuser,token:token});

    }catch(error){
          console.log(error);
        res.status(500).json({error:'internal server error'});

    }
});





router.get('/dashboard',jwtMiddleware, async(req,res)=>{
    try{
        const user =await User.findById(req.user.id).select('-password');

        if(!user){
         return    res.status(404).json({error:"user not found"});
        }
        res.status(200).json({message:"Welcome to dashboard",
        user:user
        });
    }catch(error){
         console.log(error);
         res.status(500).json({error:'internal server error'});
    }
});
export default router;