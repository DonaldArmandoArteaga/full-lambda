import { APIGatewayProxyEvent, SNSEvent, SQSEvent } from "aws-lambda";
import { Person } from "../model/person";
import { ApiGatewayData, ResourceData } from "./middleware";

export function eventParser(
  event: APIGatewayProxyEvent | SQSEvent | SNSEvent
): ApiGatewayData<Person> | Array<ResourceData<Person>> {
  if (isAPIGatewayEvent(event)) {
    return {
      body: event.body ? (JSON.parse(event.body) as Person) : null,
      queryStringParameters: event.queryStringParameters,
      pathID: event.pathParameters,
      httpMethod: event.httpMethod,
    };
  }

  if (isSNSEvent(event)) {
    return (event as SNSEvent).Records.map(
      ({ Sns: { Message } }: { Sns: { Message: string } }) =>
        messageParser(Message)
    );
  }

  if (isSQSEvent(event)) {
    return (event as SQSEvent).Records.map(({ body }: { body: string }) =>
      messageParser(body)
    );
  }

  throw new Error("Not compatible event structure");
}

function messageParser(messageBody: string): ResourceData<Person> {
  return JSON.parse(messageBody) as ResourceData<Person>;
}

function isAPIGatewayEvent(
  event: APIGatewayProxyEvent | SQSEvent | SNSEvent
): event is APIGatewayProxyEvent {
  return "httpMethod" in event;
}

function isSNSEvent(
  event: APIGatewayProxyEvent | SQSEvent | SNSEvent
): event is SNSEvent {
  return "Records" in event && "EventSource" in event.Records[0];
}

function isSQSEvent(
  event: APIGatewayProxyEvent | SQSEvent | SNSEvent
): event is SQSEvent {
  return "Records" in event && "eventSource" in event.Records[0];
}
