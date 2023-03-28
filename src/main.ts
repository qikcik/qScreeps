import { ErrorMapper } from "env/ErrorMapper";
import {Logger} from "./util/logger";
import {GlobalConfig} from "./util/globalConfig";

GlobalConfig.initializeDefaults();
Logger.log("err","init")

export const loop = ErrorMapper.wrapLoop(() => {
  GlobalConfig.initializeDefaults();


  Logger.log("wrn","tick")
  Logger.log("inf","tick")
});
