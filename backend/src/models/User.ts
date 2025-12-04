import { BelongsToMany, Column, HasMany } from "sequelize-typescript";
import { Default } from "sequelize-typescript";
import { Index } from "sequelize-typescript";
import { AllowNull } from "sequelize-typescript";
import { DataType } from "sequelize-typescript";
import { PrimaryKey } from "sequelize-typescript";
import { Model, Table } from "sequelize-typescript";
import Vacation from "./Vacation";
import Like from "./Like";

@Table({
    underscored: true
})
export default class User extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id: string

    @AllowNull(false)
    @Column(DataType.STRING(30))
    firstName: string

    @AllowNull(false)
    @Column(DataType.STRING(30))
    lastName: string

    @AllowNull(false)
    @Index({ unique: true })
    @Column(DataType.STRING)
    email: string

    @AllowNull(false)
    @Column(DataType.STRING)
    password: string

    @AllowNull(true)
    @Column({
        type: DataType.ENUM('user', 'admin'),
        defaultValue: 'user'
    })
    role: 'user' | 'admin'

    @BelongsToMany(() => Vacation, () => Like)
    likedVacations: Vacation[]

    @HasMany(() => Like)
    likes: Like[]
}