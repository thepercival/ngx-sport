import { NgModule } from '@angular/core';

import { Association } from './association';
import { AssociationRepository } from './association/repository';
import { Competition } from './competition';
import { CompetitionMapper } from './competition/mapper';
import { CompetitionRepository } from './competition/repository';
import { Competitor } from './competitor';
import { CompetitorRepository } from './competitor/repository';
import { APIConfig } from './apiconfig';
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
import { PlaceLocation } from './place/location';
import { PlanningRepository } from './planning/repository';
import { PlanningService } from './planning/service';
import { Poule } from './poule';
import { HorizontalPoule } from './poule/horizontal';
import { Place } from './place';
import { PlaceRepository } from './place/repository';
import { QualifyGroup } from './qualify/group';
import { QualifyRuleMultiple } from './qualify/rule/multiple';
import { QualifyRuleSingle } from './qualify/rule/single';
import { QualifyService } from './qualify/service';
import { EndRankingService } from './ranking/end/service';
import { RankedRoundItem } from './ranking/item';
import { RankingService } from './ranking/service';
import { Referee } from './referee';
import { RefereeRepository } from './referee/repository';
import { SportRepository } from './repository';
import { Round } from './round';
import { RoundNumber } from './round/number';
import { SportConfig } from './sport/config';
import { PlanningConfig } from './planning/config';
import { PlanningConfigMapper } from './planning/config/mapper';
import { PlanningConfigRepository } from './planning/config/repository';
import { PlanningConfigService } from './planning/config/service';
import { SportConfigMapper } from './sport/config/mapper';
import { SportConfigRepository } from './sport/config/repository';
import { SportConfigScore } from './sport/config/score';
import { RoundRepository } from './round/repository';
import { Season } from './season';
import { SeasonRepository } from './season/repository';
import { Structure } from './structure';
import { StructureRepository } from './structure/repository';
import { StructureService } from './structure/service';

@NgModule({
    imports: [
        AssociationRepository, LeagueRepository, CompetitionRepository, FieldRepository, GameRepository,
        PlanningService, PlaceRepository, QualifyService, RefereeRepository,
        RoundRepository, SportConfigRepository, PlanningConfigRepository, PlanningConfigService,
        SeasonRepository, StructureRepository, StructureService, Structure,
        CompetitorRepository,
        PlanningRepository, NameService,
        ExternalObject, ExternalObjectRepository,
        ExternalSystem, ExternalSystemRepository, ExternalSystemBetFair, SportConfigMapper, PlanningConfigMapper
    ],
    exports: [
        Association, League, Competition, APIConfig, Field, Game, GameScore, GamePlace, HorizontalPoule,
        Poule, Place, PlaceLocation, QualifyGroup, RankingService, RankedRoundItem, EndRankingService, Referee, SportRepository,
        Round, RoundNumber, SportConfig, PlanningConfig, SportConfigScore,
        Season, Competitor, QualifyRuleMultiple, QualifyRuleSingle,
        CompetitionMapper,
        AssociationRepository, LeagueRepository, CompetitionRepository, FieldRepository, GameRepository,
        PlanningService, PlaceRepository, QualifyService, RefereeRepository, RoundRepository,
        SportConfigRepository, PlanningConfigRepository, PlanningConfigService,
        SeasonRepository, StructureRepository, StructureService,
        CompetitorRepository,
        PlanningRepository, NameService,
        ExternalObject, ExternalObjectRepository,
        ExternalSystem, ExternalSystemMapper, ExternalSystemRepository, ExternalSystemBetFair
    ]
})
export class SportModule { }
