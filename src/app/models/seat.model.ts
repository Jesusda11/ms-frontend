import { Theater } from "./theater.model";

export class Seat {
    id:number;
    location:String;
    reclinig:boolean;
    theater_id:number; //Se puede manejar como un objeto o como una referencia.
    theater?:Theater;
}
