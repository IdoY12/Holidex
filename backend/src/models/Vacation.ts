import { AllowNull, BelongsToMany, Column, DataType, Default, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import User from "./User";
import Like from "./Like";

@Table({
    underscored: true
})
export default class Vacation extends Model {

    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id: string

    @AllowNull(false)
    @Column(DataType.STRING)
    destination: string

    @AllowNull(false)
    @Column(DataType.TEXT)
    description: string

    @AllowNull(false)
    @Column(DataType.DATEONLY)
    startDate: string

    @AllowNull(false)
    @Column(DataType.DATEONLY)
    endDate: string

    @AllowNull(false)
    @Column(DataType.DECIMAL(10,2))
    price: number

    @AllowNull(false)
    @Column(DataType.STRING)
    imageUrl: string

    @BelongsToMany(() => User, () => Like)
    likedBy: User[];

    @HasMany(() => Like)
    likes: Like[];
}