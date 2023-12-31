const Exam = require("../models/Exam");

async function getAllExam() {
    // Change owner if necceserry
    return Exam.find().populate("owner").lean();
}

async function getExamById(id) {
    // Change owner if necceserry
    return Exam.findById(id).populate("owner").lean();
}

async function createExam(examData) {
    const exam = new Exam(examData);

    await exam.save();
  
    return exam;
}

async function editExam(id, examData) {
    const exam = await Exam.findById(id);
    exam.title= examData.title,
    exam.technique= examData.technique,
    exam.imageUrl= examData.imageUrl,
    exam.certificate= examData.certificate
  
    return exam.save();
}

async function deleteExam(id) {
    await Exam.findByIdAndDelete(id);
}
async function shared(userId, examId){
    const exam = await Exam.findById(examId);
    exam.usersShared.push(userId);

    return exam.save();

}

module.exports = {
  createExam,
  getAllExam,
  getExamById,
  editExam,
  shared,
  deleteExam,

};