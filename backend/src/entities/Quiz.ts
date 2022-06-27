import { Field, Int, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class Quiz extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => String)
    @Column()
    category!: string;

    @Field()
    @ManyToOne(() => User, (user) => user.quizzes)
    creator: User;

    @Field(() => String)
    @Column()
    title!: string;

    @Field(() => String)
    @Column()
    description!: string;

    // from value update will be the result of user votes
    @Field(() => Int)
    @Column({ type: "int", default: 0 })
    points!: number;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt = new Date();
}
