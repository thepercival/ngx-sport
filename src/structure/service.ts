import { Competitionseason } from '../competitionseason';
import { Game } from '../game';
import { Poule } from '../poule';
import { PoulePlace } from '../pouleplace';
import { QualifyService } from '../qualifyrule/service';
import { Round } from '../round';
import { RoundConfigRepository } from '../round/config/repository';
import { RoundScoreConfigRepository } from '../round/scoreconfig/repository';

/**
 * Created by coen on 22-3-17.
 */

export interface IRoundStructure {
    nrofpoules: number;
    nrofwinners: number;
}

export class StructureService {

    private static readonly DEFAULTS: IRoundStructure[] = [
        undefined, undefined,
        { nrofpoules: 1, nrofwinners: 1 }, // 2
        { nrofpoules: 1, nrofwinners: 1 },
        { nrofpoules: 1, nrofwinners: 1 },
        { nrofpoules: 1, nrofwinners: 2 },
        { nrofpoules: 2, nrofwinners: 2 }, // 6
        { nrofpoules: 1, nrofwinners: 1 },
        { nrofpoules: 2, nrofwinners: 2 },
        { nrofpoules: 3, nrofwinners: 4 },
        { nrofpoules: 2, nrofwinners: 2 }, // 10
        { nrofpoules: 2, nrofwinners: 2 },
        { nrofpoules: 3, nrofwinners: 4 },
        { nrofpoules: 3, nrofwinners: 4 },
        { nrofpoules: 3, nrofwinners: 4 },
        { nrofpoules: 3, nrofwinners: 4 },
        { nrofpoules: 4, nrofwinners: 4 },
        { nrofpoules: 4, nrofwinners: 4 },
        { nrofpoules: 4, nrofwinners: 8 },
        { nrofpoules: 4, nrofwinners: 8 },
        { nrofpoules: 5, nrofwinners: 8 },
        { nrofpoules: 5, nrofwinners: 8 },
        { nrofpoules: 5, nrofwinners: 8 },
        { nrofpoules: 5, nrofwinners: 8 },
        { nrofpoules: 5, nrofwinners: 8 },
        { nrofpoules: 5, nrofwinners: 8 },
        { nrofpoules: 6, nrofwinners: 8 },
        { nrofpoules: 6, nrofwinners: 8 },
        { nrofpoules: 7, nrofwinners: 8 },
        { nrofpoules: 6, nrofwinners: 8 },
        { nrofpoules: 6, nrofwinners: 8 },
        { nrofpoules: 7, nrofwinners: 8 },
        { nrofpoules: 8, nrofwinners: 16 }
    ];

    private rangeNrOfCompetitors;
    private configRepos: RoundConfigRepository;
    private scoreConfigRepos: RoundScoreConfigRepository;
    private firstRound: Round;

    constructor(
        private competitionseason: Competitionseason,
        rangeNrOfCompetitors,
        firstRound: Round,
        nrOfPlaces: number = 0
    ) {
        this.rangeNrOfCompetitors = rangeNrOfCompetitors;
        this.configRepos = new RoundConfigRepository();
        this.scoreConfigRepos = new RoundScoreConfigRepository();
        this.firstRound = firstRound;
        if (firstRound === undefined) {
            this.firstRound = this.addRound(undefined, 0, nrOfPlaces);
        }
    }

    getCompetitionseason(): Competitionseason {
        return this.competitionseason;
    }

    getFirstRound(): Round {
        return this.firstRound;
    }

    getRoundById(id: number) {
        return this.getRounds(this.getFirstRound()).find(roundIt => id === roundIt.getId());
    }

    getRounds(round: Round, rounds: Round[] = []): Round[] {
        if (round === undefined) {
            return rounds;
        }
        rounds.push(round);
        rounds = this.getRounds(round.getChildRound(Round.WINNERS), rounds);
        return this.getRounds(round.getChildRound(Round.LOSERS), rounds);
    }

