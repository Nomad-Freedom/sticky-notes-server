import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateNoteDto } from './dto/create-note.dto';
import { Note } from './entities/note.entity';

@EntityRepository(Note)
export class NotesRepository extends Repository<Note> {
  async createNote(createNoteDto: CreateNoteDto): Promise<Note> {
    const { title, description, color } = createNoteDto;
    const note = this.create({ title, description, color });
    try {
      await this.save(note);
      return note;
    } catch (error) {
      throw new InternalServerErrorException('note could not be saved');
    }
  }
}
