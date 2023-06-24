const mongodb = require('mongodb').MongoClient;
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');


require('dotenv').config();

const app = express();
const port = process.env.PORT || 3003;

// Parse JSON bodies
app.use(bodyParser.json());

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


app.set('view engine', 'ejs'); // Set EJS as the template engine
app.set('views', path.join(__dirname, 'views')); // Set the views directory

app.get('/list', (req, res) => {
    const url = process.env.MONGODB_URL;

    mongodb.connect(url)
        .then(async con => {
            const db = con.db();

            // Get the collection and find all students
            const collection = db.collection('student');
            const students = await collection.find().toArray();

            res.render('list', { students }); // Render the list.ejs template and pass the students data

        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).send('An error occurred');
        });
});

/*
app.get('/list', (req, res) => {
  const url = process.env.MONGODB_URL;

  mongodb.connect(url)
    .then(async con => {
      const db = con.db();

      // Get the collection and find all students
      const collection = db.collection('student');
      const students = await collection.find().toArray();

      res.send(students);
    })
    .catch(error => {
      console.error('Error:', error);
      res.status(500).send('An error occurred');
    });
});

*/




app.post('/addstudent', async (req, res) => {
  try {
    const url = process.env.MONGODB_URL;

    // Extract student information from the request body
    const { name, age, aclass } = req.body;

    if (!name || !age || !aclass) {
      return res.status(400).send('Required fields are missing');
    }

    const client = await mongodb.connect(url);
    const db = client.db();
    const collection = db.collection('student');

    const newStudent = {
      name,
      age,
      aclass,
      createdAt: new Date()
    };

    await collection.insertOne(newStudent);

    res.send('Student inserted successfully!');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