    getAllRoundsByNumber(round: Round = this.getFirstRound(), roundsByNumber: any = {}): {} {
        if (roundsByNumber[round.getNumber()] === undefined) {
            roundsByNumber[round.getNumber()] = [];
        }
        roundsByNumber[round.getNumber()].push(round);
        round.getChildRounds().forEach((childRound) => this.getAllRoundsByNumber(childRound, roundsByNumber));
        return roundsByNumber;
    }

    getGameById(id: number, round: Round): Game {
        if (round === undefined) {
            return undefined;
        }
        let game = round.getGames().find(gameIt => gameIt.getId() === id);
        if (game !== undefined) {
            return game;
        }

        game = this.getGameById(id, round.getChildRound(Round.WINNERS));
        if (game !== undefined) {
            return game;
        }
        return this.getGameById(id, round.getChildRound(Round.LOSERS));
    }

    // getPoulePlaces(): PoulePlace[]
    // {
    //     let pouleplaces = [];
    //     this.rounds.forEach( function( round ){
    //         round.getPoules().forEach( function( poule ){
    //             poule.getPlaces().forEach( function( pouleplace ){
    //                 pouleplaces.push(pouleplace);
    //             });
    //         });
    //     });
    //     return pouleplaces;
    // }

    // getGames(): Game[]
    // {
    //     let games = [];
    //     this.rounds.forEach( function( round ) {
    //         round.getGames().forEach(function (game) {
    //             games.push(game);
    //         });
    //     });
    //     return games;
    // }

    private roundAndParentsNeedsRanking(round: Round) {

        if (round.needsRanking()) {
            if (round.getParentRound() !== undefined) {
                return this.roundAndParentsNeedsRanking(round.getParentRound());
            }
            return true;
        }
        return false;
    }

    getSiblingRounds(roundNumber: number): Round[] {
        const roundsByNumber: {} = this.getAllRoundsByNumber();
        return roundsByNumber[roundNumber];
    }

    getNrOfSiblingRounds(round: Round) {
        const roundsByNumber: {} = this.getAllRoundsByNumber();
        return roundsByNumber[round.getNumber()].length - 1;
    }

    getNrOfRoundsToGo(round: Round) {
        let nrOfRoundsToGoWinners = 0;
        {
            const childRoundWinners = round.getChildRound(Round.WINNERS);
            if (childRoundWinners !== undefined) {
                nrOfRoundsToGoWinners = this.getNrOfRoundsToGo(childRoundWinners) + 1;
            }
        }
        let nrOfRoundsToGoLosers = 0;
        {
            const childRoundLosers = round.getChildRound(Round.LOSERS);
            if (childRoundLosers !== undefined) {
                nrOfRoundsToGoLosers = this.getNrOfRoundsToGo(childRoundLosers) + 1;
            }
        }
        if (nrOfRoundsToGoWinners > nrOfRoundsToGoLosers) {
            return nrOfRoundsToGoWinners;
        }
        return nrOfRoundsToGoLosers;
    }

    /**
     * Wanneer needsranking en als zijn parents needsRanking dan xste ronde
     * Wanneer er 2 children zijn, met beide ander maxDepth dan aanduiden met xste ronde
     * Alle andere ronden zijn finales
     *
     *
     * @param round
     */
    getRoundName(round: Round, sameName: boolean = false) {
        if (this.roundAndParentsNeedsRanking(round) || (round.getChildRounds().length > 1
            && this.getNrOfRoundsToGo(round.getChildRound(Round.WINNERS)) !==
            this.getNrOfRoundsToGo(round.getChildRound(Round.LOSERS)))) {
            return this.getHtmlNumber(round.getNumber()) + ' ronde';
        }

        const nrOfRoundsToGo = this.getNrOfRoundsToGo(round);
        if (nrOfRoundsToGo >= 2 && nrOfRoundsToGo <= 5) {
            return this.getHtmlFractalNumber(Math.pow(2, nrOfRoundsToGo - 1)) + ' finale';
        } else if (nrOfRoundsToGo === 1) {
            if (round.getPoulePlaces().length === 2 && sameName === false) {
                const rankedPlace = this.getRankedPlace(round);
                return this.getHtmlNumber(rankedPlace) + '/' + this.getHtmlNumber(rankedPlace + 1) + ' plaats';
            }
            return 'finale';
        } else if (nrOfRoundsToGo === 0) {
            return this.getWinnersLosersDescription(round.getWinnersOrLosers());
        }
        return '?';
    }

