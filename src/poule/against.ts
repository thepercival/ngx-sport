import { AgainstSide } from '../against/side';
import { Competitor } from '../competitor';
import { StartLocationMap } from '../competitor/startLocation/map';
import { GameState } from '../game/state';
import { Poule } from '../poule';
import { AgainstSportRoundRankingCalculator } from '../ranking/calculator/round/sport/against';
import { SportRoundRankingItem } from '../ranking/item/round/sport';

export class AgainstPoule {

    public homeCompetitor: Competitor | undefined;
    public awayCompetitor: Competitor | undefined;
    private sportRankingItems: SportRoundRankingItem[];

    constructor(private poule: Poule, private startLocationMap: StartLocationMap) {
        const competitionSport = poule.getCompetition().getSingleSport();
        const rankingCalculator = new AgainstSportRoundRankingCalculator(competitionSport, [GameState.Finished]);
        this.sportRankingItems = rankingCalculator.getItemsForPoule(poule);

        const homeStartLocation = this.poule.getPlace(1).getStartLocation();
        if (homeStartLocation) {
            this.homeCompetitor = this.startLocationMap.getCompetitor(homeStartLocation);
        }
        if (this.poule.getPlaces().length === 2) {
            const awayStartLocation = this.poule.getPlace(2).getStartLocation();
            if (awayStartLocation) {
                this.awayCompetitor = this.startLocationMap.getCompetitor(awayStartLocation);
            }
        }
    }
    

    public getCompetitor(side: AgainstSide): Competitor | undefined {
        return side === AgainstSide.Home ? this.homeCompetitor : this.awayCompetitor;
    }

    hasRankingScore(): boolean {
        return this.poule.getGamesState() === GameState.InProgress || this.poule.getGamesState() === GameState.Finished;
    }

    getScore(side: AgainstSide): string {
        const sportRankingItem = this.getSportRankingItem(this.getCompetitor(side));
        if (sportRankingItem === undefined) {
            return '';
        }
        const performance = sportRankingItem.getPerformance();
        if (performance === undefined) {
            return '';
        }
        return '' + performance.getPoints();
    }

    public hasQualified(side: AgainstSide): boolean {
        if (this.poule.getGamesState() !== GameState.Finished) {
            return false;
        }
        const oppositeSide = side === AgainstSide.Home ? AgainstSide.Away : AgainstSide.Home

        const sportRankingItem = this.getSportRankingItem(this.getCompetitor(side));
        const opposite = this.getSportRankingItem(this.getCompetitor(oppositeSide));
        if (sportRankingItem === undefined || opposite === undefined) {
            return false;
        }
        return sportRankingItem.getUniqueRank() < opposite.getUniqueRank();
    }

    private getSportRankingItem(competitor: Competitor | undefined): SportRoundRankingItem | undefined {
        if (competitor === undefined) {
            return undefined;
        }
        return this.sportRankingItems.find((sportRankingItem: SportRoundRankingItem): boolean => {
            const startLocation = sportRankingItem.getPerformance().getPlace().getStartLocation();
            return startLocation !== undefined && competitor.getStartLocation().equals(startLocation);
        });
    }
}
