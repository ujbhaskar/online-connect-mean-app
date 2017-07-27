var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
    message: {type: String, required: true},
    sender: {type: String, required: true},
    receiver: [{type: String, required: true}],
    type: {type: String, required: true},
    date: {type:String, default: new Date().toISOString()},
    seen:{type:Boolean,default:false}
});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Message', schema);