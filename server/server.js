const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { RelationShip, validate } = require("./models/relationship");
const { Person } = require("./models/person");

const app = express();

// const mongoURI = `mongodb://localhost:27017/app`;

const mongoURI = "mongodb+srv://student:student123@cluster0.7ogvi.mongodb.net/app?retryWrites=true&w=majority"

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("connection established with mongodb server online");
  })
  .catch((err) => {
    console.log("error while connection", err);
  });

app.use(express.json());
app.use(cors());

app.post("/addrelationship", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let first_person = await Person.find({ name: req.body.first_person });
  if (first_person == "") {
    first_person = new Person({
      name: req.body.first_person,
    });
    await first_person.save();
  } else {
    first_person = first_person[0];
  }

  let second_person = await Person.find({ name: req.body.second_person });
  if (second_person == "") {
    second_person = new Person({
      name: req.body.second_person,
    });

    await second_person.save();
  } else {
    second_person = second_person[0];
  }

  const relationExist = await RelationShip.find({
    first_person: first_person._id,
    second_person: second_person._id,
  });
  if (relationExist !== "") {
    const relationShip = new RelationShip({
      first_person: first_person._id,
      relation: req.body.relation,
      second_person: second_person._id,
    });

    await relationShip.save();

    res.send(relationShip);
  } else {
    const updatedRelation = await RelationShip.findByIdAndUpdate(
      relationExist[0]._id,
      { relation: req.body.relation },
      { new: true }
    );
    res.send(updatedRelation);
  }
});

app.get("/getdegreesofconnections", async (req, res) => {
  const relations = await RelationShip.find({
    first_person: req.query.first_person,
  }).populate("first_person second_person");
  let arr = [];
  if (relations != "") {
    relation = relations[0];
    arr.push(relation.first_person.name);
    while ((relation != "" ) && (relation.second_person._id != req.query.second_person)) {
      arr.push(relation.second_person.name);
      relation = await RelationShip.find({
        first_person: relation.second_person._id,
      }).populate("first_person second_person");
      relation = relation == ""? []: relation[0];
    }
    
    relation != "" ? arr.push(relation.second_person.name): arr = []
  }

  res.send(arr);
});

app.get("/persons", async (req, res) => {
  const persons = await Person.find();
  res.send(persons);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`listening at ${PORT}...`);
});
