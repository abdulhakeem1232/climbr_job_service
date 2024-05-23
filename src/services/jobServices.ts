import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { jobRepositiory } from "../repository/jobRepository";
import dotenv from 'dotenv'
import crypto from 'crypto'
import sharp from 'sharp'
import { UserData } from "../repository/jobRepository";

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
            let jobs = await jobRepositiory.getjobs(userId)
            console.log(jobs, 'service');

            return jobs
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
}
