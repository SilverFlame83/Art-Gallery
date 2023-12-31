const router = require("express").Router();
const { isUser, isOwner, isNotOwner } = require("../middlewares/guards");
const { parseError } = require("../util/parsers");

router.get("/create", (req, res) => {
  res.render("create");
});

router.post("/create", isUser(), async (req, res) => {
  try {
    const examData = {
      title: req.body.title,
      technique: req.body.technique,
      imageUrl: req.body.imageUrl,
      certificate: req.body.certificate,
      owner: req.user._id,
    };
    await req.storage.createExam(examData);
    res.redirect("/exam/catalog");
  } catch (err) {
    console.log(err.message);
    const ctx = {
      errors: parseError(err),
      examData: {
        title: req.body.title,
        technique: req.body.technique,
        imageUrl: req.body.imageUrl,
        certificate: req.body.certificate,
      },
    };
    res.render("create", ctx);
  }
});

router.get("/catalog", async (req, res) => {
  const exams = await req.storage.getAllExam();
  res.render("catalog", { exams });
});

router.get("/details/:id", async (req, res) => {
  const exam = await req.storage.getExamById(req.params.id);
  exam.isOwner = req.user && req.user._id == exam.owner._id;
  exam.shared = req.user && exam.usersShared.find((u) => u == req.user._id);

  res.render("details", { exam });
});

router.get("/share/:id", isUser(), isNotOwner(), async (req, res) => {
  req.storage.shared(req.user._id, req.params.id);
  res.redirect("/exam/details/" + req.params.id);
});

router.get("/edit/:id", isOwner(), isUser(), async (req, res) => {
  try {
    const exam = await req.storage.getExamById(req.params.id);
    res.render("edit", { exam });
  } catch (err) {
    console.log(err.message);
    res.redirect("/exam/details/" + req.params.id);
  }
});

router.post("/edit/:id", isOwner(), isUser(), async (req, res) => {
  try {
    await req.storage.editExam(req.params.id, req.body);
    res.redirect("/exam/details/" + req.params.id);
  } catch (err) {
    const ctx = {
      errors: parseError(err),
      exam: {
        title: req.body.title,
        technique: req.body.technique,
        imageUrl: req.body.imageUrl,
        certificate: req.body.certificate,
      },
    };
    res.render("edit", ctx);
  }
});

router.get("/profile", isUser(), async (req, res) => {
  const exams = await req.storage.getAllExam();
  const userId = req.user._id;
  let shared = [];
  let userTitle = [];
  for (let e of exams) {
    for(let s of e.usersShared ){

      if (s == userId) {
        shared.push(e.title);
      }
    }
    if (e.owner._id == userId) {
      userTitle.push(e.title);
    }
  }

  //console.log("shared", shared, "user", userTitle);
  res.render("profile", { shared, userTitle });
});

router.get("/delete/:id", isOwner(), isUser(), async (req, res) => {
  try {
    await req.storage.deleteExam(req.params.id);
    res.redirect("/exam/catalog");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
