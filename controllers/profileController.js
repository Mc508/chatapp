
const profielCOntroller = async(req,res)=>{
    const token = req.cookies?.authToken
    if(token){
        jwt.verify(token,process.env.JWTPRIVATEKEY,{},async(err,userData)=>{
            if(err){
                return res.status(400).send(err)
            }else{
                const user = await User.findById({_id:userData._id})
                res.json(user)
            }
        })
    }else{
        res.status(401).json("not authorized")
    }
}

const profileUpdate = async(req,res)=>{
    const token = req.cookies?.authToken
    if(token){
        jwt.verify(token,process.env.JWTPRIVATEKEY,{},async(err,userData)=>{
            if(err) throw err
        })
    }else{
        res.status(401).json("not authorized")
    }
    const {firstName,lastName,email,avatatLink} = req.body
    const user = await User.findOne({email:email})

    if(user){
        user.firstName = firstName
        user.lastName = lastName
        user.email = email
        user.avatatLink = avatatLink
        await user.save()
        res.json(user)
    }
}


export {profielCOntroller,profileUpdate}