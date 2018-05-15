export class Payout {
    id: number;
    place: number;
    percentage: number;
    amount: number;

    fromJson(json: any): Payout {
        this.id = json.id;
        this.place = json.place;
        this.percentage = json.percentage * 100;
        this.amount = json.amount;
        return this;
    }

    toJson(): any {
        return {
            'id': this.id,
            'place': this.place,
            'percentage': this.percentage / 100,
            'amount': this.amount
        };
    }
}
