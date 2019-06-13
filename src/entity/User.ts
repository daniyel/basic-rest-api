import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn } from 'typeorm';
import { Property, Minimum, JsonProperty, Email, Format, Required } from '@tsed/common';
import { Schema } from '@tsed/swagger';

@Entity()
@Schema({title: 'User'})
export class User extends BaseEntity {

    @Property()
    @PrimaryGeneratedColumn()
    id?: number;

    @Property()
    @Column()
    @Email()
    @JsonProperty()
    @Required()
    email: string;

    @Property()
    @Column()
    @JsonProperty()
    @Required()
    givenName: string;

    @Property()
    @Column()
    @JsonProperty()
    @Required()
    familyName: string;

    @Property()
    @CreateDateColumn()
    @JsonProperty()
    @Format('date-time')
    created?: Date;
}
