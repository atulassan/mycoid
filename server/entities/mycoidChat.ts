import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId, CreateDateColumn } from "typeorm";


@Entity("mycoid_chat", { schema: "mycoid" })
export class MycoidChat extends BaseEntity {

    @PrimaryGeneratedColumn({
        type: "int",
        name: "id"
    })
    public id: number;

    @Column("int", {
        nullable: false,
        name: "sender_id"
    })
    public senderId: number;


    @Column("int", {
        nullable: false,
        name: "receiver_id"
    })
    public receiverId: number;



    @Column("int", {
        nullable: false,
        name: "seen"
    })
    public seen: number;


    @Column("text", {
        nullable: false,
        name: "sender_user_type"
    })
    public senderUserType: string;

    @Column("text", {
        nullable: false,
        name: "receiver_user_type"
    })
    public receiverUserType: string;

    @Column("text", {
        nullable: false,
        name: "message"
    })
    public message: string;

    // @Column("datetime",{ 
    //     nullable:false,
    //     name:"created_datetime"
    //     })
    // public createdDatetime:Date;
    @CreateDateColumn({ name: 'created_datetime', type: 'timestamp' })
    public createdDatetime: Date;

    @Column("int", {
        nullable: false,
        name: "status"
    })
    public status: number;





}
