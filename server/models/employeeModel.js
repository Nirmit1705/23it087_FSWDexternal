import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ],
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required']
    },
    employeeType: {
      type: String,
      required: [true, 'Employee type is required'],
      enum: ['Full-time', 'Part-time', 'Contract', 'Intern'],
      default: 'Full-time'
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true
    },
    joinDate: {
      type: Date,
      required: [true, 'Join date is required'],
      default: Date.now
    },
    salary: {
      type: Number,
      required: [true, 'Salary is required']
    },
    profilePicture: {
      type: String,
      default: 'default-profile.jpg'
    },
    address: {
      street: {
        type: String,
        required: [true, 'Street address is required']
      },
      city: {
        type: String,
        required: [true, 'City is required']
      },
      state: {
        type: String,
        required: [true, 'State is required']
      },
      zipCode: {
        type: String,
        required: [true, 'Zip code is required']
      },
      country: {
        type: String,
        required: [true, 'Country is required'],
        default: 'India'
      }
    },
    skills: [{
      type: String,
      trim: true
    }],
    education: [{
      degree: String,
      institution: String,
      year: Number
    }],
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Create index for search functionality
employeeSchema.index({ 
  firstName: 'text', 
  lastName: 'text', 
  email: 'text',
  department: 'text',
  position: 'text' 
});

// Virtual for employee's full name
employeeSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
