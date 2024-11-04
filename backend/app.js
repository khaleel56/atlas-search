const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors')

const app = express()

mongoose.connect('DBURL')
const userModel = require('./models/user')

app.use(cors())

app.use(express.json());

app.get('/users', async (req, res)=>{
    try{
        const usersList = await userModel.find().lean();
        return res.json({message:'success', usersList:usersList})
    }catch(err){
        console.log(err)
    }
})

//normal search
app.post('/usersList', async (req, res) => {
    try {
        const userName = req.body.userName;
        const usersList = await userModel.find({userName:userName});
        return res.json({ message: 'success', usersList: usersList })
    } catch (err) {
        console.log(err)
    }
})

//atlas-search
app.post('/api/v1/handleSearch', async (req, res) => {
    try {
        const userTerm = req.body.userTerm;
        const aggregationPipeLine = [
            {
                $search: {
                    index: "default",
                    compound: {
                        should: [
                            {
                                wildcard: {
                                    query: `*${userTerm}*`,
                                    path: "userName",
                                    allowAnalyzedField: true
                                }
                            },
                            // {
                            //     wildcard: {
                            //         query: `*${userTerm}*`,
                            //         path: "email",
                            //         allowAnalyzedField: true
                            //     }
                            // }
                        ]
                    }

                }
            },
            {
                $project: {
                    emailId:1,
                    userName: 1,
                }
            }
        ]
        const usersList = await userModel.aggregate(aggregationPipeLine);
        return res.json({ message: 'success', usersList: usersList })
    } catch (err) {
        console.log(err)
    }
})

app.listen(4000, ()=>console.log(`server running on 4000`))
