const services = require('../services/exam')


function isUser() {
    return (req, res, next) => {
        if (req.user) {
            next();
        } else {
            res.redirect('/auth/login');
        }
    }
}

function isGuest() {
    return (req, res, next) => {
        if (!req.user) {
            next();
        } else {
            res.redirect('/');
        }
    }
}
//Change according the exam
function isOwner() {
  return async (req, res, next) => {
    if (req.user == undefined) {
      res.render("register");
    } else {
      const userId = req.user._id;
      const examId = req.params.id;
      let exam;
    
      try {
        exam = await services.getExamById(examId);
      } catch (err) {
        console.log(err);
        res.render("404", { err: "Cant'find that exam!" });
      }
        //console.log(exam)
        if (exam.owner._id == userId) {
          next();
        } else {
          res.render("404", { err: "Unauthorized!" });
        }
      
    }
  };
}
function isNotOwner() {
  return async (req, res, next) => {
   
    if (req.user == undefined) {
      res.render("register");
    } else {
      const examId = req.params.id;
      let exam;

      try {
        exam = await services.getExamById(examId);
      } catch (err) {
        console.log(err);
        res.render("404", { err: "Cant'find that exam!" });
      }
  
        if (exam.owner._id == req.user._id) {
          res.render("404");
        } else {
          next();
        }
     
    }
  };
}
module.exports = {
    isUser,
    isGuest,
    isOwner,
    isNotOwner
};