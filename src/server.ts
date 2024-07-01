import dotenv from 'dotenv'
import path from 'path'
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { jobController } from './controllers/jobController';
import { connectDB } from './config/db';

dotenv.config()
connectDB()

const packageDefinition = protoLoader.loadSync(path.join(__dirname, "proto/jobProto.proto"))
const jobProto = grpc.loadPackageDefinition(packageDefinition) as any;

const server = new grpc.Server();

const grpcServer = () => {
    server.bindAsync(
        `0.0.0.0:${process.env.PORT}`,
        grpc.ServerCredentials.createInsecure(),
        (err, port) => {
            if (err) {
                console.log(err, "error happened grpc user service");
                return;
            }
            console.log("grpc job server started on port:", port);
        }
    );
};

server.addService(jobProto.JobServices.service, {
    CreateJob: jobController.createjob,
    GetJob: jobController.getjob,
    GetAllJob: jobController.getalljob,
    GetsingleJob: jobController.getsinglejob,
    ApplyJob: jobController.applyjob,
    DeleteJob: jobController.deleteJob,
    UpdateJob: jobController.updateJob,
    GetReports: jobController.getChartData,

})

grpcServer();
