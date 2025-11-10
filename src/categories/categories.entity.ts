import { Task } from "src/tasks/task.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    description?: string

    @OneToMany(() => Task, (task) => task.category, { cascade: false })
    tasks: Task[]

    @ManyToOne(() => User, (user) => user.categories, { onDelete: 'CASCADE' })
    user: User;

}