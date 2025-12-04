import { AllowNull, BelongsTo, BelongsToMany, Column, DataType, Default, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import User from "./User";
import Vacation from "./Vacation";

@Table({
    underscored: true
})
export default class Like extends Model {
    @PrimaryKey
    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    userId: string;

    @BelongsTo(() => User)
    user: User;

    @PrimaryKey
    @ForeignKey(() => Vacation)
    @Column({
        type: DataType.UUID,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    vacationId: string;

    @BelongsTo(() => Vacation)
    vacation: Vacation;
}