const exam = require('../services/exam')

module.exports = () => (req,res,next)=>{
    req.storage = {
        ...exam
    }

    next();
}