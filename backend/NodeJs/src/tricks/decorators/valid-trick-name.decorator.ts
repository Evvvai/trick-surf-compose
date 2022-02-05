import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { SuggestedTricks } from 'src/shared/entities/SuggestedTricks';
import { Repository } from 'typeorm';
import { TricksService } from '../service/tricks.service';

export function IsTrickNameValid(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsTrickNameValid',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: IsValidTrickNameConstraint,
    });
  };
}

@ValidatorConstraint()
@Injectable()
export class IsValidTrickNameConstraint
  implements ValidatorConstraintInterface
{
  constructor(protected readonly tricksService: TricksService) {}

  async validate(value: string, args: ValidationArguments) {
    // try {
    //   await this.tricksService.getTrickByName(value);
    // } catch (e) {
    //   console.log('bbb');
    //   try {
    //     console.log('ddd');
    //     const gg = await this.tricksService.getSuggestedTrickByName(value);

    //     console.log('aaa');

    //     return false;
    //   } catch (e) {
    //     return true;
    //   }
    // }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Such name is already used`;
  }
}
