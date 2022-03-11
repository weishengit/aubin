const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const Document = require('./models/Document');

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/aubin', {
	useUnifiedTopology: true,
	useNewUrlParser: true,
});

app.get('/', (req, res) => {
	const code = `Welcome To AUBin!

Use AUBin to share your code snippets.
Select the commands in the top right corner
to create a new file to share with others`;

	res.render('display', { code: code });
});

app.get('/new', (req, res) => {
	res.render('new');
})

app.post('/save', async (req, res) => {
	const value = req.body.value;
	try {
		const document = await Document.create({ value: value });
		res.redirect(`/${document.id}`);
	} catch (error) {
		res.render("new", { value })
	}
});

app.get('/:id/duplicate', async (req, res) => {
	const id = req.params.id;
	try {
		const document = await Document.findById(id);
		res.render('new', { value: document.value});
	} catch (error) {
		res.redirect(`/${id}`);
	}
});

app.get('/:id', async (req, res) => {
	const id = req.params.id;
	try {
		const document = await Document.findById(id);
		res.render('display', { code: document.value, id});
	} catch (error) {
		res.redirect('/');
	}
});



app.listen(3000);