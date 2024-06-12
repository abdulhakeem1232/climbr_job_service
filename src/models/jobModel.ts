import mongoose, { Document, Schema } from "mongoose";

export interface Applicant {
    userId: string;
    name: string;
    email: string;
    mobile: string;
    cvPath: string;
    status: string;
}
export interface JOB extends Document {
    jobrole: string;
    companyname: string;
    minexperience: string;
    maxexperience: string;
    minsalary: string;
    maxsalary: string;
    category: string;
    joblocation: string;
    emptype: string
    skills: string[];
    description: string;
    image: string;
    applicants: Applicant[];
    recruiterId: mongoose.Types.ObjectId;
    isDeleted: boolean;
    createdAt: Date;
}

const JobSchema: Schema<JOB> = new Schema({
    jobrole: {
        type: String,
        required: true
    },
    companyname: {
        type: String,
    },
    minexperience: {
        type: String,
        required: true
    },
    maxexperience: {
        type: String,
        required: true

    },
    minsalary: {
        type: String,
        required: true
    },
    maxsalary: {
        type: String,
        required: true
    },
    joblocation: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    emptype: {
        type: String,
        required: true,
    },
    skills: [{
        type: String,
        required: false
    }],
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    applicants: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        name: {
            type: String,
        },
        email: {
            type: String
        },
        mobile: {
            type: String
        },
        cv: {
            type: String,
        },
        status: {
            type: String,
        }
    }],
    recruiterId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdAt: { type: Date, default: Date.now }
})

const JobModel = mongoose.model<JOB>("Jobs", JobSchema);

export default JobModel;
