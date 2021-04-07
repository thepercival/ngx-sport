import { Place } from '../../place';
import { Round } from '../../qualify/group';
import { QualifyTarget } from '../../qualify/target';
import { HorizontalPoule } from '../horizontal';

export class HorizontalPouleCreator {

    remove(...rounds: (Round | undefined)[]) {
        rounds.forEach((round: Round | undefined) => {
            if (round === undefined) {
                return;
            }
            [QualifyTarget.Winners, QualifyTarget.Losers].forEach((target: QualifyTarget) => {
                this.removeRound(round, target);
            });
        });
    }

    protected removeRound(round: Round, target: QualifyTarget) {
        const horizontalPoules = round.getHorizontalPoules(target);
        while (horizontalPoules.length > 0) {
            horizontalPoules.pop()
        }
    }

    create(...rounds: (Round | undefined)[]) {
        rounds.forEach((round: Round | undefined) => {
            if (round === undefined) {
                return;
            }
            [QualifyTarget.Winners, QualifyTarget.Losers].forEach((target: QualifyTarget) => {
                this.createRoundHorizontalPoules(round, target);
            });
        });
    }

    protected createRoundHorizontalPoules(round: Round, qualifyTarget: QualifyTarget): HorizontalPoule[] {
        const horizontalPoules = round.getHorizontalPoules(qualifyTarget);

        const placesHorizontalOrdered = this.getPlacesHorizontal(round);
        if (qualifyTarget === QualifyTarget.Losers) {
            placesHorizontalOrdered.reverse();
        }

        const nrOfPoules = round.getPoules().length;
        let horPlaces = placesHorizontalOrdered.splice(0, nrOfPoules);
        let previous: HorizontalPoule | undefined;
        while (horPlaces.length > 0) {
            previous = new HorizontalPoule(round, qualifyTarget, previous, horPlaces);
            horPlaces = placesHorizontalOrdered.splice(0, nrOfPoules);
        }
        return horizontalPoules;
    }

    protected getPlacesHorizontal(round: Round): Place[] {
        let places: Place[] = [];
        round.getPoules().forEach((poule) => {
            places = places.concat(poule.getPlaces());
        });
        places.sort((placeA, placeB) => {
            if (placeA.getNumber() > placeB.getNumber()) {
                return 1;
            }
            if (placeA.getNumber() < placeB.getNumber()) {
                return -1;
            }
            if (placeA.getPoule().getNumber() > placeB.getPoule().getNumber()) {
                return 1;
            }
            if (placeA.getPoule().getNumber() < placeB.getPoule().getNumber()) {
                return -1;
            }
            return 0;
        });
        return places;
    }
}
