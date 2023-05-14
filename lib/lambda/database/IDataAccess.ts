import { Person } from "../model/person";

export interface IDataAccess {
  get(id: string): any;
  save(person: Person): any;
  update(person: Person): any;
  delete(id: string): any;
}
