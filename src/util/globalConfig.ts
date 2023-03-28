/*
  EXAMPLE USAGE

  declare module "core/config" {
  interface GlobalConfigMem {
      readonly ModuleName: {
        readonly flag: boolean
      }
    }
  }
  GlobalConfig.extendDefaults({ ModuleName: { flag: false }});
*/

declare global {
  interface Memory {
    readonly config: GlobalConfigMem
  }
}

export interface GlobalConfigMem {

}
export class GlobalConfig {
  private static default:GlobalConfigMem = {} as GlobalConfigMem;
  static extendDefaults(extend: GlobalConfigMem) {
    _.defaultsDeep(this.default,extend)
  }

  static initializeDefaults() {
    _.defaultsDeep(Memory, {config: {}})
    _.defaultsDeep(Memory.config,this.default)
  }
  static get():GlobalConfigMem {
    return Memory.config;
  }
}
