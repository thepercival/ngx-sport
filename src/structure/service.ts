import { Competition } from '../competition';
import { Game } from '../game';
import { Poule } from '../poule';
import { PoulePlace } from '../pouleplace';
import { QualifyService } from '../qualify/service';
import { Round } from '../round';
import { RoundConfigService } from '../round/config/service';
import { StructureNameService } from './nameservice';

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
        { nrofpoules: 8, nrofwinners: 16 }, // 32
        { nrofpoules: 6, nrofwinners: 8 },
        { nrofpoules: 6, nrofwinners: 8 },
        { nrofpoules: 7, nrofwinners: 8 },
        { nrofpoules: 6, nrofwinners: 8 }
    ];

    private rangeNrOfCompetitors;
    private configService: RoundConfigService;
    private firstRound: Round;
    private nameService: StructureNameService;

    constructor(
        private competition: Competition,
        rangeNrOfCompetitors,
        firstRound: Round,
        nrOfPlaces: number = 0
    ) {
        this.rangeNrOfCompetitors = rangeNrOfCompetitors;
        this.configService = new RoundConfigService();
        this.firstRound = firstRound;
        if (firstRound === undefined) {
            this.firstRound = this.addRound(undefined, 0, nrOfPlaces);
        }
    }

    getCompetition(): Competition {
        return this.competition;
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



    getSiblingRounds(roundNumber: number): Round[] {
        const roundsByNumber: {} = this.getAllRoundsByNumber();
        return roundsByNumber[roundNumber];
    }

    getNrOfSiblingRounds(round: Round) {
        return this.getSiblingRounds(round.getNumber()).length - 1;
    }



    getRoundNumbers(): Array<number> {
        const nrOfRoundsToGo = this.getFirstRound().getNrOfRoundsToGo();
        const nrOfRounds = nrOfRoundsToGo + 1;
        return Array(nrOfRounds).fill(0).map((e, i) => i + 1);
    }

    getWinnersLosersPosition(round: Round, winnersLosersPosition: number[] = []): number[] {
        if (round.getParent() === undefined) {
            return winnersLosersPosition.reverse();
        }
        winnersLosersPosition.push(round.getWinnersOrLosers());
        return this.getWinnersLosersPosition(round.getParent(), winnersLosersPosition);
    }

    addRound(parentRound: Round, winnersOrLosers: number, nrOfPlaces: number): Round {

        const opposingChildRound = parentRound ? parentRound.getChildRound(Round.getOpposing(winnersOrLosers)) : undefined;
        const opposing = opposingChildRound !== undefined ? opposingChildRound.getWinnersOrLosers() : 0;
        return this.addRoundHelper(parentRound, winnersOrLosers, nrOfPlaces, opposing);
    }

    private addRoundHelper(parentRound: Round, winnersOrLosers: number, nrOfPlaces: number, opposing: number): Round {
        const round = new Round(this.competition, parentRound, winnersOrLosers);
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

        this.configService.createConfigFromRound(round);

        if (parentRound !== undefined) {
            const qualifyService = new QualifyService(round);
            // qualifyService.removeObjectsForParentRound();
            qualifyService.createObjectsForParentRound();
        }

        if (roundStructure.nrofwinners === 0) {
            return round;
        }

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

        const poulePlacesOrderedByPlace = round.getPoulePlaces(Round.ORDER_HORIZONTAL);
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
        const poulePlacesPerNumberParentRound = round.getPoulePlacesPerNumber(Round.WINNERS);
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
            this.removeRound(round.getParent(), round.getWinnersOrLosers());
            return 1;
        }

        let nrOfRemovedPlaces = 1;
        pouleToRemoveFrom.removePlace(placesTmp[placesTmp.length - 1]);
        if (placesTmp.length === 1 && poules.length > 1) {
            this.removePoule(round, !recalcQualify);
            nrOfRemovedPlaces++;
        }

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

    getDefaultRoundStructure(roundNr, nrOfTeams): IRoundStructure {
        if (nrOfTeams < 1) {
            return undefined;
        } else if (nrOfTeams === 1) {
            return { nrofpoules: 1, nrofwinners: 0 };
        }
        if (roundNr > 1 && (nrOfTeams % 2) === 0) {
            return { nrofpoules: nrOfTeams / 2, nrofwinners: nrOfTeams / 2 };
        }
        // if (nrOfTeams > 32) {
        //     const nrOfPoules = ((nrOfTeams % 5) === 0 ? nrOfTeams : (nrOfTeams + 5 - (nrOfTeams % 5))) / 5;
        //     return { nrofpoules: nrOfPoules, nrofwinners: nrOfPoules };
        // }
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
}
