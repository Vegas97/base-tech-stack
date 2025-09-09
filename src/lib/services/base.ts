// Re-export separated client and server services
export { BaseClientService } from "./base/client";
export { BaseServerService } from "./base/server";
export { BaseUtils } from "./base/utils";
export type { ServiceContext, ServiceError } from "./base/utils";

// Default export with nested structure for backward compatibility
import { BaseClientService } from "./base/client";
import { BaseServerService } from "./base/server";

const BaseService = {
  clientSide: BaseClientService,
  serverSide: BaseServerService,
};

export default BaseService;
