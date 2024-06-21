import { AbstractDto } from '../../../../../common/dto/abstract.dto';
import { StringField } from '../../../../../decorators';
import { ProStrengthEntity } from '../../entities/pro-strength.entity';

export class ProStrengthDto extends AbstractDto {
  @StringField()
  name: string;

  constructor(proStrength: ProStrengthEntity) {
    super(proStrength);
    this.name = proStrength.name;
  }
}
