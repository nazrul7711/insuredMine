let express = require("express");
let app = express();
let mongoose = require("mongoose");
const csv = require("csvtojson");
const postModel = require("./models/postModel");
const router = require("./routes/route");

//to add middleware to read json and url data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//connecting mongoose
mongoose
  .connect(
    "mongodb+srv://functionUp:UMZjiD9cN8Lb7RYo@cluster0.wew6u.mongodb.net/insuredMine",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => {
    console.log("mongo db connected");
  });


//mounting router
app.use("/", router);

//read csv file into our database
csv()
.fromFile("./data/data-sheet.csv")
.then(csvData=>
    postModel.insertMany(csvData).then(()=>{
      console.log("data inserted")
    }).catch((error)=>{
      console.log(error)
    })
  )

app.listen(3000, () => {
  console.log("listening on port 3000");
});
