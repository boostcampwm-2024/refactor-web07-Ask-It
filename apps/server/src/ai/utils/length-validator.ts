import { BadRequestException } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'ContentLengthValidator', async: false })
export class ContentLengthValidator implements ValidatorConstraintInterface {
  static getContentBodyLength(body: string) {
    if (typeof body !== 'string') throw new BadRequestException('요청 본문에 누락된 부분이 있습니다.');
    const regex = /!?\[(\w+)\]\([^)]+\)/g;
    const matches = (body.match(regex) || []) as RegExpMatchArray;

    return matches.reduce((length, match) => {
      const textContent = /\[(\w+)\]/.exec(match)?.[1] || '';
      return length - match.trim().length + textContent.trim().length;
    }, body.trim().length);
  }

  static isValidBodyLength(body: number, restrictNumber: number, minNumber: number) {
    return body >= minNumber && body <= restrictNumber;
  }

  validate(body: string, args: ValidationArguments) {
    const maxLength = args.constraints[0] ?? 500;
    const minLength = args.constraints[1] ?? 1;
    const length = ContentLengthValidator.getContentBodyLength(body);
    return ContentLengthValidator.isValidBodyLength(length, maxLength, minLength);
  }

  defaultMessage(args: ValidationArguments) {
    const maxLength = args.constraints[0] ?? 500;
    const minLength = args.constraints[1] ?? 1;
    return `본문 글자 수는 ${minLength}~${maxLength}자 사이여야 합니다.`;
  }
}
