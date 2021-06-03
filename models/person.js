const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const MONGO_URI = process.env.MONGO_URI;

mongoose
	.connect(MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	})
	.then((result) => {
		console.log('Connected to mongo.db');
	})
	.catch((error) => {
		console.log('oops error connecting to mongo db', error.message);
	});

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minlength: 5,
		unique: true,
		required: true,
	},
	number: {
		type: String,
		minlength: 5,
		required: true,
	},
});

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

personSchema.plugin(uniqueValidator);
const Person = mongoose.model('Person', personSchema);

module.exports = Person;