    roundsHaveSameName(roundsByNumber: Round[]) {
        let roundNameAll;
        return roundsByNumber.some((round) => {
            const roundName = this.getRoundName(round, true);
            if (roundNameAll === undefined) {
                roundNameAll = roundName;
                return true;
            }
            if (roundNameAll === roundName) {
                return true;
            }
            return false;
        });
    }

    /**
     *  als allemaal dezelfde naam dan geef die naam
     * als verschillde namen geef dan xde ronde met tooltip van de namen
     *
     * @param roundsByNumber
     *
     */
    getRoundsName(roundNumber, roundsByNumber: Round[]) {
        if (this.roundsHaveSameName(roundsByNumber) === true) {
            return this.getRoundName(roundsByNumber[0], true);
        }
        return this.getHtmlNumber(roundNumber) + ' ronde';
    }

    protected getHtmlFractalNumber(number) {
        if (number === 4 || number === 3 || number === 2) {
            return '&frac1' + number + ';';
        }
        return '<span style="font-size: 80%"><sup>1</sup>&frasl;<sub>' + number + '</sub></span>';
    }

    protected getHtmlNumber(number) {
        return number + '<sup>' + (number === 1 ? 'st' : 'd') + 'e</sup>';
    }

    getWinnersLosersPosition(round: Round, winnersLosersPosition: number[] = []): number[] {
        if (round.getParentRound() === undefined) {
            return winnersLosersPosition.reverse();
        }
        winnersLosersPosition.push(round.getWinnersOrLosers());
        return this.getWinnersLosersPosition(round.getParentRound(), winnersLosersPosition);
    }

    getWinnersLosersDescription(winnersOrLosers: number): string {
        return winnersOrLosers === Round.WINNERS ? 'winnaar' : (winnersOrLosers === Round.LOSERS ? 'verliezer' : '');
    }

    getPouleName(poule: Poule, withPrefix: boolean) {
        const round = poule.getRound();
        const previousNrOfPoules = this.getNrOfPreviousPoules(round.getNumber(), round, poule);
        let pouleName = '';
        if (withPrefix === true) {
            pouleName = round.getType() === Round.TYPE_KNOCKOUT ? 'wed. ' : 'poule ';
        }
        const secondLetter = previousNrOfPoules % 26;
        if (previousNrOfPoules >= 26) {
            const firstLetter = (previousNrOfPoules - secondLetter) / 26;
            pouleName += (String.fromCharCode('A'.charCodeAt(0) + (firstLetter - 1)));
        }
        pouleName += (String.fromCharCode('A'.charCodeAt(0) + secondLetter));
        return pouleName;
    }

    private getNrOfPreviousPoules(roundNumber: number, round: Round, poule: Poule): number {
        let nrOfPoules = poule.getNumber() - 1;
        nrOfPoules += this.getNrOfPoulesParentRounds(round);
        nrOfPoules += this.getNrOfPoulesSiblingRounds(roundNumber, round);
        return nrOfPoules;
    }

    private getNrOfPoulesParentRounds(round: Round): number {
        return this.getNrOfPoulesParentRoundsHelper(round.getNumber() - 1, this.getFirstRound());
    }

    private getNrOfPoulesParentRoundsHelper(maxRoundNumber: number, round: Round): number {
        if (round.getNumber() > maxRoundNumber) {
            return 0;
        }
        let nrOfPoules = round.getPoules().length;
        round.getChildRounds().forEach((childRound) => {
            nrOfPoules += this.getNrOfPoulesParentRoundsHelper(maxRoundNumber, childRound);
        });
        return nrOfPoules;
    }

