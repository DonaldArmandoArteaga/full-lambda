import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  SNSEvent,
  SQSEvent,
} from "aws-lambda";
import { IDataAccess } from "./database/IDataAccess";
import { DynamoDatabase } from "./database/dynamo";
import { IHandler } from "./handlers/IHandler";
import { APIGatewayHandler } from "./handlers/apigateway";
import { PubSubHandler } from "./handlers/pub-sub";
import { eventParser } from "./helpers/event-parser";
import { ApiGatewayData, ResourceData } from "./helpers/middleware";
import { Person } from "./model/person";

let execution: IHandler;
const dynamoDatabase: IDataAccess = new DynamoDatabase();

export const handler = async (
  event: APIGatewayProxyEvent | SQSEvent | SNSEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const dataParsed: ApiGatewayData<Person> | Array<ResourceData<Person>> =
      eventParser(event);

    if (Array.isArray(dataParsed)) {
      execution = new PubSubHandler(
        dataParsed as Array<ResourceData<Person>>,
        dynamoDatabase
      );

      return {
        statusCode: 200,
        body: JSON.stringify(execution.handle()),
      };
    }

    execution = new APIGatewayHandler(
      dataParsed as ApiGatewayData<Person>,
      dynamoDatabase
    );

    return {
      statusCode: 200,
      body: JSON.stringify(execution.handle()),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: error,
    };
  }
};
