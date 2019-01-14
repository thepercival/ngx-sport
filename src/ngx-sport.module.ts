import { NgModule } from '@angular/core';

import { Association } from './association';
import { AssociationRepository } from './association/repository';
import { Competition } from './competition';
import { CompetitionRepository } from './competition/repository';
import { CompetitionMapper } from './competition/mapper';
import { SportConfig } from './config';
import { ExternalObject } from './external/object';
import { ExternalObjectRepository } from './external/object/repository';
import { ExternalSystem } from './external/system';
import { ExternalSystemMapper } from './external/system/mapper';
import { ExternalSystemBetFair } from './external/system/betfair';
import { ExternalSystemRepository } from './external/system/repository';
import { Field } from './field';
import { FieldRepository } from './field/repository';
import { Game } from './game';
import { GameRepository } from './game/repository';
import { GameScore } from './game/score';
import { League } from './league';
import { LeagueRepository } from './league/repository';
import { PlanningRepository } from './planning/repository';
import { PlanningService } from './planning/service';
import { Poule } from './poule';
import { PoulePlace } from './pouleplace';
import { PoulePlaceRepository } from './pouleplace/repository';
import { QualifyRuleRepository } from './qualify/repository';
import { QualifyRule } from './qualify/rule';
import { QualifyService } from './qualify/service';
import { Ranking } from './ranking';
import { EndRanking } from './ranking/end';
import { RankingItem } from './ranking/item';
import { Referee } from './referee';
import { RefereeRepository } from './referee/repository';
import { SportRepository } from './repository';
import { Round } from './round';
import { RoundNumber } from './round/number';
import { RoundNumberConfig } from './round/number/config';
import { RoundNumberConfigRepository } from './round/number/config/repository';
import { RoundNumberConfigScore } from './round/number/config/score';
import { RoundNumberConfigService } from './round/number/config/service';
import { RoundRepository } from './round/repository';
import { Season } from './season';
import { SeasonRepository } from './season/repository';
import { Structure } from './structure';
import { NameService } from './nameservice';
import { StructureRepository } from './structure/repository';
import { StructureService } from './structure/service';
import { Team } from './team';
import { TeamRepository } from './team/repository';
import { JsonTeam } from './team/mapper';
import { RoundNumberConfigMapper } from './round/number/config/mapper';

@NgModule({
    imports: [
        AssociationRepository, LeagueRepository, CompetitionRepository, FieldRepository, GameRepository,
        PlanningService, PoulePlaceRepository, QualifyRuleRepository, QualifyService, RefereeRepository,
        RoundRepository, RoundNumberConfigRepository, RoundNumberConfigService,
        SeasonRepository, StructureRepository, StructureService, Structure,
        TeamRepository,
        PlanningRepository, NameService,
        ExternalObject, ExternalObjectRepository,
        ExternalSystem, ExternalSystemRepository, ExternalSystemBetFair, RoundNumberConfigMapper
    ],
    exports: [
        Association, League, Competition, SportConfig, Field, Game, GameScore,
        Poule, PoulePlace, QualifyRule, Ranking, RankingItem, EndRanking, Referee, SportRepository,
        Round, RoundNumber, RoundNumberConfig, RoundNumberConfigScore,
        Season, Team,
        CompetitionMapper,
        AssociationRepository, LeagueRepository, CompetitionRepository, FieldRepository, GameRepository,
        PlanningService, PoulePlaceRepository, QualifyRuleRepository, QualifyService, RefereeRepository, RoundRepository,
        RoundNumberConfigRepository, RoundNumberConfigService,
        SeasonRepository, StructureRepository, StructureService,
        TeamRepository,
        PlanningRepository, NameService,
        ExternalObject, ExternalObjectRepository,
        ExternalSystem, ExternalSystemMapper, ExternalSystemRepository, ExternalSystemBetFair
    ]
})
export class SportModule {}