    private getNrOfPoulesSiblingRounds(roundNumber: number, round: Round): number {
        let nrOfPoules = 0;

        const parentRound = round.getParentRound();
        if (parentRound !== undefined) {
            nrOfPoules += this.getNrOfPoulesSiblingRounds(roundNumber, parentRound/* round */);
        }

        if (round.getWinnersOrLosers() === Round.LOSERS) {
            const winningSibling = round.getOpposing();
            if (winningSibling !== undefined) {
                nrOfPoules += this.getNrOfPoulesForChildRounds(winningSibling, roundNumber);
            }
        }
        return nrOfPoules;
    }

    private getNrOfPoulesForChildRounds(round: Round, roundNumber: number): number {
        let nrOfChildPoules = 0;
        if (round.getNumber() > roundNumber) {
            return nrOfChildPoules;
        } else if (round.getNumber() === roundNumber) {
            return round.getPoules().length;
        }

        round.getChildRounds().forEach((childRound) => {
            nrOfChildPoules += this.getNrOfPoulesForChildRounds(childRound, roundNumber);
        });
        return nrOfChildPoules;
    }

    getPoulePlaceName(pouleplace: PoulePlace, teamName = false, full: boolean = false) {
        if (teamName === true && pouleplace.getTeam() !== undefined) {
            return pouleplace.getTeam().getName();
        }
        const poule = pouleplace.getPoule();
        const round = poule.getRound();

        const fromQualifyRule = pouleplace.getFromQualifyRule();
        if (fromQualifyRule === undefined) { // first round
            return this.getPoulePlaceNameSimple(pouleplace, teamName);
        }

        if (fromQualifyRule.isMultiple() === false) {
            const fromPoulePlace = fromQualifyRule.getSingleFromEquivalent(pouleplace);
            return this.getPoulePlaceNameSimple(fromPoulePlace, teamName);
        }

        if (full === true) {
            return fromQualifyRule.getFromPoulePlaces().join('..');
        }
        return fromQualifyRule.getFromPoulePlaces().join('<br>');
        // bv; A2;
        // A2..D2 in tooltip; dan; A2, B2, C2; of; D2;


    }

    getPoulePlaceNameSimple(pouleplace: PoulePlace, teamName = false) {
        if (teamName === true && pouleplace.getTeam() !== undefined) {
            return pouleplace.getTeam().getName();
        }
        const pouleplaceName = this.getPouleName(pouleplace.getPoule(), false);
        return pouleplaceName + pouleplace.getNumber();
    }

    addRound(parentRound: Round, winnersOrLosers: number, nrOfPlaces: number): Round {

        const opposingChildRound = parentRound ? parentRound.getChildRound(Round.getOpposing(winnersOrLosers)) : undefined;
        const opposing = opposingChildRound !== undefined ? opposingChildRound.getWinnersOrLosers() : 0;
        return this.addRoundHelper(parentRound, winnersOrLosers, nrOfPlaces, opposing);
    }

