import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { jobRepositiory } from "../repository/jobRepository";
import Tesseract from 'tesseract.js'
import { PDFImage } from 'pdf-image'
import dotenv from 'dotenv'
import crypto from 'crypto'
import sharp from 'sharp'
import pdfParse from 'pdf-parse';



dotenv.config()
const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')
const access_key = process.env.ACCESS_KEY
const secret_access_key = process.env.SECRET_ACCESS_KEY
const bucket_region = process.env.BUCKET_REGION
const bucket_name = process.env.BUCKET_NAME





const s3: S3Client = new S3Client({
    credentials: {
        accessKeyId: access_key || '',
        secretAccessKey: secret_access_key || ''
    },
    region: process.env.BUCKET_REGION
});

export const jobServices = {
    creatingJob: async (data: any) => {
        try {
            const image = randomImageName()
            const buffer = await sharp(data.companylogo.buffer).resize({ height: 1080, width: 1920, fit: "cover" }).toBuffer()
            const params = {
                Bucket: bucket_name,
                Key: image,
                Body: buffer,
                ContetType: data.companylogo.mimetype,
            }
            const command = new PutObjectCommand(params)
            await s3.send(command);
            let response = await jobRepositiory.createJob(data, image)
            return response
        } catch (err) {
            console.error(`Error jobs: ${err}`);
            return null;
        }
    },
    getJob: async (userId: string) => {
        try {
            let data = await jobRepositiory.getjobs(userId)
            if (data) {
                const { jobs } = data
                for (let job of jobs) {
                    console.log('op', job._id);
                    const updatedApplicants = await Promise.all(job.applicants.map(async (user: any) => {
                        console.log(user, 'user00000000---0000');

                        const getObjectParams = {
                            Bucket: bucket_name,
                            Key: user.cv,
                        }

                        const getObjectCommand = new GetObjectCommand(getObjectParams);
                        const url = await getSignedUrl(s3, getObjectCommand, { expiresIn: 3600 });
                        console.log(url, 'rererere');
                        user.cv = url
                        return user
                    }))
                    job.applicants = updatedApplicants
                }
            }

            return data
        } catch (err) {
            console.error(`Error finding job: ${err}`);
            return null;
        }
    },
    getallJob: async () => {
        try {
            let jobs = await jobRepositiory.getalljobs()
            console.log(jobs, 'service');
            if (jobs?.jobs) {
                for (let job of jobs?.jobs) {
                    const getObjectParams = {
                        Bucket: bucket_name,
                        Key: job.image,
                    }
                    const getObjectCommand = new GetObjectCommand(getObjectParams);
                    const url = await getSignedUrl(s3, getObjectCommand, { expiresIn: 3600 });
                    job.image = url
                    console.log(url);
                }
            }
            return jobs
        } catch (err) {
            console.error(`Error jobs: ${err}`);
            return null;
        }
    },
    getsingleJob: async (id: string) => {
        try {
            let jobs = await jobRepositiory.getsinglejobs(id)
            console.log(jobs, 'service');
            return jobs
        } catch (err) {
            console.error(`Error jobs: ${err}`);
            return null;
        }
    },
    applyjob: async (UserData: any) => {
        try {
            const name = randomImageName()
            const params = {
                Bucket: bucket_name,
                Key: name,
                Body: UserData.cv.buffer,
                ContetType: UserData.cv.mimetype,
            }
            const pdfData = await pdfParse(UserData.cv.buffer);
            const Result = await jobRepositiory.getSkills(UserData.jobid);
            if (Result && Array.isArray(Result.skills)) {
                const totalRequiredSkills = Result.skills.length;
                const matchedSkills = Result.skills.map((skill: string) =>
                    pdfData.text.includes(skill)
                );
                const numMatchedSkills = matchedSkills.filter((matched: any) => matched).length;
                const percentMatch = (numMatchedSkills / totalRequiredSkills) * 100;
                console.log(`Percent Skill Match: ${percentMatch}%`);
                percentMatch > 70 ? UserData.status = 'applied' : 'rejecetd'
            }
            const command = new PutObjectCommand(params)
            await s3.send(command);
            UserData.cv = name
            let response = await jobRepositiory.saveApllicants(UserData)
            return response


        } catch (err) {
            console.error('Error while saving Applicants:', err)
            throw err
        }
    },
    deleteJob: async (postId: string) => {
        try {
            let response = await jobRepositiory.deleteJob(postId)
            return response
        } catch (err) {
            console.error('Error while deleteing job post:', err)
            throw err
        }
    },
    updatejob: async (data: any) => {
        try {
            let response = await jobRepositiory.updatejobJob(data)
            return response
        } catch (err) {
            console.error('Error while deleteing job post:', err)
            throw err
        }
    },
}
