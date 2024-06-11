import { PartialType } from '@nestjs/mapped-types';
import { CreateClientDto } from './create-client.dto';

export class UpdateClientDto extends PartialType(CreateClientDto) {
    name:  string;
    lastName:  string;
    RFC?:  string;
    email?:  string;
    phone?:  string;
    status: boolean
}
