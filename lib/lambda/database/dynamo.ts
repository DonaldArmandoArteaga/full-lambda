import { Person } from "../model/person";
import { IDataAccess } from "./IDataAccess";

export class DynamoDatabase implements IDataAccess {
  constructor() {}
  public get(id: string): any {}
  public save(person: Person): any {}
  public update(person: Person): any {}
  public delete(id: string): any {}
}
