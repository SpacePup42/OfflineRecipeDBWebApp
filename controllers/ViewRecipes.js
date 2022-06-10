/*
In future want
-a short about page
-edit values in table?
*/

const express = require('express');
const path = require('path');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const {spawn} = require('child_process');

const db_name = path.join(__dirname, "..", "Database", "Menu.sqlite");
const db = new sqlite3.Database(db_name, err => {
  if (err) {
    return console.error(err.message + " " + db_name);
  }else{
  console.log("Successful connection to the database");
  }
});


const AllRecipes = (req,res) => {
	
	const sql = "SELECT Recipe.recipe_id, Recipe.recipe_name, Recipe.recipe_ingredients, Cuisine.cuisine, Method.method, Effort.effort, Course.course, Diet.diet FROM Recipe, Cuisine, Method, Effort, Course, Diet Where Recipe.cuisine_id = Cuisine.cuisine_id AND Recipe.method_id = Method.method_id AND Recipe.effort_id = Effort.effort_id AND Recipe.course_id = Course.course_id AND Recipe.diet_id = Diet.diet_id"

	db.all(sql, [], (err, rows) => {
	if (err) {
		return console.error(err.message);
		}
	//const wallet = rows
	//console.log(Object.values(wallet[2]));
	res.render("FullMenu", { recipes: rows });
	//console.log(rows[0])
	});
}

const RecipeDetails = (req,res) => {

           //console.log(Number(req.params.ID))
	if (isNaN(req.params.ID)) {
			return res.status(404).send('Recipe Does Not Exist (Invalid URL)')
			}
	const sql = "SELECT Recipe.recipe_id, Recipe.recipe_name, Recipe.recipe_url, Recipe.recipe_notes, Recipe.recipe_ingredients, Recipe.recipe_instructions, Recipe.date, Cuisine.cuisine, Course.course, Method.method, Effort.effort, Diet.diet, Recipe.image_id FROM Recipe, Cuisine, Method, Effort, Course, Diet Where Recipe.cuisine_id = Cuisine.cuisine_id AND Recipe.method_id = Method.method_id AND Recipe.effort_id = Effort.effort_id AND Recipe.course_id = Course.course_id AND Recipe.diet_id = Diet.diet_id AND Recipe.recipe_id = ?"
	
	const sqlImage = "SELECT RecipeImage.image From Recipe, RecipeImage Where Recipe.image_id = RecipeImage.image_id AND Recipe.recipe_id =?"
	
	
	db.get(sql, [Number(req.params.ID)], (err, rows) => {
	//console.log(rows.recipe_ingredients)
	//console.log(rows)
	if (err) {
			return console.error(err.message);
			return res.status(404).send('Detailed SQL failed')
			}
	//Pulls out ingredient and instructions and breaks them into arrays of individual sentences for better html display
	let ingredientArray = rows.recipe_ingredients.match(/{(.*?)}/g)
	let instructionArray = rows.recipe_instructions.replace(/\n/, '').match(/[^\.!\?]+[\.!\?]+/g)

	if (ingredientArray == null) {
    	ingredientArray= ['{Check DB. Formatted Incorrectly}']
  	}
	if (instructionArray == null) {
    	instructionArray= ['Check DB. Formatted Incorrectly']
 	 }
	
		
		//console.log(rows.length)

		//if (rows && rows.length >0 ) {
		//console.log(rows[0].image_id)
		let mySrc;
		db.get(sqlImage,  [Number(req.params.ID)], (err, img) => {
		//console.log(img)

			if (img) {
			//console.log("ImageFound")
			mySrc = Buffer.from(img.image).toString('base64');
			}
			//console.log("check")
			//console.log(mySrc)
			//console.log(instructionArray)
			res.render("DetailRecipe", { recipe: rows, imageBuffer : mySrc, ingredients : ingredientArray, instructions : instructionArray});
		});
/*		
	} else {
		return res.status(404).send('Recipe Does Not Exist_Catch1')
		}
*/
	//console.log(rows)
	});
}

