import { Injectable } from '@nestjs/common';
import { CreateScholarshipDto } from './dto/create-scholarship.dto';
import { UpdateScholarshipDto } from './dto/update-scholarship.dto';
import { ScholarshipsRepository } from "./scholarships.repository";

@Injectable()
export class ScholarshipsService {
  constructor(private readonly scholarshipRepository: ScholarshipsRepository) {}


  create(createScholarshipDto: CreateScholarshipDto) {
    return this.scholarshipRepository.create();
  }

  findAll() {
    return this.scholarshipRepository.findAll();
  }

  findOne(id: number) {
    return this.scholarshipRepository.findOne();
  }

  update(id: number, updateScholarshipDto: UpdateScholarshipDto) {
    return this.scholarshipRepository.update();
  }

  remove(id: number) {
    return this.scholarshipRepository.remove();
  }
}
