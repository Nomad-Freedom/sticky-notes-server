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

  update(id: number, updateNoteDto: UpdateNoteDto) {
    return `This action updates a #${id} note`;
  }

  remove(id: number) {
    return `This action removes a #${id} note`;
  }
}
