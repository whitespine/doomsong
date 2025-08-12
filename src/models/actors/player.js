import { ActorModel } from "./actor";


export class PlayerModel extends ActorModel {
    static defineSchema() {
        return {
            ...super.defineSchema(),
        }
    }

    toPDFData() {

    }

    // From the fillable character sheet, emit an object that is more compatible with this actor
    fromPDFData(pdfData) {

    }
}