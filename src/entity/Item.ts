import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { List } from "./List";

export type StatusType = "active" | "done" | "cancelled";

@Entity({ name: "item" })
export class Item {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 100,
        nullable: false
    })
    title: string;

    @Column("text")
    description: string;

    @Column({ nullable: false })
    deadline: Date;

    @Column({
        type: "enum",
        enum: ["active", "done", "cancelled"],
        default: "active"
    })
    status: string;

    @ManyToOne(() => List, (list: List) => list.items, {
        cascade: true
    })
    list: Promise<List>

}