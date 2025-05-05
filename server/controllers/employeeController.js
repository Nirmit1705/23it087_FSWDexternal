import asyncHandler from 'express-async-handler';
import Employee from '../models/employeeModel.js';
import { v2 as cloudinary } from 'cloudinary';

// @desc    Get all employees with pagination
// @route   GET /api/employees
// @access  Private
const getEmployees = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  
  const keyword = req.query.keyword
    ? {
        $or: [
          { firstName: { $regex: req.query.keyword, $options: 'i' } },
          { lastName: { $regex: req.query.keyword, $options: 'i' } },
          { email: { $regex: req.query.keyword, $options: 'i' } },
          { department: { $regex: req.query.keyword, $options: 'i' } },
          { position: { $regex: req.query.keyword, $options: 'i' } },
        ],
      }
    : {};

  const count = await Employee.countDocuments({ ...keyword });
  const employees = await Employee.find({ ...keyword })
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .sort({ createdAt: -1 });

  res.json({
    employees,
    page,
    pages: Math.ceil(count / pageSize),
    total: count
  });
});

// @desc    Get employee by ID
// @route   GET /api/employees/:id
// @access  Private
const getEmployeeById = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);

  if (employee) {
    res.json(employee);
  } else {
    res.status(404);
    throw new Error('Employee not found');
  }
});

// @desc    Create a new employee
// @route   POST /api/employees
// @access  Private
const createEmployee = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    employeeType,
    department,
    position,
    joinDate,
    salary,
    address,
    skills,
    education,
    emergencyContact
  } = req.body;

  // Check if employee already exists with the same email
  const employeeExists = await Employee.findOne({ email });

  if (employeeExists) {
    res.status(400);
    throw new Error('Employee with this email already exists');
  }

  let profilePicture = 'default-profile.jpg';

  // Handle profile picture if uploaded
  if (req.file) {
    profilePicture = req.file.path;
  }

  const employee = await Employee.create({
    firstName,
    lastName,
    email,
    phone,
    employeeType,
    department,
    position,
    joinDate,
    salary,
    profilePicture,
    address,
    skills: skills ? skills.split(',').map(skill => skill.trim()) : [],
    education: education ? JSON.parse(education) : [],
    emergencyContact: emergencyContact ? JSON.parse(emergencyContact) : {},
    createdBy: req.user._id
  });

  if (employee) {
    res.status(201).json(employee);
  } else {
    res.status(400);
    throw new Error('Invalid employee data');
  }
});

// @desc    Update an employee
// @route   PUT /api/employees/:id
// @access  Private
const updateEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    res.status(404);
    throw new Error('Employee not found');
  }

  // Handle profile picture update
  let profilePicture = employee.profilePicture;
  
  if (req.file) {
    // Delete the old image from Cloudinary if it's not the default image
    if (employee.profilePicture && employee.profilePicture !== 'default-profile.jpg') {
      try {
        const publicId = employee.profilePicture.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`employee_profiles/${publicId}`);
      } catch (error) {
        console.error('Error deleting old profile picture:', error);
      }
    }
    profilePicture = req.file.path;
  }

  // Update employee data
  const {
    firstName,
    lastName,
    email,
    phone,
    employeeType,
    department,
    position,
    joinDate,
    salary,
    address,
    skills,
    education,
    emergencyContact
  } = req.body;

  employee.firstName = firstName || employee.firstName;
  employee.lastName = lastName || employee.lastName;
  employee.email = email || employee.email;
  employee.phone = phone || employee.phone;
  employee.employeeType = employeeType || employee.employeeType;
  employee.department = department || employee.department;
  employee.position = position || employee.position;
  employee.joinDate = joinDate || employee.joinDate;
  employee.salary = salary || employee.salary;
  employee.profilePicture = profilePicture;
  
  if (address) {
    employee.address = {
      ...employee.address,
      ...JSON.parse(address)
    };
  }
  
  if (skills) {
    employee.skills = skills.split(',').map(skill => skill.trim());
  }
  
  if (education) {
    employee.education = JSON.parse(education);
  }
  
  if (emergencyContact) {
    employee.emergencyContact = JSON.parse(emergencyContact);
  }

  const updatedEmployee = await employee.save();
  res.json(updatedEmployee);
});

// @desc    Delete an employee
// @route   DELETE /api/employees/:id
// @access  Private/Admin
const deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);

  if (employee) {
    // Delete profile picture from Cloudinary if it's not the default
    if (employee.profilePicture && employee.profilePicture !== 'default-profile.jpg') {
      try {
        const publicId = employee.profilePicture.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`employee_profiles/${publicId}`);
      } catch (error) {
        console.error('Error deleting profile picture:', error);
      }
    }

    await Employee.deleteOne({ _id: employee._id });
    res.json({ message: 'Employee removed' });
  } else {
    res.status(404);
    throw new Error('Employee not found');
  }
});

// @desc    Search employees
// @route   GET /api/employees/search
// @access  Private
const searchEmployees = asyncHandler(async (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    res.status(400);
    throw new Error('Search query is required');
  }
  
  const employees = await Employee.find({
    $or: [
      { firstName: { $regex: query, $options: 'i' } },
      { lastName: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } },
      { department: { $regex: query, $options: 'i' } },
      { position: { $regex: query, $options: 'i' } }
    ]
  });
  
  res.json(employees);
});

export { 
  getEmployees, 
  getEmployeeById, 
  createEmployee, 
  updateEmployee, 
  deleteEmployee,
  searchEmployees
};