    private addRoundHelper(parentRound: Round, winnersOrLosers: number, nrOfPlaces: number, opposing: number): Round {
        const round = new Round(this.competitionseason, parentRound, winnersOrLosers);
        if (nrOfPlaces <= 0) {
            return;
        }

        const roundStructure = this.getDefaultRoundStructure(round.getNumber(), nrOfPlaces);
        if (roundStructure === undefined) {
            return;
        }
        const nrOfPlacesPerPoule = this.getNrOfPlacesPerPoule(nrOfPlaces, roundStructure.nrofpoules);
        const nrOfPlacesNextRound =
            (winnersOrLosers === Round.LOSERS) ? (nrOfPlaces - roundStructure.nrofwinners) : roundStructure.nrofwinners;
        const nrOfOpposingPlacesNextRound =
            (Round.getOpposing(winnersOrLosers) === Round.WINNERS) ? roundStructure.nrofwinners : nrOfPlaces - roundStructure.nrofwinners;

        while (nrOfPlaces > 0) {
            const nrOfPlacesToAdd = nrOfPlaces < nrOfPlacesPerPoule ? nrOfPlaces : nrOfPlacesPerPoule;
            const poule = new Poule(round);
            for (let i = 0; i < nrOfPlacesToAdd; i++) {
                const tmp = new PoulePlace(poule);
            }
            nrOfPlaces -= nrOfPlacesPerPoule;
        }

        this.configRepos.createObjectFromParent(round);
        round.setScoreConfig(this.scoreConfigRepos.createObjectFromParent(round));

        if (parentRound !== undefined) {
            const qualifyService = new QualifyService(round);
            // qualifyService.removeObjectsForParentRound();
            qualifyService.createObjectsForParentRound();
        }

        console.log(roundStructure);
        if (roundStructure.nrofwinners === 0) {
            return round;
        }
        console.log('addRound', nrOfPlacesNextRound);
        this.addRoundHelper(round, winnersOrLosers ? winnersOrLosers : Round.WINNERS, nrOfPlacesNextRound, opposing);
        // const hasParentRoundOpposingChild = ( parentRound.getChildRound( Round.getOpposing( winnersOrLosers ) )!== undefined );
        if (opposing > 0 || (round.getPoulePlaces().length === 2)) {
            opposing = opposing > 0 ? opposing : Round.getOpposing(winnersOrLosers);
            this.addRoundHelper(round, opposing, nrOfOpposingPlacesNextRound, winnersOrLosers);
        }

        return round;
    }

    removeRound(parentRound: Round, winnersOrLosers: number) {
        const childRound = parentRound.getChildRound(winnersOrLosers);
        const index = parentRound.getChildRounds().indexOf(childRound);
        if (index > -1) {
            parentRound.getChildRounds().splice(index, 1);
        }
        console.log('removeround', index);

    }

    addPoule(round: Round, fillPouleToMinimum: boolean = true, recalcQualify: boolean = true): number {
        const poules = round.getPoules();
        const places = round.getPoulePlaces();
        const nrOfPlacesNotEvenOld = places.length % poules.length;
        const placesPerPouleOld = (places.length - nrOfPlacesNotEvenOld) / poules.length;
        const newPoule = new Poule(round);
        const nrOfPlacesNotEven = places.length % poules.length;
        let placesToAddToNewPoule = (places.length - nrOfPlacesNotEven) / poules.length;

        if (placesPerPouleOld === 2 && nrOfPlacesNotEvenOld < 2) {
            placesToAddToNewPoule = nrOfPlacesNotEvenOld;
        }

        const orderedByPlace = true;
        const poulePlacesOrderedByPlace = round.getPoulePlaces(orderedByPlace);
        while (placesToAddToNewPoule > 0) {

            poulePlacesOrderedByPlace.forEach(function (poulePlaceIt) {
                if (poulePlaceIt.getNumber() === 1 || placesToAddToNewPoule === 0) {
                    return;
                }
                round.movePoulePlace(poulePlaceIt, newPoule);
                placesToAddToNewPoule--;
            });
        }

        // there could be a place left in the last placenumber which does not start at the first poule
        const poulePlacesPerNumberParentRound = round.getPoulePlacesPerNumber(undefined);
        const lastPoulePlaces = poulePlacesPerNumberParentRound.pop();
        let pouleIt = round.getPoules()[0];
        lastPoulePlaces.forEach(function (lastPoulePlaceIt) {
            if (lastPoulePlaceIt.getPoule() !== pouleIt) {
                round.movePoulePlace(lastPoulePlaceIt, pouleIt);
            }
            pouleIt = pouleIt.next();
        });

        if (fillPouleToMinimum === true) {
            while (newPoule.getPlaces().length < 2) {
                const tmp = new PoulePlace(newPoule);
            }
        }

        if (recalcQualify === true) {
            round.getChildRounds().forEach(function (childRound) {
                const qualifyService = new QualifyService(childRound);
                qualifyService.removeObjectsForParentRound();
                qualifyService.createObjectsForParentRound();
            });
        }
        return newPoule.getPlaces().length;
    }

