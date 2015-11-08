var mongoose = require('mongoose')
var bcrypt   = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  pass: {type: String, required: true },
  role: { type: Number, default: 1 },
	created: { type: Date, default: Date.now },
	__v: { type: Number, select: false },
})

//methods ======================
//generating a hash
userSchema.methods.generateHash = function(password) {
 return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//checking if password is valid
userSchema.methods.validPassword = function(password) {
 return bcrypt.compareSync(password, this.pass);
};

module.exports = mongoose.model('user', userSchema)
