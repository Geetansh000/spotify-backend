import { classToPlain } from 'class-transformer';

export class JSONDto {
  toJSON() {
    return classToPlain(this);
  }
}
