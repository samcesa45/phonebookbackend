const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(express.json());
app.use(express.static('build'));

morgan.token('person', (request) => {
	if (request.method === 'POST') {
		return JSON.stringify(request.body);
	}
});
app.use(
	morgan(
		':method :url :status :res[content-length] - :response-time ms :person'
	)
);

let persons = [
	{
		id: 1,
		name: 'Arto Hellas',
		number: '040-123456',
	},
	{
		id: 2,
		name: 'Ada Lovelace',
		number: '39-44-5323523',
	},
	{
		id: 3,
		name: 'Dan Abramov',
		number: '12-43-234345',
	},
	{
		id: 4,
		name: 'Mary Poppendick',
		number: '39-23-6423122',
	},
];
app.get('/info', (request, response) => {
	response.send(
		`<p>Phonebook has info for ${
			persons.length
		} people</p> <p>${new Date()}</p>`
	);
});

app.get('/api/persons', (request, response) => {
	response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id);
	const person = persons.find((p) => p.id === id);
	if (person) {
		return response.json(person);
	} else {
		return response.status(404).end();
	}
});

const generateId = () => {
	const maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
	return maxId + 1;
};

app.post('/api/persons', (request, response) => {
	const body = request.body;

	const unique = persons.find((p) => p.name === body.name);
	const person = {
		name: body.name,
		number: body.number,
		id: generateId(),
	};

	if (!body.name || !body.number) {
		return response.status(400).json({
			error: 'name or number is missing',
		});
	}

	if (unique) {
		return response.status(400).json({
			error: 'name must be unique',
		});
	}

	persons = persons.concat(person);

	response.json(person);
});

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id);
	persons = persons.filter((p) => p.id !== id);

	response.status(204).end();
});

const PORT = process.env.PORT || 3002;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
