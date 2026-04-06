const db=require("../db/knex");

exports.getSlots=async(req,res)=>{
    try{
        const slots=await db("parking_slots");
        res.json(slots);
    } catch(err){
        res.status(500).json({error:err.message});
    }
};

exports.updateSlot=async(req,res)=>{
    const {id,status}=req.body;
    try{
        await db("parking_slots".where({id}).update({status}));
        res.json({message:"Slot Updated successfully..."});
    } catch(err){
        res.status(500).json({error:err.message});
    }
};