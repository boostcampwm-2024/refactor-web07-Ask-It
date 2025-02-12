import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'ContentLengthValidator', async: false })
export class ContentLengthValidator implements ValidatorConstraintInterface {
  getContentBodyLength = (body: string) => {
    const regex = /!?\[(\w+)\]\([^)]+\)/g;
    const matches = (body.match(regex) || []) as RegExpMatchArray;

    return matches.reduce((length, match) => {
      const textContent = /\[(\w+)\]/.exec(match)?.[1] || '';
      return length - match.trim().length + textContent.trim().length;
    }, body.trim().length);
  };

  isValidBodyLength = (body: number, restrictNumber: number) => {
    return body > 0 && body <= restrictNumber;
  };

  validate(body: string, args: ValidationArguments) {
    const maxLength = args.constraints[0] || 500;
    const length = this.getContentBodyLength(body);
    return this.isValidBodyLength(length, maxLength);
  }

  defaultMessage(args: ValidationArguments) {
    const maxLength = args.constraints[0] || 500;
    return `본문 글자 수는 1~${maxLength}자 사이여야 합니다.`;
  }
}
