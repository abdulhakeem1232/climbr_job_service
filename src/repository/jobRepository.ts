import JobModel from "../models/jobModel";
export interface UserData {
    jobid: string;
    userId: string;
    name: string;
    email: string;
    mobile: string;
    cv: string;
}


export const jobRepositiory = {
    createJob: async (data: any, image: string) => {
        try {
            console.log(data, image, 'rep');
            let skills = data.RequiredSkills.includes(',') ? data.RequiredSkills.split(',') : data.RequiredSkills
            const job = await JobModel.create({
                jobrole: data.jobtitle,
                companyname: data.CompanyName,
                minexperience: data.MinExperienceLevel,
                maxexperience: data.MaxExperienceLevel,
                minsalary: data.Minimumsalary,
                maxsalary: data.Maximumsalary,
                joblocation: data.joblocation,
                emptype: data.EmploymentType,
                skills: skills,
                description: data.Description,
                image: image,
                recruiterId: data.userId,
            })
            return true
        } catch (err) {
            console.error(`Error creating job: ${err}`);
            return null;
        }
    },
    getjobs: async (userId: string) => {
        try {
            let jobs = await JobModel.find({ recruiterId: userId })
            console.log(jobs);
            let response = { jobs: jobs || [] }
            return response
        } catch (err) {
            console.error(`Error creating job: ${err}`);
            return null;
        }
    },
    getalljobs: async () => {
        try {
            let jobs = await JobModel.find().sort({ createdAt: -1 })
            console.log(jobs);
            let response = { jobs: jobs || [] }
            return response
        } catch (err) {
            console.error(`Error creating job: ${err}`);
            return null;
        }
    },
    getsinglejobs: async (id: string) => {
        try {
            let job = await JobModel.find({ _id: id })
            console.log(job);
            let response: any = job[0] || {}
            console.log('res00000', response);

            return response
        } catch (err) {
            console.error(`Error creating job: ${err}`);
            return null;
        }
    },
    saveApllicants: async (data: UserData) => {
        try {
            if (!data) {
                throw new Error('Data is required to save applicants.');
            }
            const applicant = {
                userId: data.userId,

                name: data.name,
                email: data.email,
                mobile: data.mobile,
                cv: data.cv
            };
            let job = await JobModel.findOne({ _id: data.jobid })
            let response = await JobModel.updateOne({ _id: data.jobid }, { $addToSet: { applicants: applicant } })
            console.log(response, data, 'repo00000', job);

            if (response.modifiedCount == 0) {
                throw new Error('No documents were matched or modified during update operation.');
            }
            return true

        } catch (err) {
            console.error('Error while saving Applicants:', err)
            throw err
        }
    },
}
