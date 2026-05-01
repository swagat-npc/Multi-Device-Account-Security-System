import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto, UpdateNoteDto, NoteAccessDto } from './dto/note.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findMyNotes(@Req() req: any) {
    return this.notesService.findAll(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.notesService.findOne(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() note: CreateNoteDto, @Req() req: any) {
    return this.notesService.create(note, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() note: UpdateNoteDto, @Req() req: any) {
    return this.notesService.update(id, note, req.user.userId);
  }
  
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: any) {
    return this.notesService.delete(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/access')
  share(@Param('id') id: string, @Body() shareData: NoteAccessDto, @Req() req: any) {
    return this.notesService.share(id, req.user.userId, shareData);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/access')
  getAccess(@Param('id') id: string) {
    return this.notesService.getAccess(id);
  }
}