import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto, UpdateNoteDto, NoteAccessDto } from './dto/note.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/currentuser.decorator';
import { PoliciesGuard } from '../../common/guards/policies.guard';
import { CheckPolicies } from '../../common/decorators/checkPolicies.decorator';
import { canViewNote } from './policies/notes.policies';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() note: CreateNoteDto, @CurrentUser() user: any) {
    return this.notesService.create(note, user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findMyNotes(@CurrentUser() user: any) {
    return this.notesService.findAll(user.sub);
  }

  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(canViewNote)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.notesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() note: UpdateNoteDto, @CurrentUser() user: any) {
    return this.notesService.update(id, note, user.sub);
  }
  
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.notesService.delete(id, user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/access')
  share(@Param('id') id: string, @Body() shareData: NoteAccessDto, @CurrentUser() user: any) {
    return this.notesService.share(id, user.sub, shareData);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/access')
  getAccess(@Param('id') id: string) {
    return this.notesService.getAccess(id);
  }
}