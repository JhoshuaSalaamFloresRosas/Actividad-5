import { PartialType } from '@nestjs/mapped-types';
import { CreateAddressDto } from './create-address.dto';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {
    street :  string 
    outNum? : string
    intNum? : string 
    zipCode? : string 
    clientId? : number
    locationId? : number
}
