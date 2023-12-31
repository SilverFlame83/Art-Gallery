const router = require('express').Router();

router.get('/',async (req,res)=>{
    const exams = await req.storage.getAllExam();
    res.render('home',{exams})
})

module.exports = router;