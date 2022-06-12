const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const fileUpload = require('express-fileupload');

const app = express()

//Routers to define response to certian URLs
const ViewRecipesRouter = require('./routes/ViewRecipes')
const FeedbackRouter = require('./routes/Feedback')


//set engine?
app.set("view engine", "ejs");

//Location of ejs views
app.set("views", path.join(__dirname, "views"));

//favicno icon
app.use(favicon(path.join(__dirname, 'public','Images', 'favicon.ico')))

//Location of static resources
app.use(express.static(__dirname + '/public'))

//parse form data
app.use(express.urlencoded({ extended:false}))

//file upload middleware
app.use(fileUpload());

//Routers for extended URLS
app.use('/Recipes',ViewRecipesRouter)
app.use('/Feedback',FeedbackRouter)

app.post('/readPython', (req, res) => {

res.send('check console')
})

//future about page
app.get("/about", (req, res) => {
  res.render("about");
});

app.all('*', (req, res) => {
	console.log(req.params);
	res.status(404).send('Resource Not Found')
})

app.listen(5000, () => {
	console.log('Server is listening on port 5000')
})


