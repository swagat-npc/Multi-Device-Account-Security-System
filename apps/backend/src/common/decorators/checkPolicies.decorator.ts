import { SetMetadata } from "@nestjs/common";
import { PolicyHandler } from "../types/policy.types";

export const CHECK_POLICIES = "check_policies";

export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES, handlers);