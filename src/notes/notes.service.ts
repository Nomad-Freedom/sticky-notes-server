import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './entities/note.entity';
import { NotesRepository } from './notes.repository';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(NotesRepository)
    private notesRepository: NotesRepository,
  ) {}
  create(createNoteDto: CreateNoteDto): Promise<Note> {
    return this.notesRepository.createNote(createNoteDto);
  }

  async findAll(): Promise<Note[]> {
    try {
      const notes = await this.notesRepository.find({});

      return notes;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: string): Promise<Note> {
    const note = await this.notesRepository.findOne({ id }).catch((_error) => {
      throw new InternalServerErrorException();
    });

    if (!note) {
      throw new NotFoundException('the node with this id does not exits');
    }
    return note;
  }

  async update(id: string, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const { title, description } = updateNoteDto;
    const note = await this.findOne(id);
    if (title) {
      note.title = title;
    }
    if (description) {
      note.description = description;
    }
    await this.notesRepository.save(note);

    return note;
  }

  async remove(id: string): Promise<void> {
    const result = await this.notesRepository.delete(id).catch((_error) => {
      throw new InternalServerErrorException();
    });
    if (result.affected === 0) {
      throw new NotFoundException('the node with this id does not exits');
    }
  }
}
