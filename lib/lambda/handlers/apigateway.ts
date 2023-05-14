import { IDataAccess } from "../database/IDataAccess";
import { HTTPMethod } from "../helpers/enums";
import { ApiGatewayData } from "../helpers/middleware";
import { Person } from "../model/person";
import { IHandler } from "./IHandler";

export class APIGatewayHandler implements IHandler {
  private readonly _data: ApiGatewayData<Person>;
  private readonly _dataAccess: IDataAccess;

  constructor(data: ApiGatewayData<Person>, dataAccess: IDataAccess) {
    this._data = data;
    this._dataAccess = dataAccess;
  }

  public handle(): any {
    switch (this._data.httpMethod) {
      case HTTPMethod.GET:
        return this._dataAccess.get(this._data.pathID!.id!);
      case HTTPMethod.POST:
        return this._dataAccess.save(this._data.body!);
      case HTTPMethod.PUT:
        return this._dataAccess.update(this._data.body!);
      case HTTPMethod.PATCH:
        return this._dataAccess.update(this._data.body!);
      case HTTPMethod.DELETE:
        return this._dataAccess.delete(this._data.pathID!.id!);
    }
  }
}