const EditRecipe = (req,res) => {


	//console.log(req.params)
	if (isNaN(req.params.ID)) {
			return res.status(404).send('Recipe Does Not Exist_Catch2 (Invalid URL)')
			}
	let CuisineArray;
	let EffortArray;
	let MethodArray;
	let CourseArray;
	let DietArray;

           //console.log(Number(req.params.ID))
	if (isNaN(req.params.ID)) {
			return res.status(404).send('Recipe Does Not Exist_Catch3 (Invalid URL)')
			}

	const sql = "SELECT Recipe.recipe_id, Recipe.recipe_name, Recipe.recipe_url, Recipe.recipe_notes, Recipe.recipe_ingredients, Recipe.recipe_instructions, Recipe.date, Cuisine.cuisine, Course.course, Method.method, Effort.effort, Diet.diet, Recipe.image_id FROM Recipe, Cuisine, Method, Effort, Course, Diet Where Recipe.cuisine_id = Cuisine.cuisine_id AND Recipe.method_id = Method.method_id AND Recipe.effort_id = Effort.effort_id AND Recipe.course_id = Course.course_id AND Recipe.diet_id = Diet.diet_id AND Recipe.recipe_id = ?"
	
	const sqlImage = "SELECT RecipeImage.image From Recipe, RecipeImage Where Recipe.image_id = RecipeImage.image_id AND Recipe.recipe_id =?"
	
	const sqlCuisine = "SELECT Cuisine.cuisine From Cuisine"
	
	const sqlEffort = "SELECT Effort.effort From Effort"

	const sqlMethod = "SELECT Method.method From Method"

	const sqlCourse = "SELECT Course.course From Course"

	const sqlDiet = "SELECT Diet.diet From Diet"
	
	db.all(sqlCuisine, [], (err, rows) => {
	//console.log(rows);
	CuisineArray = rows;
	//console.log(CuisineArray);
	})

	db.all(sqlEffort, [], (err, rows) => {
	//console.log(rows);
	EffortArray = rows;
	//console.log(CuisineArray);
	})

	db.all(sqlMethod, [], (err, rows) => {
	//console.log(rows);
	MethodArray = rows;
	//console.log(CuisineArray);
	})

	db.all(sqlCourse, [], (err, rows) => {
	//console.log(rows);
	CourseArray = rows;
	//console.log(CuisineArray);
	})

	db.all(sqlDiet, [], (err, rows) => {
	//console.log(rows);
	DietArray = rows;
	//console.log(CuisineArray);
	})

	db.all(sql, [Number(req.params.ID)], (err, rows) => {
	//console.log(rows[0].recipe_ingredients)
	
	//Pulls out ingredient and instructions and breaks them into arrays of individual sentences for better html display
	let ingredientArray = rows[0].recipe_ingredients.match(/{(.*?)}/g)
	let instructionArray = rows[0].recipe_instructions.replace(/\n/, '').match(/[^\.!\?]+[\.!\?]+/g)
	
	//console.log(list)
	
		if (err) {
			return console.error(err.message);
			}
		if (rows && rows.length >0 ) {
		//console.log(rows[0].image_id)
		let mySrc;
		db.all(sqlImage,  [Number(req.params.ID)], (err, img) => {
			if (img  && img.length > 0) {
			//console.log(rows)
			mySrc = Buffer.from(img[0].image).toString('base64');
			}
			
			//console.log(mySrc)
			//console.log(CuisineArray)
			res.render("EditRecipe", { recipe: rows, cuisine: CuisineArray, effort: EffortArray, method: MethodArray, course: CourseArray, diet: DietArray, ingredients : ingredientArray, instructions : instructionArray, imageBuffer : mySrc});
		});		
	} else {
		return res.status(404).send('Recipe Does Not Exist_Catch4')
		}
	//console.log(rows)
	});

}

