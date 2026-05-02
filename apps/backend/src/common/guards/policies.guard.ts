import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CHECK_POLICIES } from "../decorators/checkPolicies.decorator";
import { Reflector } from "@nestjs/core";
import { PolicyHandler } from "../types/policy.types";
import { NotesService } from "../../modules/notes/notes.service";

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private notesService: NotesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES,
        context.getHandler(),
      ) || [];

    if (!handlers || handlers.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const noteId = request.params.id;
    const note = await this.notesService.findOne(noteId);

    if (!note) {
      throw new NotFoundException(`Note with ID ${noteId} not found`);
    }

    request.resource = note; // Attach the note to the request for policy handlers to access
    
    const allowed = handlers.every((handler) => handler(user, note));

    if (!allowed) {
      throw new ForbiddenException("Access denied by policies guard");
    }

    return true;
  }
}
