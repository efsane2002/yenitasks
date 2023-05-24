const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const crypto = require("crypto");
const mongoose = require("mongoose");
const app = express();
app.use(cors());
dotenv.config();
app.use(bodyParser.json());

const RoboticSchema = new mongoose.Schema({
    name: String,
    paragraf: String,
    imageURL: String,
  });
  const RoboticModel = new mongoose.model("Robotics", RoboticSchema);
 
 

  app.get("/api", (req, res) => {
  res.send("welcome to out API!");
});


app.get("/api/new", async (req, res) => {
  const { name } = req.query;
  const robotics = await RoboticModel.find();
  if (!name) {
    res.status(200).send(robotics);
  } else {
    const searchedRobotics = robotics.filter((x) =>
      x.name.toLowerCase().trim().includes(name.toLowerCase().trim())
    );
    res.status(200).send(searchedRobotics);
  }
});
app.get("/api/new/:id", async(req, res) => {
  const { id } = req.params;
  const robotic = await RoboticModel.findById(id)
  res.status(200).send(robotic);
});
app.delete("/api/new/:id",async(req, res) => {
  const id = req.params.id;
  const deleteRobotic = await RoboticModel.findByIdAndDelete(id);
  res.status(203).send({
    message: `${deleteRobotic.name} deleted successfully!`,
  });
});
app.post("/api/new", async (req, res) => {
  const { name, paragraf, imageURL } = req.body;
  const newRobotic = new RoboticModel({
    name: name,
    paragraf: paragraf,
    imageURL: imageURL,
  });
  await newRobotic.save();
  res.status(201).send({
    message: `${newRobotic.name} posted successfully`,
    payload: newRobotic,
  });
});
app.put("/api/new/:id", async(req, res) => {
  const id = req.params.id;
  const { name, paragraf, imageURL } = req.body;
  const updatingRobotic = {name:name, paragraf:paragraf,imageURL:imageURL};
  await RoboticModel.findByIdAndUpdate(id,updatingRobotic);
  res.status(200).send(`${updatingRobotic.name} updated successfully!`);
});



PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`App running on PORT: ${PORT}`);
});

DB_PASSWORD = process.env.DB_PASSWORD;
DB_CONNECTION = process.env.DB_CONNECTION;

mongoose.connect(DB_CONNECTION.replace("<password>", DB_PASSWORD)).then(() => {
  console.log("Mongo DB connected!");
});