import { IDataAccess } from "../database/IDataAccess";
import { Commands } from "../helpers/enums";
import { ResourceData } from "../helpers/middleware";
import { Person } from "../model/person";
import { IHandler } from "./IHandler";

export class PubSubHandler implements IHandler {
  private readonly _data: Array<ResourceData<Person>>;
  private readonly _dataAccess: IDataAccess;

  constructor(data: Array<ResourceData<Person>>, dataAccess: IDataAccess) {
    this._data = data;
    this._dataAccess = dataAccess;
  }

  public handle(): any {
    return this._data.map((data: ResourceData<Person>) => {
      switch (data.command) {
        case Commands.SAVE:
          return this._dataAccess.save(data.message as Person);
        case Commands.DELETE:
          return this._dataAccess.delete(data.message as string);
        case Commands.UPDATE:
          return this._dataAccess.update(data.message as Person);
      }
    });
  }
}
