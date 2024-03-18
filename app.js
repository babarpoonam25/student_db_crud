// Connect to MongoDB
const express = require("express");
const mongoose = require("mongoose");
const app = express();

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/Student_data", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const StudentSchema = new mongoose.Schema({
  name: String,
  age: Number,
});

// Create a mongoose model based on the schema
const Student = mongoose.model("Student", StudentSchema);

// Middleware to parse JSON bodies
app.use(express.json());

// API Endpoint to create an employee
app.post("/api/student_table", async (req, res) => {
  try {
    const { name, age } = req.body;
    const newStudent = new Student({ name, age });
    await newStudent.save();
    res.json(newStudent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// API Endpoint to get all employees
app.get("/api/student_table", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// API endpoints to upsate the Data
app.put("/api/student_table/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    const student = await Student.findById(id);
    if (!student) {
      console.error("Student not found for ID:", id);
      return res.status(404).send("Student not found");
    }
    Object.assign(student, updateData);
    await student.save();
    return res.send("Student update successfully");
  } catch (error) {
    return error;
  }
});

// API endpoints to Delete the Data
app.delete("/api/student_table/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deletedStudent = await Student.findByIdAndDelete(id);
    // Check if the student exists
    if (!deletedStudent) {
      console.error("Student not found for ID:", id);
      return res.status(404).send("Student not found");
    }
    // Send success response
    return res.send("Student deleted successfully");
  } catch (error) {
    return error;
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
