require('dotenv').config();
const express = require('express');
const Person = require('./models/person');
const cors = require('cors');
const middleware = require('./utils/middleware');

const app = express();

app.use(express.static('build'));
app.use(cors());
app.use(express.json());

app.use(middleware.requestLogger);

app.get('/api/persons', (request, response, next) => {
	Person.find({})
		.then((persons) => {
			response.json(persons);
		})
		.catch((error) => next(error));
});

app.get('/api/persons/:id', (request, response) => {
	Person.findById(request.params.id)
		.then((person) => {
			if (person) {
				response.json(person);
			} else {
				response.status(404).end();
			}
		})
		.catch((error) => next(error));
});

app.post('/api/persons', (request, response, next) => {
	const body = request.body;

	if (!body.name || !body.number) {
		return response.status(400).json({
			error: 'name or number is missing',
		});
	}

	const person = new Person({
		name: body.name,
		number: body.number,
	});

	person
		.save()
		.then((savedPerson) => {
			response.json(savedPerson);
		})
		.catch((error) => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
	const body = request.body;
	const person = {
		name: body.name,
		number: body.number,
	};

	Person.findByIdAndUpdate(request.params.id, person, { new: true })
		.then((updatedPerson) => {
			response.json(updatedPerson);
		})
		.catch((error) => next(error));
});

app.delete('/api/persons/:id', (request, response) => {
	Person.findByIdAndRemove(request.params.id).then((result) => {
		response.status(204).end();
	});
});

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

const PORT = process.env.PORT || 3002;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
