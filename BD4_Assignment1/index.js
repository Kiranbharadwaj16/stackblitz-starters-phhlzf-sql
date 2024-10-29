const express = require('express');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const cors = require('cors');

const app = express();
app.use(cors());
const port = 3000;

let db;

(async () => {
  db = await open({
    filename: './BD4_Assignment1/database.sqlite',
    driver: sqlite3.Database,
  });
})();

async function fetchAllRestaurants(){
  let query = "SELECT * FROM restaurants";
  let response = await db.all(query, []);
  return { restaurants : response };
}
app.get("/restaurants", async (req, res) =>{
  try{
    const results = await fetchAllRestaurants();
    if(results.restaurants.length === 0){
      return res.status(404).json({ message : "No restaurants found "});
    }
    return res.status(200).json(results);
  }catch(error){
    return res.status(500).json({ error : error.message });
  }
});

async function getRestaurantById(id){
  let query = "SELECT * FROM restaurants WHERE id = ?";
  let response = await db.all(query, [id]);
  return { restaurants : response };
}


app.get("/restaurants/details/:id", async (req, res) =>{
  const id = parseInt(req.params.id);
  try{
    const results = await getRestaurantById(id);
    if(results.restaurants.length === 0){
      return res.status(404).json({ message : "No ID matches "});
    }
    return res.status(200).json(results);
  }catch(error){
    return res.status(500).json({ error : error.message});
  }
});


async function getRestaurantsByCuisine(cuisine){
  let query = "SELECT * FROM restaurants WHERE cuisine = ?";
  let response = await db.all(query, [cuisine]);
  return { restaurants : response };
}
app.get("/restaurants/cuisine/:cuisine", async (req, res) =>{
  const cuisine = req.params.cuisine;
  try{
    const results = await getRestaurantsByCuisine(cuisine);
    if(results.restaurants.length === 0){
      return res.status(404).json({ message : "No restaurants found with the specified cuisine. "});
    }
    return res.status(200).json(results);
  }catch (error){
    return res.json(500).josn({ error : error.message });
  }
});


async function  getRestaurantsByFilter(isVeg, hasOutdoorSeating, isLuxury){
  let query = "SELECT * FROM restaurants WHERE isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?";
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return { restaurants : response };
}
app.get("/restaurants/filter", async (req, res) =>{
  const isVeg = req.query.isVeg;
  const hasOutdoorSeating = req.query.hasOutdoorSeating;
  const isLuxury = req.query.isLuxury;
  try {
    const results = await getRestaurantsByFilter(isVeg, hasOutdoorSeating, isLuxury);
    if(results.restaurants.length === 0){
      return res.status(404).json({ message : "No restaurants match the specified filters."});
    }
    return res.status(200).json(results)
  }catch(error){
    return res.status(500).json({ error : error.message });
  }
});


async function getRestaurantsSortedByRating(){
  let query = "SELECT * FROM restaurants ORDER BY rating DESC";
  let response = await db.all(query, []);
  return { restaurants : response };
}
app.get("/restaurants/sort-by-rating", async (req, res) =>{
  try{
    const results = await getRestaurantsSortedByRating();
    if(results.restaurants.length === 0){
      return res.status(404).json({ message : "No restaurants found."});
    }
    return res.status(200).json(results);
  }catch(error){
    return res.status(500).json({ message : error.message });
  }
});


async function getAllDishes(){
  let query = "SELECT * FROM dishes";
  let response = await db.all(query, []);
  return { dishes : response }
}
app.get("/dishes", async (req, res) =>{
  try{
    const results = await getAllDishes();
    if(results.dishes.length === 0){
      return res.status(404).json({ message : "No dishes found."});
    }
    return res.status(200).json(results);
  }catch (error){
    return res.status(500).json({ error : error.message});
  }
});


async function  getDishById(id){
  let query = "SELECT * FROM dishes WHERE id = ?";
  let response = await db.all(query, [id]);
  return { dishes : response };
}
app.get("/dishes/details/:id", async (req, res) =>{
  const id = req.params.id;
  try{
    const results = await getDishById(id);
    if(results.dishes.length === 0){
      return res.status(404).json({ message : "Dish not found"})
    }
    return res.status(200).json(results)
  }catch(error){
    return res.status(500).json({error : error.message });
  }
});


async function getDishesByFilter(isVeg) {
  let query = "SELECT * FROM dishes WHERE isVeg = ?";
  let response = await db.all(query, [isVeg]);
  return { dishes: response };
}
app.get("/dishes/filter", async (req, res) => {
  const isVeg = req.query.isVeg;
  try {
    let results = await getDishesByFilter(isVeg);
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: "No dishes match the specified filter." });
    }
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


async function getDishesSortedByPrice(){
  let query = "SELECt * FROM dishes ORDER BY price ASC";
  let response = await db.all(query, []);
  return { dishes : response };
}
app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    const dishes = await getDishesSortedByPrice();
    if (dishes.length === 0) {
      return res.status(404).json({ message: "No dishes found." });
    }
    return res.status(200).json({ dishes });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});





app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
