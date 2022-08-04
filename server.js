
/*
          THERE MIGHT BE CASES IN NEWS IMAGE RENDERING AS--->
            ***NO IMAGE FOUND***
            THIS IS DUE TO API AS THOSE NEWS OBJECT DOESN'T HAVE IMAGES LINK IN THEM

*/




const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https = require("https");
const http=require("http");
require("dotenv").config();

const app=express();

app.set("view engine","ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// some VARIABLE declaration
// get date
const date=new Date();
// weather constants
let city="";
let weatherData=null;
// category details
let category="home";
const cat_array = ["home","technology","business","sports","entertainment","health"];
let newsData="";
// Routes----> "/"

app.get("/",(req,res)=>{
    category="home";    
    const userAgent = req.get('user-agent');
        const options = {
            host: 'api.mediastack.com',
            path: '/v1/news?languages=en&access_key='+process.env.API_NEWS, // put your own api id for mediastack api
            headers: {
                'User-Agent': userAgent
            }
        }
        http.get(options, function (response) {
            let data;
            response.on('data', function (chunk) {
                if (!data) {
                    data = chunk;
                }
                else {
                    data += chunk;
                }
            });
            response.on('end', function () {
                newsData = JSON.parse(data);
                res.render("main",{
                    news: newsData.data,
                    currentDate: date,
                    cityName: city,
                    weatherDetails: weatherData
                });            
            });   
        });        
});
//   weather api post route
app.post("/",function(req,res){
     city = req.body.citySearch;
    const weatherURL = "https://api.openweathermap.org/data/2.5/weather?q="+ city+"&appid="+process.env.API_WEATHER+"&units=metric"; //api id for openweathermap
    https.get(weatherURL,function(response){
        console.log(response.statusCode);
        response.on("data",(data)=>{
            weatherData = JSON.parse(data);
            if(category=="home"){
                res.redirect("/");
            }else{
                res.redirect("/"+category);
            }
            });
    });
});
// Routes---->Dynamic for category

app.get("/:category", function (req, res) {
    category = req.params.category.toLowerCase();    
    const isCategory = cat_array.includes(category);
    if(isCategory){
    if(category=="home"){
        res.redirect("/");
    } else {
        const userAgent = req.get('user-agent');
        const options = {
            host: 'api.mediastack.com',
            path: '/v1/news?languages=en&access_key='+process.env.API_NEWS+'&categories='+category, //api id for media stack
            headers: {
                'User-Agent': userAgent
            }
        }
        http.get(options, function (response) {
            let data;
            response.on('data', function (chunk) {
                if (!data) {
                    data = chunk;
                }
                else {
                    data += chunk;
                }
            });
            response.on('end', function () {
                newsData = JSON.parse(data);
                // console.log(newsData);
                res.render("main",{
                    news: newsData.data,
                    currentDate: date,
                    cityName: city,
                    weatherDetails: weatherData
                }); 
            });
    
        });
        
    }}else{
        res.render("main",{
            news: null,
            currentDate: date,
            cityName: city,
            weatherDetails: weatherData
        });
    }
});


// Server port
app.listen(3000,()=>{
    console.log("server running at port 3000");
})





/// API id for news 4206ef900d0e4c61806950c387e7bfe4 