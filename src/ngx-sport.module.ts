import { NgModule } from '@angular/core';

import { APIConfig } from './api/config';
import { APIRepository } from './api/repository';
import { Association } from './association';
import { AssociationRepository } from './association/repository';
import { Competition } from './competition';
import { CompetitionMapper } from './competition/mapper';
import { CompetitionRepository } from './competition/repository';
import { Competitor } from './competitor';
import { CompetitorRepository } from './competitor/repository';
import { ExternalObject } from './external/object';
import { ExternalObjectRepository } from './external/object/repository';
import { ExternalSystem } from './external/system';
import { ExternalSystemBetFair } from './external/system/betfair';
import { ExternalSystemMapper } from './external/system/mapper';
import { ExternalSystemRepository } from './external/system/repository';
import { Field } from './field';
import { FieldRepository } from './field/repository';
import { Game } from './game';
import { GamePlace } from './game/place';
import { GameRepository } from './game/repository';
import { GameScore } from './game/score';
import { League } from './league';
import { LeagueRepository } from './league/repository';
import { NameService } from './nameservice';
import { Place } from './place';
import { PlaceLocation } from './place/location';
import { PlaceRepository } from './place/repository';
import { PlanningConfig } from './planning/config';
import { PlanningConfigMapper } from './planning/config/mapper';
import { PlanningConfigRepository } from './planning/config/repository';
import { PlanningConfigService } from './planning/config/service';
import { PlanningRepository } from './planning/repository';
import { PlanningService } from './planning/service';
import { Poule } from './poule';
import { HorizontalPoule } from './poule/horizontal';
import { QualifyGroup } from './qualify/group';
import { QualifyRuleMultiple } from './qualify/rule/multiple';
import { QualifyRuleSingle } from './qualify/rule/single';
import { QualifyService } from './qualify/service';
import { EndRankingService } from './ranking/end/service';
import { RankedRoundItem } from './ranking/item';
import { RankingService } from './ranking/service';
import { Referee } from './referee';
import { RefereeRepository } from './referee/repository';
import { Round } from './round';
import { RoundNumber } from './round/number';
import { RoundRepository } from './round/repository';
import { Season } from './season';
import { SeasonRepository } from './season/repository';
import { SportConfig } from './sport/config';
import { SportConfigMapper } from './sport/config/mapper';
import { SportConfigRepository } from './sport/config/repository';
import { SportConfigService } from './sport/config/service';
import { SportMapper } from './sport/mapper';
import { SportPlanningConfigMapper } from './sport/planningconfig/mapper';
import { SportPlanningConfigService } from './sport/planningconfig/service';
import { SportScoreConfig } from './sport/scoreconfig';
import { SportScoreConfigService } from './sport/scoreconfig/service';
import { Structure } from './structure';
import { StructureRepository } from './structure/repository';
import { StructureService } from './structure/service';

@NgModule({
    imports: [
        AssociationRepository, LeagueRepository, CompetitionRepository, FieldRepository, GameRepository,
        PlanningService, PlaceRepository, QualifyService, RefereeRepository,
        RoundRepository, SportConfigRepository, PlanningConfigRepository, PlanningConfigService,
        SportMapper,
        SeasonRepository, StructureRepository, StructureService, Structure,
        CompetitorRepository,
        PlanningRepository, NameService,
        ExternalObject, ExternalObjectRepository,
        ExternalSystem, ExternalSystemRepository, ExternalSystemBetFair, SportConfigMapper, PlanningConfigMapper
    ],
    exports: [
        Association, League, Competition, APIConfig, Field, Game, GameScore, GamePlace, HorizontalPoule,
        Poule, Place, PlaceLocation, QualifyGroup, RankingService, RankedRoundItem, EndRankingService, Referee, APIRepository,
        Round, RoundNumber, SportConfig, PlanningConfig, SportScoreConfig,
        Season, Competitor, QualifyRuleMultiple, QualifyRuleSingle,
        CompetitionMapper,
        AssociationRepository, LeagueRepository, CompetitionRepository, FieldRepository, GameRepository,
        PlanningService, PlaceRepository, QualifyService, RefereeRepository, RoundRepository,
        SportConfigRepository, PlanningConfigRepository, PlanningConfigService, PlanningConfigRepository,
        SeasonRepository, StructureRepository, StructureService,
        SportMapper, SportConfigMapper, SportPlanningConfigMapper,
        SportConfigService, SportPlanningConfigService, SportScoreConfigService,
        CompetitorRepository,
        PlanningRepository, NameService,
        ExternalObject, ExternalObjectRepository,
        ExternalSystem, ExternalSystemMapper, ExternalSystemRepository, ExternalSystemBetFair
    ]
})
export class SportModule { }
