export class ScoringType {
    id: number;
    name: string;
    description; string;

    fromJson(json: any): ScoringType {
        this.id = json.id;
        this.name = json.name;
        this.description = json.description;
        return this;
    }
}

export class GameType {
    id: number;
    name: string;
    description: string;
    isIndividual: boolean;
    isTeam: boolean;
    isMatch: boolean;
    minimumPlayers: number;
    maximumPlayers: number;
    scoringTypes: ScoringType[];


    fromJson(json: any): GameType {
        this.id = json.id;
        this.name = json.name;
        this.description = json.description;
        this.isIndividual = json.is_individual;
        this.isTeam = json.is_team;
        this.isMatch = json.is_match;
        this.minimumPlayers = json.min_players;
        this.maximumPlayers = json.max_players;
        this.scoringTypes = json.scoring_types.map(s => new ScoringType().fromJson(s));
        return this;
    }
}
