import {
  APIGatewayProxyEventPathParameters,
  APIGatewayProxyEventQueryStringParameters,
} from "aws-lambda";

export interface ApiGatewayData<T> {
  body: T | null;
  queryStringParameters: APIGatewayProxyEventQueryStringParameters | null;
  pathID: APIGatewayProxyEventPathParameters | null;
  httpMethod: string;
}

export interface ResourceData<T> {
  message: T | string;
  command: string;
}
