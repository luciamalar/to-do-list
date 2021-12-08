import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany, ManyToOne } from "typeorm";
import { Item } from "./Item";
import { User } from "./User";

@Entity({ name: "list" })
export class List {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    title: string;

    @ManyToMany(type => User, author => author.lists)
    author: Promise<User>;

    @OneToMany(() => Item, (item: Item) => item.list)
    items: Promise<Item[]>

}