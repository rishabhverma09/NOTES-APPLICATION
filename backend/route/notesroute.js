import express from "express";
import Note from "../module/notes.js";
import { jwtMiddleware } from "../jwt.js";


const router = express.Router();

router.post('/',jwtMiddleware,async(req, res)=>{
    try{

        const notes = {title : req.body.title, content:req.body.content,
            user:req.user.id
        };
        
        const newnotes= new Note(notes);
        const response= await newnotes.save()
        return res.status(200).json(response);

      

    }catch(error){
        console.log(error);
            res.status(500).json({error:'internal server error'});
        
    }
});


// get method for finding the  all notes of user


router.get('/',jwtMiddleware,async(req,res)=>{
    try{
        const  search =req.query.search;
        let query = {
            user : req.user.id
        } 
        if(search){
            query.$or=[
                {title:{$regex:search,$options:"i"}},
                {content:{$regex:search,$options:'i'}}
            ];
        }
        const notes = await Note.find(query);
        return res.status(200).json(notes);

    }catch(error){
        console.log(error);
        res.status(500).json({error:'internal server error'});
    }
});



// get method for finding one notes for user

router.get('/:id',jwtMiddleware,async(req,res)=>{
    try{
        const notes = await Note.findOne({_id: req.params.id, 
            user:req.user.id
        });
        if(!notes){
            return res.status(404).json({error:'notes not found'});
        }
        return res.status(200).json(notes);
         

    }catch(error){
        console.log(error);
        res.status(500).json({error:'internal server error'});
    }
});


// for updateation and change the notes


router.put('/:id',jwtMiddleware,async(req,res)=>{
    try{
        const notes = await Note.findOne({_id:req.params.id,
            user:req.user.id
        });
        if(!notes){
            return res.status(404).json({error:"Notes not found"});
        }

        notes.title= req.body.title;
        notes.content=req.body.content;
        const response = await notes.save();
        return res.status(200).json(response);

    }catch(error){
        console.log(error);
        res.status(500).json({error:'internal server error'});
    }
    
});


// for deleting a note 

router.delete('/:id',jwtMiddleware,async(req,res)=>{
    try{
        const notes = await Note.findOne({_id:req.params.id,user:req.user.id});
        if(!notes){
            return res.status(404).json({error:'Notes not found'});
        }

        await notes.deleteOne();
        return res.status(200).json({message:'Notes deleted successfully'});

    }catch(error){
               console.log(error);
        res.status(500).json({error:'internal server error'});
    }
})
export default router;