    removePoule(round, recalcQualify: boolean = true): boolean {
        const poules = round.getPoules();
        const roundPlaces = round.getPoulePlaces();
        if (poules.length === 1) {
            throw new Error('er moet minimaal 1 poule zijn');
        }
        const lastPoule = poules[poules.length - 1];
        const places = lastPoule.getPlaces();
        while (places.length > 0) {
            const place = places[places.length - 1];
            const nrOfPlacesNotEven = ((roundPlaces.length - lastPoule.getPlaces().length) % (poules.length - 1)) + 1;
            const poule = poules.find(pouleIt => nrOfPlacesNotEven === pouleIt.getNumber());
            if (!round.movePoulePlace(place, poule)) {
                throw new Error('de pouleplek kan niet verplaatst worden');
            }
        }
        try {
            this.removePouleHelper(lastPoule);
        } catch (e) {
            throw new Error('er moet minimaal 1 poule zijn');
        }

        if (recalcQualify === true) {
            round.getChildRounds().forEach(function (childRound) {
                const qualifyService = new QualifyService(childRound);
                qualifyService.removeObjectsForParentRound();
                qualifyService.createObjectsForParentRound();
            });
        }
        return true;
    }

    private removePouleHelper(poule: Poule): boolean {
        if (poule.getGames().length > poule.getGamesWithState(Game.STATE_CREATED).length) {
            throw new Error('de poule kan niet verwijderd worden, omdat er al gestarte wedstrijden aanwezig aan');
        }

        const poules = poule.getRound().getPoules();
        const index = poules.indexOf(poule);
        if (index > -1) {
            poules.splice(index, 1);
            return true;
        }
        return false;
    }

    removePoulePlace(round, recalcQualify: boolean = true): number {
        const places = round.getPoulePlaces();
        const poules = round.getPoules();
        if (poules.length === 0) {
            throw new Error('er moet minimaal 1 poule aanwezig zijn');
        }

        const nrOfPlacesNotEven = places.length % poules.length;
        let pouleToRemoveFrom = poules[poules.length - 1];
        if (nrOfPlacesNotEven > 0) {
            pouleToRemoveFrom = poules.find(pouleIt => nrOfPlacesNotEven === pouleIt.getNumber());
        }

        const placesTmp = pouleToRemoveFrom.getPlaces();
        if (round.getNumber() === 1) {
            if (this.rangeNrOfCompetitors.min && placesTmp.length === this.rangeNrOfCompetitors.min) {
                throw new Error('er moeten minimaal ' + this.rangeNrOfCompetitors.min + ' deelnemers per poule zijn');
            }
        }

        if (places.length === 1) {
            this.removeRound(round.getParentRound(), round.getWinnersOrLosers());
            return 1;
        }

        let nrOfRemovedPlaces = 1;
        pouleToRemoveFrom.removePlace(placesTmp[placesTmp.length - 1]);
        if (placesTmp.length === 1 && poules.length > 1) {
            this.removePoule(round, !recalcQualify);
            nrOfRemovedPlaces++;
        }

        console.log(round.getPoulePlaces());
        if (round.getNrOfPlacesChildRounds() > round.getPoulePlaces().length) {
            let childRoundToRemovePlace = round.getChildRound(Round.LOSERS);
            if (childRoundToRemovePlace === undefined) {
                childRoundToRemovePlace = round.getChildRound(Round.WINNERS);
            }
            if (childRoundToRemovePlace !== undefined) {
                // this.changeNrOfPlacesChildRound( childRoundToRemovePlace.getPoulePlaces().length - 1,
                // round, childRoundToRemovePlace.getWinnersOrLosers()
                // );
                this.removePoulePlace(childRoundToRemovePlace, recalcQualify);
            }
        }

        if (round.getPoulePlaces().length <= 1) {
            round.getChildRounds().forEach(function (childRound) {
                this.removeRound(round, childRound.getWinnersOrLosers());
            }, this);
        }

        if (recalcQualify === true) {
            round.getChildRounds().forEach(function (childRound) {
                const qualifyService = new QualifyService(childRound);
                qualifyService.removeObjectsForParentRound();
                qualifyService.createObjectsForParentRound();
            });
        }

        return nrOfRemovedPlaces;
    }

