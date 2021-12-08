import { userInfo } from "os";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { List } from "./List";

@Entity({ name: "user" })
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @ManyToMany(() => List, {
        cascade: true
    })
    @JoinTable()
    lists: Promise<List[]>;

}
