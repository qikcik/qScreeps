import { ErrorMapper } from "env/ErrorMapper";
import {Logger} from "./util/logger";
import {GlobalConfig} from "./util/globalConfig";
import {CreepController} from "./creep/creepController";

GlobalConfig.initializeDefaults();
Logger.log("err","init")

export const loop = ErrorMapper.wrapLoop(() => {
  GlobalConfig.initializeDefaults();

  for(let creepName in Game.creeps)
  {
    let creep = Game.creeps[creepName];
    let controller = new CreepController(creep);
    controller.tick();

  }
});
