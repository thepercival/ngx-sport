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
import { CountConfig } from './config/count';
import { PlanningConfig } from './config/planning';
import { PlanningConfigMapper } from './config/planning/mapper';
import { PlanningConfigRepository } from './config/planning/repository';
import { PlanningConfigService } from './config/planning/service';
import { CountConfigMapper } from './config/count/mapper';
import { CountConfigRepository } from './config/count/repository';
import { ConfigScore } from './config/count/score';
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
        RoundRepository, CountConfigRepository, PlanningConfigRepository, PlanningConfigService,
        SeasonRepository, StructureRepository, StructureService, Structure,
        CompetitorRepository,
        PlanningRepository, NameService,
        ExternalObject, ExternalObjectRepository,
        ExternalSystem, ExternalSystemRepository, ExternalSystemBetFair, CountConfigMapper, PlanningConfigMapper
    ],
    exports: [
        Association, League, Competition, APIConfig, Field, Game, GameScore, GamePlace, HorizontalPoule,
        Poule, Place, PlaceLocation, QualifyGroup, RankingService, RankedRoundItem, EndRankingService, Referee, SportRepository,
        Round, RoundNumber, CountConfig, PlanningConfig, ConfigScore,
        Season, Competitor, QualifyRuleMultiple, QualifyRuleSingle,
        CompetitionMapper,
        AssociationRepository, LeagueRepository, CompetitionRepository, FieldRepository, GameRepository,
        PlanningService, PlaceRepository, QualifyService, RefereeRepository, RoundRepository,
        CountConfigRepository, PlanningConfigRepository, PlanningConfigService,
        SeasonRepository, StructureRepository, StructureService,
        CompetitorRepository,
        PlanningRepository, NameService,
        ExternalObject, ExternalObjectRepository,
        ExternalSystem, ExternalSystemMapper, ExternalSystemRepository, ExternalSystemBetFair
    ]
})
export class SportModule { }
