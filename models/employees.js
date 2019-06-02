const mongoose = require('mongoose');

//the model data set needed and the correspoding collection
const employeeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id: Number,
    employee_name: String,
    employee_salary: String,
    employee_age: Number,
},{ collection : 'employees' });

module.exports = mongoose.model('employees', employeeSchema);