import JobModel from "../models/jobModel";
export interface UserData {
    jobid: string;
    userId: string;
    name: string;
    email: string;
    mobile: string;
    cv: string;
    status?: string;
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
            return { success: true, message: 'Job created successfully' }
        } catch (err) {
            console.error(`Error creating job: ${err}`);
            return null;
        }
    },
    getjobs: async (userId: string) => {
        try {
            let jobs = await JobModel.find({ recruiterId: userId, isDeleted: { $ne: true } })
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
            let jobs = await JobModel.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 })
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
                cv: data.cv,
                status: data.cv
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
    deleteJob: async (postId: string) => {
        try {
            let deletedJob = await JobModel.updateOne({ _id: postId }, { $set: { isDeleted: true } });
            if (deletedJob.modifiedCount > 0) {

                return { success: true, message: 'Job deleted successfully' };
            } else {
                return { success: false, message: 'Job not found' };
            }
        } catch (err) {
            console.error('Error while delete job:', err)
            throw err
        }
    },
    updatejobJob: async (data: any) => {
        try {
            let skills = data.RequiredSkills.includes(',') ? data.RequiredSkills.split(',') : data.RequiredSkills
            let response = await JobModel.updateOne({ _id: data.id }, {
                $set: {
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
                    recruiterId: data.userId,
                }
            });
            console.log(response, '0000000');

            if (response.modifiedCount > 0) {
                return { success: true, message: 'Job updated successfully' };
            } else {
                return { success: false, message: 'No job was updated' };
            }

        } catch (err) {
            console.error('Error while delete job:', err)
            throw err
        }
    },
    getSkills: async (jobid: string) => {
        try {
            let skills = await JobModel.findOne({ _id: jobid }, { skills: 1 })
            return skills
        }
        catch (err) {
            console.error('Error while skilld from job:', err)
            throw err
        }
    },
    getChartDetails: async (currentYear: number, month: number) => {
        try {
            const userStats = await JobModel.aggregate([
                {
                    $match: {
                        $expr: {
                            $eq: [{ $year: "$createdAt" }, currentYear]
                        },
                        isDeleted: {
                            $ne: true
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            month: { $month: "$createdAt" },
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: {
                        "_id.month": 1
                    }
                },
                {
                    $project: {
                        _id: 0,
                        month: "$_id.month",
                        count: 1
                    }
                }

            ])
            const result = Array.from({ length: month + 1 }, (_, i) => ({
                month: i + 1,
                count: 0
            }));
            userStats.forEach(stat => {
                const index = result.findIndex(r => r.month == stat.month);
                if (index !== -1) {
                    result[index].count = stat.count;
                }
            });
            let count = await JobModel.find({ isDeleted: { $ne: true } }).countDocuments();
            return { result, count }
        } catch (err) {
            console.error(`Error fetching chart: ${err}`);
            return null;
        }
    },
}
