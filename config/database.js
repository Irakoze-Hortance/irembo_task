const mongoose=require('mongoose')
mongoose.connect('mongodb+srv://hortance:hortance@cluster0.s6cbo.mongodb.net/?retryWrites=true&w=majority',{
                useNewUrlParser: true, 
                useUnifiedTopology: true
                })
        .then(()=>{
            console.log('db connected')
        })
        .catch(e=>{
            console.error('Connection error',e.message)
        })

        const db=mongoose.connection
        module.exports=db