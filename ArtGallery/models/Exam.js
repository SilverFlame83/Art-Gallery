const { Schema, model } = require('mongoose');

const schema = new Schema({
    title: { type: String,minLength:6, required: [true, "Title is required and should be at least 6 characters long!"]  },
    technique:{type: String,maxLength:15,required: [true, "Technique is required and shouldn't be longer than 15 characters!"] },
    imageUrl: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
                return urlRegex.test(v);
            },
            message: (props) => `${props.value} is not a valid URL`,
        },
    },
    certificate: { type: String,enum:['Yes','No'], required: [true, "You should choose Yes or No!"]  },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    usersShared: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
});

module.exports = model('Exam', schema);