    addPoulePlace(round, recalcQualify: boolean = true): boolean {
        const poules = round.getPoules();
        if (poules.length === 0) {
            throw new Error('er moet minimaal 1 poule aanwezig zijn');
        }
        const places = round.getPoulePlaces();
        if (places.length > this.rangeNrOfCompetitors.max) {
            throw new Error('er mogen maximaal ' + this.rangeNrOfCompetitors.max + ' deelnemers meedoen');
        }

        const nrOfPlacesNotEven = places.length % poules.length;

        let pouleToAddTo = poules[0];
        if (nrOfPlacesNotEven > 0) {
            pouleToAddTo = poules.find(pouleIt => (nrOfPlacesNotEven + 1) === pouleIt.getNumber());
        }
        const poulePlace = new PoulePlace(pouleToAddTo);

        if (recalcQualify === true) {
            round.getChildRounds().forEach(function (childRound) {
                const qualifyService = new QualifyService(childRound);
                qualifyService.removeObjectsForParentRound();
                qualifyService.createObjectsForParentRound();
            });
        }
        return true;
    }

    changeNrOfPlacesChildRound(nrOfChildPlacesNew: number, parentRound: Round, winnersOrLosers: number) {
        let childRound = parentRound.getChildRound(winnersOrLosers);

        let add = (childRound === undefined && nrOfChildPlacesNew > 0);
        if (childRound !== undefined && childRound.getPoulePlaces().length > 0 && nrOfChildPlacesNew === 2) {
            const qualifyServiceIn = new QualifyService(childRound);
            qualifyServiceIn.removeObjectsForParentRound();
            this.removeRound(parentRound, winnersOrLosers);
            childRound = undefined;
            add = true;
        }

        if (add) {
            childRound = this.addRound(parentRound, winnersOrLosers, nrOfChildPlacesNew);
            const qualifyServiceIn2 = new QualifyService(childRound);
            qualifyServiceIn2.removeObjectsForParentRound();
            this.checkOpposingRound(parentRound, winnersOrLosers);
            qualifyServiceIn2.createObjectsForParentRound();
            return;
        }
        if (childRound === undefined) {
            return;
        }

        const qualifyService = new QualifyService(childRound);
        qualifyService.removeObjectsForParentRound();

        if (nrOfChildPlacesNew === 0) {
            this.removeRound(parentRound, winnersOrLosers);
            return;
        }

        // check wat the last number was
        const nrOfPlacesChildRound = childRound.getPoulePlaces().length;
        let nrOfPlacesDifference = nrOfChildPlacesNew - nrOfPlacesChildRound;
        if (nrOfPlacesDifference < 0) {
            while (nrOfPlacesDifference < 0) {
                nrOfPlacesDifference += this.removePoulePlace(childRound);
            }
        } else {
            const needsRanking = nrOfPlacesChildRound !== 1 && !childRound.needsRanking();
            const addPoules = (needsRanking && ((nrOfPlacesChildRound + nrOfPlacesDifference) % 2) === 0);
            for (let nI = 0; nI < nrOfPlacesDifference; nI++) {
                if (addPoules) {
                    this.addPoule(childRound, true, true);
                    nI++;
                } else {
                    this.addPoulePlace(childRound, true);
                }
            }

        }
        qualifyService.createObjectsForParentRound();

        this.checkOpposingRound(parentRound, winnersOrLosers);
    }

    private checkOpposingRound(parentRound: Round, winnersOrLosers: number) {
        const nrOfChildPlaces = parentRound.getNrOfPlacesChildRound(winnersOrLosers);
        const opposing = Round.getOpposing(winnersOrLosers);
        const nrOfPlacesLeftForOpposing = parentRound.getPoulePlaces().length - nrOfChildPlaces;
        const nrOfChildPlacesOpposing = parentRound.getNrOfPlacesChildRound(opposing);
        if (nrOfPlacesLeftForOpposing < nrOfChildPlacesOpposing) {
            this.changeNrOfPlacesChildRound(nrOfPlacesLeftForOpposing, parentRound, opposing);
        } else if (nrOfPlacesLeftForOpposing === nrOfChildPlacesOpposing) {
            const childRound = parentRound.getChildRound(winnersOrLosers);
            const qualifyService = new QualifyService(childRound);
            qualifyService.oneMultipleToSingle();
        }
    }

