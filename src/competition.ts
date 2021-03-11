import { Field } from './field';
import { League } from './league';
import { Referee } from './referee';
import { Season } from './season';
import { State } from './state';
import { Sport } from './sport';
import { Association } from './association';
import { TeamCompetitor } from './competitor/team';
import { CompetitionSport } from './competition/sport';
import { RankingRuleSet } from './ranking/ruleSet';
import { Identifiable } from './identifiable';

export class Competition extends Identifiable {
    protected startDateTime: Date;
    protected rankingRuleSet: RankingRuleSet = RankingRuleSet.Against;
    protected state: number = State.Created;
    protected referees: Referee[] = [];
    protected sports: CompetitionSport[] = [];
    protected teamCompetitors: TeamCompetitor[] = [];

    constructor(protected league: League, protected season: Season) {
        super();
        this.startDateTime = season.getStartDateTime();
    }

    getLeague(): League {
        return this.league;
    }

    getAssociation(): Association {
        return this.getLeague().getAssociation();
    }

    getSeason(): Season {
        return this.season;
    }

    getRankingRuleSet(): RankingRuleSet {
        return this.rankingRuleSet;
    }

    setRankingRuleSet(rankingRuleSet: RankingRuleSet): void {
        this.rankingRuleSet = rankingRuleSet;
    }

    getStartDateTime(): Date {
        return this.startDateTime;
    }

    setStartDateTime(date: Date) {
        this.startDateTime = date;
    }

    getState(): number {
        return this.state;
    }

    setState(state: number): void {
        this.state = state;
    }

    getName(): string {
        return this.getLeague().getName() + ' ' + this.getSeason().getName();
    }

    getFields(): Field[] {
        let fields: Field[] = [];
        this.getSports().forEach(sport => fields = fields.concat(sport.getFields()));
        return fields;
    }

    getField(priority: number): Field | undefined {
        return this.getFields().find(field => field.getPriority() === priority);
    }

    getReferees(): Referee[] {
        return this.referees;
    }

    getReferee(priority: number): Referee | undefined {
        return this.referees.find(refereeIt => priority === refereeIt.getPriority());
    }

    getSports(): CompetitionSport[] {
        return this.sports;
    }

    getSport(sport: Sport): CompetitionSport | undefined {
        return this.sports.find(sportIt => sportIt.getSport() === sport);
    }

    hasMultipleSports(): boolean {
        return this.sports.length > 1;
    }

    getSingleSport(): CompetitionSport {
        return this.sports[0];
    }

    getTeamCompetitors(): TeamCompetitor[] {
        return this.teamCompetitors;
    }
}
