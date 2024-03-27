const express = require('express');
const { auth } = require('../middleware/auth.middleware');
const { access } = require('../middleware/access.middleware');
const { UserModel } = require('../models/user.models');

const employeeRouter = express.Router();

// Add an employee (Admin only)
employeeRouter.post('/add', auth, access(["Admin"]), async (req, res) => {
    const { name, lastname,email, salary } = req.body;
    try {
        const user = new UserModel({ name, lastname, email, salary });
        await user.save();
        res.status(200).json({ msg: "Employee added successfully", user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Delete an employee (Admin only)
employeeRouter.delete('/delete/:id', auth, access(["Admin"]), async (req, res) => {
    const { id } = req.params;
    try {
        await UserModel.findByIdAndDelete(id);
        res.status(200).json({ msg: "Employee deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update an employee (Admin only)
employeeRouter.patch('/update/:id', auth, access(["Admin"]), async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    try {
        await UserModel.findByIdAndUpdate(id, payload);
        res.status(200).json({ msg: "Employee updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get all employees (Admin only)
employeeRouter.get('/all', auth, access(["Admin"]), async (req, res) => {
    try {
        const employees = await UserModel.find({ role: "User" }); 
        res.status(200).json({ employees });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = {
    employeeRouter,
};