const PublishEdit = (req,res) => {


	

	let CuisineID
	let EffortID
	let MethodID
	let CourseID
	let DietID

	sqlCuisineID = "SELECT Cuisine.cuisine_id From Cuisine WHERE Cuisine.cuisine = ?"
	sqlEffortID = "SELECT Effort.effort_id From Effort WHERE Effort.effort = ?"
	sqlMethodID = "SELECT Method.method_id From Method WHERE Method.method = ?"
        sqlCourseID = "SELECT Course.course_id From Course WHERE Course.course = ?"
	sqlDietID = "SELECT Diet.diet_id From Diet WHERE Diet.diet = ?"

db.serialize(function() {
	db.all(sqlCuisineID, [req.body.cuisine], (err, rows) => {
	//console.log(req.body.cuisine)
	//console.log(rows[0].cuisine_id)
	CuisineID = rows[0].cuisine_id;
	
	sqlUpdate = "UPDATE Recipe SET cuisine_id = ? WHERE recipe_id = ?"
	//console.log('Cuisine update')

	db.all(sqlUpdate, [ CuisineID, req.body.recipe_id], (err, rows) => {
	if (err) {
			return console.error(err.message);
		}
	});

	
	});

	db.all(sqlEffortID, [req.body.effort], (err, rows) => {
	//console.log(req.body.effort)
	//console.log(rows[0].effort_id)
	EffortID = rows[0].effort_id;
	
	sqlUpdate = "UPDATE Recipe SET effort_id = ? WHERE recipe_id = ?"
	//console.log('Effort update')

	db.all(sqlUpdate, [ EffortID, req.body.recipe_id], (err, rows) => {
	if (err) {
			return console.error(err.message);
		}
	});

	
	});

	db.all(sqlMethodID, [req.body.method], (err, rows) => {
	//console.log(req.body.method)
	//console.log(rows[0].method_id)
	MethodID = rows[0].method_id;

	sqlUpdate = "UPDATE Recipe SET method_id = ? WHERE recipe_id = ?"
	//console.log('Method update')

	db.all(sqlUpdate, [ MethodID, req.body.recipe_id], (err, rows) => {
	if (err) {
			return console.error(err.message);
		}
	});

	});

	db.all(sqlCourseID, [req.body.course], (err, rows) => {
	//console.log(req.body.course)
	//console.log(rows[0].course_id)
	CourseID = rows[0].course_id;

	sqlUpdate = "UPDATE Recipe SET course_id = ? WHERE recipe_id = ?"
	//console.log('Course update')

	db.all(sqlUpdate, [ CourseID, req.body.recipe_id], (err, rows) => {
	if (err) {
			return console.error(err.message);
		}
	});
	});

	db.all(sqlDietID, [req.body.diet], (err, rows) => {
	//console.log(req.body.diet)
	//console.log(rows[0].diet_id)
	DietID = rows[0].diet_id;
	
	sqlUpdate = "UPDATE Recipe SET diet_id = ? WHERE recipe_id = ?"
	//console.log('Diet update')

	db.all(sqlUpdate, [ DietID, req.body.recipe_id], (err, rows) => {
	if (err) {
			return console.error(err.message);
		}

	});
	});

	sqlUpdate = "UPDATE Recipe SET recipe_name = ?, recipe_url = ?, recipe_notes = ?, recipe_ingredients = ?, recipe_instructions = ? WHERE recipe_id = ?"
	//console.log("Starting insert")
	//console.log(typeof(CuisineID))

	 db.all(sqlUpdate, [req.body.text[0], req.body.text[2], req.body.text[1], req.body.text[3], req.body.text[4], req.body.recipe_id], (err, rows) => {

	//console.log("Finished")
	//console.log(typeof(CuisineID))
	//console.log(rows.affectedRows + " record(s) updated");
	if (err) {
			return console.error(err.message);
		}
	});

	//console.log(req.files)
	if (req.files != null) {
	//console.log(req.files)
	const {name, data} = req.files.avatar;
	//console.log(data)

	const sqlImage = "SELECT RecipeImage.image, Recipe.image_id From Recipe, RecipeImage Where Recipe.image_id = RecipeImage.image_id AND Recipe.recipe_id =?"

	db.all(sqlImage, [req.body.recipe_id], (err, rows) => {
	if (rows  && rows.length > 0) {	//If image exists update image
	
	sqlImgUpdate = "UPDATE RecipeImage SET image = ? WHERE image_id = ?"
	db.all(sqlImgUpdate, [data, req.body.recipe_id], (err, rows) => {
	if (err) {
			return console.error(err.message);
		}
	});

	

	} else { //insert new picture
	//console.log("No Picture Exists")
	sqlImgInsert = " INSERT INTO RecipeImage(image_id, image) VALUES (?,?)"
	db.all(sqlImgInsert, [req.body.recipe_id, data], (err, rows) => {
	if (err) {
			return console.error(err.message);
		}
	sqlLink = " UPDATE Recipe SET image_id = ? WHERE recipe_id = ?"
	db.all(sqlLink, [req.body.recipe_id, req.body.recipe_id], (err, rows) => {
	if (err) {
			return console.error(err.message);
		}
	});
	});
	}
	});

	}//if picture is uploaded
}) //db serialize
	//res.send("Published")
	res.redirect('/Recipes/'+req.body.recipe_id);

}

