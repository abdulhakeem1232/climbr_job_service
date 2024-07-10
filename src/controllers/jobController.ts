import { jobServices } from "../services/jobServices";

export const jobController = {
    createjob: async (call: any, callback: any) => {
        try {
            console.log('call', call.request);
            const data = call.request
            let response = await jobServices.creatingJob(data)
            callback(null, response)
        } catch (err) {
            callback(err);
        }
    },
    getjob: async (call: any, callback: any) => {
        try {
            const UserId = call.request.userId;
            let jobs = await jobServices.getJob(UserId)
            // console.log('hoo', jobs);
            callback(null, jobs)
        } catch (err) {
            callback(err);
        }
    },
    getalljob: async (call: any, callback: any) => {
        try {
            console.log('all--------------');

            let jobs = await jobServices.getallJob()
            console.log('hoo', jobs);

            callback(null, jobs)
        } catch (err) {
            callback(err);
        }
    },
    getsinglejob: async (call: any, callback: any) => {
        try {
            const id = call.request.id

            let jobs = await jobServices.getsingleJob(id)
            console.log('hoo', jobs);

            callback(null, jobs)
        } catch (err) {
            callback(err);
        }
    },
    applyjob: async (call: any, callback: any) => {
        try {
            console.log('----', call.request);
            const userData = {
                jobid: call.request.jobid,
                userId: call.request.userid,
                name: call.request.username,
                email: call.request.email,
                mobile: call.request.mobile,
                cv: call.request.cv,
            }
            let response = await jobServices.applyjob(userData)
            // callback(null, response)
        } catch (err) {
            callback(err);
        }
    },
    deleteJob: async (call: any, callback: any) => {
        try {
            const { postId } = call.request;
            let response = await jobServices.deleteJob(postId)
            callback(null, response)
        } catch (err) {
            callback(err);
        }
    },
    updateJob: async (call: any, callback: any) => {
        try {
            console.log(call.request);
            const data = call.request
            let response = await jobServices.updatejob(data)
            callback(null, response)
        } catch (err) {
            callback(err);
        }
    },
    getChartData: async (call: any, callback: any) => {
        try {
            const currentYear = new Date().getFullYear()
            const month = new Date().getMonth()
            let response = await jobServices.getChartDetails(currentYear, month)
            callback(null, response)
        } catch (err) {
            callback(err)
        }
    },
    getApplicantsChartData:
        async (call: any, callback: any) => {
            try {
                const currentYear = new Date().getFullYear()
                const month = new Date().getMonth()
                const { userId } = call.request
                let response = await jobServices.getApplicantsChartDetails(currentYear, month, userId)
                callback(null, response)
            } catch (err) {
                callback(err)
            }
        },
    getApplicants: async (call: any, callback: any) => {
        try {
            const { id } = call.request
            let response = await jobServices.getApplicants(id)
            callback(null, response)
        } catch (err) {
            callback(err)
        }
    },
    statusUpdate: async (call: any, callback: any) => {
        try {
            const { jobId, userId, status } = call.request
            let response = await jobServices.updateStatus(jobId, userId, status)
            callback(null, response)
        } catch (err) {
            callback(err)
        }
    },

}
