import { NgModule } from '@angular/core';

import { Association } from './association';
import { AssociationRepository } from './association/repository';
import { Competition } from './competition';
import { CompetitionRepository } from './competition/repository';
import { SportConfig } from './config';
import { ExternalObject } from './external/object';
import { ExternalObjectRepository } from './external/object/repository';
import { ExternalSystem } from './external/system';
import { ExternalSystemBetFair } from './external/system/betfair';
import { ExternalSystemRepository } from './external/system/repository';
import { Field } from './field';
import { FieldRepository } from './field/repository';
import { Game } from './game';
import { GameRepository } from './game/repository';
import { GameScore } from './game/score';
import { GameScoreRepository } from './game/score/repository';
import { League } from './league';
import { LeagueRepository } from './league/repository';
import { PlanningService } from './planning/service';
import { Poule } from './poule';
import { PouleRepository } from './poule/repository';
import { PoulePlace } from './pouleplace';
import { PoulePlaceRepository } from './pouleplace/repository';
import { QualifyRule } from './qualifyrule';
import { QualifyRuleRepository } from './qualifyrule/repository';
import { QualifyService } from './qualifyrule/service';
import { Ranking } from './ranking';
import { Referee } from './referee';
import { RefereeRepository } from './referee/repository';
import { SportRepository } from './repository';
import { Round } from './round';
import { RoundConfig } from './round/config';
import { RoundConfigRepository } from './round/config/repository';
import { RoundRepository } from './round/repository';
import { RoundScoreConfig } from './round/scoreconfig';
import { RoundScoreConfigRepository } from './round/scoreconfig/repository';
import { Season } from './season';
import { SeasonRepository } from './season/repository';
import { StructureRepository } from './structure/repository';
import { StructureService } from './structure/service';
import { Team } from './team';
import { TeamRepository } from './team/repository';

@NgModule({
    imports: [],
    declarations: [
        Association, League, Competition, SportConfig, Field, Game, GameScore,
        Poule, PoulePlace, QualifyRule, Ranking, Referee, SportRepository, Round, RoundConfig, RoundScoreConfig, Season, Team,
        AssociationRepository, LeagueRepository, CompetitionRepository, FieldRepository, GameRepository, GameScoreRepository,
        PlanningService, PouleRepository, PoulePlaceRepository, QualifyRuleRepository, QualifyService, RefereeRepository, RoundRepository,
        RoundConfigRepository, RoundScoreConfigRepository, SeasonRepository, StructureRepository, StructureService, TeamRepository,
        ExternalObject, ExternalObjectRepository,
        ExternalSystem, ExternalSystemRepository, ExternalSystemBetFair
    ],
    exports: [
        Association, League, Competition, SportConfig, Field, Game, GameScore,
        Poule, PoulePlace, QualifyRule, Ranking, Referee, SportRepository, Round, RoundConfig, RoundScoreConfig, Season, Team,
        AssociationRepository, LeagueRepository, CompetitionRepository, FieldRepository, GameRepository, GameScoreRepository,
        PlanningService, PouleRepository, PoulePlaceRepository, QualifyRuleRepository, QualifyService, RefereeRepository, RoundRepository,
        RoundConfigRepository, RoundScoreConfigRepository, SeasonRepository, StructureRepository, StructureService, TeamRepository,
        ExternalObject, ExternalObjectRepository,
        ExternalSystem, ExternalSystemRepository, ExternalSystemBetFair
    ]
})
export class SportModule { }
