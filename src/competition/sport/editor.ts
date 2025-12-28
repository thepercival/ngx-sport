import { Injectable } from '@angular/core';

import { Structure } from '../../structure';

import { ScoreConfigService } from '../../score/config/service';
import { CompetitionSport } from '../sport';
import { GameAmountConfigService } from '../../planning/gameAmountConfig/service';
import { AgainstQualifyConfigService } from '../../qualify/againstConfig/service';
import { AgainstH2h } from '../../sport/variant/against/h2h';
import { GameAmountConfig } from '../../planning/gameAmountConfig';
import { Round } from '../../qualify/group';
import { Category } from '../../category';

@Injectable({
    providedIn: 'root'
})
export class CompetitionSportEditor {
    constructor(
        private scoreConfigService: ScoreConfigService,
        private gameAmountConfigService: GameAmountConfigService,
        private againstQualifyConfigService: AgainstQualifyConfigService/*,
        competitionSportMapper: CompetitionSportMapper,
        sportMapper: SportMapper,*/
    ) {
        this.scoreConfigService = scoreConfigService;
        this.gameAmountConfigService = gameAmountConfigService;
        this.againstQualifyConfigService = againstQualifyConfigService;
        // this.competitionSportMapper = competitionSportMapper;
        // this.sportMapper = sportMapper;
    }

   
    // createDefault(sport: Sport, competition: Competition, structure?: Structure): CompetitionSport {
    //     const config = this.competitionSportMapper.toObject(this.createDefaultJson(sport, []), competition);
    //     if (structure) {
    //         this.addToStructure(config, structure);
    //     }
    //     return config;
    // }

    // copy(sourceConfig: SportConfig, competition: Competition): SportConfig {
    //     const newConfig = new SportConfig(sourceConfig.getSport(), competition);

    //     newConfig.setNrOfGamePlaces(sourceConfig.getNrOfGamePlaces());
    //     return newConfig;
    // }

    addToStructure(competitionSport: CompetitionSport, structure: Structure) {

        const variant = competitionSport.getVariant();
        const amount = (variant instanceof AgainstH2h) ? variant.getNrOfH2H() : variant.getNrOfGamesPerPlace();
        new GameAmountConfig(competitionSport, structure.getFirstRoundNumber(), amount);

        let previousCategory = undefined;
        structure.getCategories().forEach((category: Category) => {
            this.addToCategory(competitionSport, category, previousCategory);
            previousCategory = category;
        });
    }

    addToCategory(competitionSport: CompetitionSport, category: Category, previousCategory: Category|undefined) {

        // const variant = competitionSport.getVariant();
        // const amount = (variant instanceof AgainstH2h) ? variant.getNrOfH2H() : variant.getNrOfGamesPerPlace();
        // new GameAmountConfig(competitionSport, structure.getFirstRoundNumber(), amount);
        const rootRound = category.getRootRound();
        
        this.scoreConfigService.createDefault(competitionSport, rootRound);

        if( previousCategory !== undefined){
            const previousRootRound = previousCategory.getRootRound();
            const previousQualifyConfig = previousRootRound.getValidAgainstQualifyConfig(competitionSport);
            this.againstQualifyConfigService.createByPrevious(previousQualifyConfig, competitionSport, rootRound);
        } else {            
            this.againstQualifyConfigService.createFirst(competitionSport, rootRound);
        }
    }

    removeFromStructure(competitionSport: CompetitionSport, structure: Structure) {
        this.gameAmountConfigService.removeFromRoundNumber(competitionSport, structure.getFirstRoundNumber());
        structure.getRootRounds().forEach((rootRound: Round) => {
            this.scoreConfigService.removeFromRound(competitionSport, rootRound);
            this.againstQualifyConfigService.removeFromRound(competitionSport, rootRound);
        });

    }

}
