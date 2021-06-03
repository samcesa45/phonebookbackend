const mongoose = require('mongoose');

if (process.argv.length < 3) {
	console.log(
		'Please provide the password as an argument: node mongo.js <password>'
	);
	process.exit(1);
}
const password = process.argv[2];

const url = `mongodb+srv://endsars101:${password}@blog.2kxh9.mongodb.net/person-app?retryWrites=true&w=majority`;

mongoose.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false,
});

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Person = mongoose.model('Person', personSchema);

const person = new Person({
	name: 'Arto Hellas',
	number: '040-123456',
});

person.save().then((result) => {
	console.log('person saved!');
	mongoose.connection.close();
});

// Person.find({}).then((result) => {
// 	result.forEach((person) => {
// 		console.log(person);
// 	});
// 	mongoose.connection.close();
// });
