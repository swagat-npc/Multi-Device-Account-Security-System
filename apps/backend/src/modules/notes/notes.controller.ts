import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto, UpdateNoteDto, NoteAccessDto } from './dto/note.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  findAll() {
    return this.notesService.findAll();
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notesService.findOne(id);
  }

  @Post()
  create(@Body() note: CreateNoteDto) {
    return this.notesService.create(note);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() note: UpdateNoteDto) {
    return this.notesService.update(id, note);
  }
  
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.notesService.delete(id);
  }

  @Post(':id/access')
  share(@Param('id') id: string, @Body() shareData: NoteAccessDto) {
    return this.notesService.share(id, shareData);
  }

  @Get(':id/access')
  getAccess(@Param('id') id: string) {
    return this.notesService.getAccess(id);
  }
}