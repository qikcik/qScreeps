import {GlobalConfig} from "./globalConfig";
import {ErrorMapper} from "../env/ErrorMapper";

declare module "util/globalConfig" {
  interface GlobalConfigMem {
    readonly logger: {
      enableTraces: boolean
      minSeverity: LogSeverity
    }
  }
}
GlobalConfig.extendDefaults({
  logger: {
    enableTraces: true,
    minSeverity: "inf"
  }
});

export type LogSeverity = "inf" | "wrn" | "err" | "notImpl";

function scoreSeverity(severity:LogSeverity) : number
{
  switch (severity)
  {
    case "inf":
      return 1;
    case "wrn":
      return 2;
    case "err":
      return 3;
    case "notImpl":
      return 4;
  }
}

function colorForLogSeverity(severity:LogSeverity) : string
{
  switch (severity)
  {
    case "inf":
      return "palegoldenrod";
    case "wrn":
      return "darkorange";
    case "err":
      return "orangered";
    case "notImpl":
      return "rebeccapurple";
  }
}


export class Logger {

  public static log(severity:LogSeverity,desc:string)
  {
    if(scoreSeverity(severity) < scoreSeverity(GlobalConfig.get().logger.minSeverity))
      return;

    let result:string = "";
      if(GlobalConfig.get().logger.enableTraces)
      {
        let trace = ErrorMapper.sourceMappedCurrentFileAndLine(1);
        result += `<span style="min-width: 20rem">`
          result += `<span style="color:deepskyblue">[${trace.file.split('.')[0]}</span>`;
          result += `<span style="color:lightskyblue">:${trace.line}</span>`;
          result += `<span style="color:deepskyblue">]</span>`;
        result += `</span> `
      }
      result += `<span style="color:${colorForLogSeverity(severity)}; min-width: 40rem">`
        result += desc
      result += `</span>`

    console.log(result);
  }
}
