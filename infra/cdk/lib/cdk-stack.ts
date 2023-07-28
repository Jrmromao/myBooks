import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecr from "aws-cdk-lib/aws-ecr";
import {config} from "./config/configuration";
import * as cw from "aws-cdk-lib/aws-cloudwatch";
import * as ecs_patterns from "aws-cdk-lib/aws-ecs-patterns";
import {CfnOutput} from "aws-cdk-lib";

export class MyBooksStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        new ecr.Repository(this, `${config.appName}-container-repository`, {
            imageScanOnPush: true
        });

        const vpc = new ec2.Vpc(this, "MyVpc", {
            ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
            maxAzs: 2,
            natGateways: 1
        });

        const cluster = new ecs.Cluster(this, "MyCluster", {
            vpc: vpc
        });

        const ecs_alb = new ecs_patterns.ApplicationLoadBalancedFargateService(this, "MyFargateService", {
            cluster: cluster, // Required
            cpu: 512, // Default is 256
            desiredCount: 2, // Default is 1
            taskImageOptions: {image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample")},
            memoryLimitMiB: 2048, // Default is 512
            publicLoadBalancer: true // Default is true
        });


        new CfnOutput(this, `${config.appName}ECS_ALB_SERVICE`, {value: ecs_alb.service.serviceArn, exportName: ecs_alb.service.serviceName});
     }
}
