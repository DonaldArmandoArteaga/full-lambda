import * as cdk from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import {
  SnsEventSource,
  SqsEventSource,
} from "aws-cdk-lib/aws-lambda-event-sources";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Topic } from "aws-cdk-lib/aws-sns";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

export class LambdaStack extends cdk.Stack {
  private readonly restMethods: Array<string> = [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
  ];

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const queue = new Queue(this, "sqs-queue-lambda-crud", {
      queueName: "sqs-queue-lambda-crud",
    });

    const topic = new Topic(this, "sns-topic-lambda-crud", {
      topicName: "sns-topic-lambda-crud",
    });

    const lambdaCRUD = new NodejsFunction(this, "lambda-crud", {
      runtime: Runtime.NODEJS_18_X,
      entry: "./lib/lambda/lambda-crud.ts",
      functionName: "lambda-crud-nodejs-18x",
      memorySize: 512,
    });

    lambdaCRUD.addEventSource(new SqsEventSource(queue));
    lambdaCRUD.addEventSource(new SnsEventSource(topic));

    const restAPI = new RestApi(this, "api", {
      description: "example api gateway",
      deployOptions: {
        stageName: "prod",
      },
      defaultCorsPreflightOptions: {
        allowHeaders: ["Content-Type"],
        allowMethods: this.restMethods,
        allowCredentials: true,
        allowOrigins: ["*"],
      },
    });

    const personPath = restAPI.root.addResource("persons");
    this.restMethods.forEach((verb) => {
      personPath.addMethod(verb, new LambdaIntegration(lambdaCRUD));
    });

    new cdk.CfnOutput(this, "Rest API Url", { value: restAPI.url });
  }
}
