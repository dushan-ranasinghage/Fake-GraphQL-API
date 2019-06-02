const express = require('express');
const express_graphql = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

//GraphQL Schema
const schema = buildSchema(`
    type Query {
        employee(id: String!): Employee
        employees(title: String): [Employee]
    }
    type Employee {
        id: String
        employee_name: String
        employee_salary: String
    }
`);

//Variables load from .env (dotenv) otherwise variables will be undefined
if (process.env.NODE_ENV  !== 'production') {
    require('dotenv').config();
  }

const uri = process.env.MONGO_ATLAS_URI;

//Atlas connection
mongoose.connect(uri, { useNewUrlParser: true },function (err) {
    if (err) throw err;
    console.log('Successfully connected to the Mongo Atlas Cluster');
 });

 const EmployeeData = require('./models/employees')


async function getEmployee(args) {
    const id = args.id;
    return await EmployeeData.find().
        exec().
        then(docs => {
            return docs.filter(employee => {
                console.log(employee.id)
                return employee.id == id;
            })[0];
        }).
        catch(err => {
            console.log(err)
        })
}

const getEmployees = function(args) {
    EmployeeData.find().
        exec().
        then(docs => {
            if (args.title) {
                const title = args.title;
                return docs.filter(employee => employee.title === title);
            } else {
                return docs;
            }
        }).
        catch(err => {
            console.log(err)
        })
}

// const updateCourseTopic = function({id, topic}) {
//     coursesData.map(course => {
//         if (course.id === id) {
//             course.topic = topic;
//             return course;
//         }
//     });
//     return coursesData.filter(course => course.id === id)[0];
// }

//Root resolver
const root = {
    employee: getEmployee,
    employees: getEmployees,
    // updateCourseTopic: updateCourseTopic
};

const app = express();//Create an express server and a GraphQL endpoint

app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

module.exports = app;