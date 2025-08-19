
export class DoomsongTokenDocument extends TokenDocument {
    // Fix our bars to be editable
    getBarAttribute(s) {
        let sub = super.getBarAttribute(s);
        if(sub?.attribute == "toughness_bar" || sub?.attribute == "footing_bar") {
            sub.editable = true;
        }
        return sub;
    }
}