    /**
     * determine number of pouleplaces on left side
     * @param round
     */
    getRankedPlace(round: Round, rankedPlace: number = 1) {
        const parentRound = round.getParentRound();
        if (parentRound === undefined) {
            return rankedPlace;
        }
        if (round.getWinnersOrLosers() === Round.LOSERS) {
            rankedPlace += parentRound.getPoulePlaces().length - round.getPoulePlaces().length;
        }
        return this.getRankedPlace(parentRound, rankedPlace);
    }

    getDefaultRoundStructure(roundNr, nrOfTeams): IRoundStructure {
        if (nrOfTeams < 1) {
            return undefined;
        } else if (nrOfTeams === 1) {
            return { nrofpoules: 1, nrofwinners: 0 };
        }
        if (roundNr > 1 && (nrOfTeams % 2) === 0) {
            return { nrofpoules: nrOfTeams / 2, nrofwinners: nrOfTeams / 2 };
        }

        const roundStructure = StructureService.DEFAULTS[nrOfTeams];
        if (roundStructure === undefined) {
            throw new Error('het aantal teams moet minimaal ' + (this.rangeNrOfCompetitors.min - 1) +
                ' zijn en mag maximaal ' + this.rangeNrOfCompetitors.max + ' zijn');
        }
        return roundStructure;
    }

    getNrOfPlacesPerPoule(nrOfPlaces, nrOfPoules) {
        const nrOfPlaceLeft = (nrOfPlaces % nrOfPoules);
        return (nrOfPlaces + nrOfPlaceLeft) / nrOfPoules;
    }



    // addQualifier( fromRound: Round, winnersOrLosers: number ) {
    //     let toRound = fromRound.getChildRound( winnersOrLosers );
    //     console.log(toRound);
    //     if (toRound === undefined) {
    //         toRound = this.addRound( fromRound, winnersOrLosers );
    //     }
    //     // determine if new qualifiationrule is needed
    //
    //
    //     const fromQualifyRules = toRound.getFromQualifyRules();
    //     const lastFromQualifyRule = fromQualifyRules[fromQualifyRules.length - 1];
    //     if( lastFromQualifyRule !== undefined && lastFromQualifyRule.isMultiple() ) {
    //         if( ( lastFromQualifyRule.getFromPoulePlaces().length - 1 ) < lastFromQualifyRule.getToPoulePlaces().length ) {
    // edit lastFromQualifyRule
    //
    //         }
    //         if( ( lastFromQualifyRule.getFromPoulePlaces().length - 1 ) === lastFromQualifyRule.getToPoulePlaces().length ) {
    // remove and add multiple
    //
    //         }
    //     }
    //
    //     const fromPoules = fromRound.getPoules();
    //     if ( fromPoules.length > 1 ) { // new multiple
    //
    //     }
    //     else { // new single
    //         const fromPoule = fromPoules[0];
    //         const fromPlace = fromPoule.getPlaces().find( function( pouleplaceIt ) {
    //             return this == pouleplaceIt.getNumber()
    //         }, toRound.getFromQualifyRules().length + 1 );
    //         if ( fromPlace === undefined ) { return; }
    //
    //         const toPoules = toRound.getPoules();
    //         const toPoule = toPoules[0];
    //         let toPlace = undefined;
    //         if( lastFromQualifyRule === undefined ) { // just get first
    //             toPlace = toPoule.getPlaces()[0];
    //         }
    //         else { // determine which toPoule and toPlace
    //
    //         }
    //         if ( toPlace === undefined ) { return; }
    //
    //         let qualifyRule = new QualifyRule( fromRound, toRound );
    //         qualifyRule.addFromPoulePlace( fromPlace );
    //         qualifyRule.addToPoulePlace( toPlace );
    //     }
    // }
}