const NewRecipeForm = (req,res) => {
	res.render("NewRecipeForm")
}

const CreateRecipe = (req,res) => {
	console.log(req.body.xURL)
	var dataToSend;

	const python = spawn('python3',['./python/script1.py',req.body.xURL]);

	// collect data from script
 	python.stdout.on('data', function (data) {
 	 console.log('Pipe data from python script ...');
 	 dataToSend = data.toString();
 	});


 	// in close event we are sure that stream from child process is closed
 	python.on('close', (code) => {
	if (code != 0) {
	return res.status(404).send('<h1>404 Recipe Scrapper Python Errored</h1>')
	} else{
 	//console.log(`child process close all stdio with code ${code}`);
	//console.log(dataToSend)
	//console.log(typeof(dataToSend))
 	
	let ScrapperArray = dataToSend.match(/{(\n|.)*?}/gm)
	let IngredientList = dataToSend.match(/\['(\n|.)*?'\]/gm)
	
	Ingredients = String(IngredientList).match(/'(\n|.)*?'/gm)
	
	let IngredientString=""
	//console.log(typeof(Ingredients))
	//console.log(Ingredients)


	//console.log(typeof(ScrapperArray))
	//console.log(typeof(Ingredients))
	if (Ingredients== null || ScrapperArray== null) {

	return res.status(417).send('<h1>404 Recipe Scrapper Retrived Nothing</h1>')
	}else{
	for (var i = 0; i < Ingredients.length; i++)
	{
	//console.log(Ingredients)
	Ingredients[i]= "{"+Ingredients[i]+"}"
	//console.log(Ingredients)
	Ingredients[i]= Ingredients[i].replace(/\'/g,'')
	//console.log(Ingredients)
	IngredientString += Ingredients[i]
	
	}
	//console.log(IngredientString)
	for (var i = 0; i < ScrapperArray.length; i++)
	{
	
	ScrapperArray[i]= ScrapperArray[i].replace('{','')
	ScrapperArray[i]= ScrapperArray[i].replace('}','')
	
	}

db.run('INSERT INTO Recipe(recipe_name, recipe_url, recipe_notes, recipe_ingredients, recipe_instructions, date, cuisine_id, course_id, diet_id, method_id, effort_id, image_id) VALUES(?,?,"-",?,?,?,"1","1","1","1","1",NULL)', [ScrapperArray[0], req.body.xURL, IngredientString, ScrapperArray[2], ScrapperArray[1]], (err) => {

	if(err) {
	return console.log(err.message); 
	}
	//console.log("Inserted");
	})// SQL insert

	sqlRecipeID = 'SELECT Recipe.recipe_id FROM Recipe WHERE Recipe.recipe_url = ?'
	db.get(sqlRecipeID,[req.body.xURL], (err, rows) => {
	if(err) {
	console.log(err)
	}
	//console.log(rows)
	res.redirect('/Recipes/'+rows.recipe_id+'/edit');
	});
	// send data to browser
	//res.send(dataToSend)

	}// IF scrapper data not NULL
	}//IF code!=0
	});//python close event
}

const Feedback = (req,res) => {
	res.render("Feedback")

}

const SubmitFeedback = (req,res) => {
	console.log(req.body.name)


	db.run('INSERT INTO Feedback(feedback_text) VALUES(?)', [req.body.text], (err) => {
	if(err) {
	return console.log(err.message); 
	}
	console.log(req.body.text);
})

return res.render("Received")
	
}
module.exports = {AllRecipes, RecipeDetails, EditRecipe, PublishEdit, NewRecipeForm, CreateRecipe, Feedback, SubmitFeedback}

