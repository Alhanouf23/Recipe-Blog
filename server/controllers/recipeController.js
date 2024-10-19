require('../models/databaes');
const Category=require('../models/Category');
const Recipe=require('../models/Recipe');
// Get/
//homepage
exports.homepage = async(req, res)=> {

        try {
            const limitNumber=5;
            const categories= await Category.find({}).limit(limitNumber);
            const latest=await Recipe.find({}).ssart({_id:-1}).limit(limitNumber);
              const thai = await Recipe.find({ 'category': 'Thai' }).limit(limitNumber);
                const american = await Recipe.find({ 'category': 'American' }).limit(limitNumber);
                const chinese = await Recipe.find({ 'category': 'Chinese' }).limit(limitNumber);

                const food = { latest, thai, american, chinese };


            res.render('index', { title: 'Cooking Blog - Home', categories,food });
        } catch (error) {
          res.satus(500).send({message:error.massage || "Error Occured"});  
        }
}
// Get/categories
//Categories
exports.exploraCategories = async(req, res)=> {

  try {
      const limitNumber=20;
      const categories= await Category.find({}).limit(limitNumber);
      res.render('categories', { title: 'Cooking Blog - Home', Categories });
  } catch (error) {
    res.satus(500).send({message:error.massage || "Error Occured"});  
  }
}

/**
 * GET /recipe/:id
 * Recipe 
*/
exports.exploreRecipe = async(req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    res.render('recipe', { title: 'Cooking Blog - Recipe', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 





// async function insertDymmyCategoryData(){
//   try {
//     await Category.insertMany([
//       {
//         "name": "Thai",
//         "image": "thai-food.jpg"
//       },
//       {
//         "name": "American",
//         "image": "american-food.jpg"
//       }, 
//       {
//         "name": "Chinese",
//         "image": "chinese-food.jpg"
//       },
//       {
//         "name": "Mexican",
//         "image": "mexican-food.jpg"
//       }, 
//       {
//         "name": "Indian",
//         "image": "indian-food.jpg"
//       },
//       {
//         "name": "Spanish",
//         "image": "spanish-food.jpg"
//       }
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmyCategoryData();


  // async function insertDymmyRecipeData(){
  //   try {
  //     await Recipe.insertMany([
  //       { 
  //         "name": "Recipe Name Goes Here",
  //         "description": `Recipe Description Goes Here`,
  //         "email": "recipeemail@raddy.co.uk",
  //         "ingredients": [
  //           "1 level teaspoon baking powder",
  //           "1 level teaspoon cayenne pepper",
  //           "1 level teaspoon hot smoked paprika",
  //         ],
  //         "category": "American", 
  //         "image": "southern-friend-chicken.jpg"
  //       },
  //       { 
  //         "name": "Recipe Name Goes Here",
  //         "description": `Recipe Description Goes Here`,
  //         "email": "recipeemail@raddy.co.uk",
  //         "ingredients": [
  //           "1 level teaspoon baking powder",
  //           "1 level teaspoon cayenne pepper",
  //           "1 level teaspoon hot smoked paprika",
  //         ],
  //         "category": "American", 
  //         "image": "southern-friend-chicken.jpg"
  //       },
  //     ]);
  //   } catch (error) {
  //     console.log('err', + error)
  //   }
  // }

  // insertDymmyRecipeData();

