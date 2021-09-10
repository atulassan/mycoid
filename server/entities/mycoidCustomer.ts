import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { MycoidCustomerFamily } from "./mycoidCustomerFamily";


@Entity("mycoid_customer", { schema: "mycoid" })
export class MycoidCustomer extends BaseEntity {

    @PrimaryGeneratedColumn({
        type: "int",
        name: "customer_id"
    })
    public customerId: number;


    @Column("varchar", {
        nullable: false,
        name: "first_name"
    })
    public firstName: string;


    @Column("varchar", {
        nullable: false,
        name: "last_name"
    })
    public lastName: string;


    @Column("varchar", {
        nullable: false,
        name: "email"
    })
    public email: string;

    @Column("text", {
        nullable: false,
        name: "password"
    })
    public password: string;


    @Column("varchar", {
        nullable: false,
        length: 25,
        name: "mobile"
    })
    public mobile: string;


    @Column("text", {
        nullable: false,
        name: "address"
    })
    public address: string;


    @Column("varchar", {
        nullable: false,
        length: 10,
        name: "postcode"
    })
    public postcode: string;


    @Column("varchar", {
        nullable: false,
        length: 100,
        name: "city"
    })
    public city: string;


    @Column("varchar", {
        nullable: false,
        length: 100,
        name: "place"
    })
    public place: string;


    @Column("varchar", {
        nullable: false,
        length: 100,
        name: "country"
    })
    public country: string;


    @Column("text", {
        nullable: false,
        name: "image"
    })
    public image: string;


    @Column("datetime", {
        nullable: false,
        name: "created_datetime"
    })
    public createdDatetime: Date;


    @Column("int", {
        nullable: false,
        name: "createdby"
    })
    public createdby: number;


    @Column("datetime", {
        nullable: false,
        name: "modified_datetime"
    })
    public modifiedDatetime: Date;


    @Column("int", {
        nullable: false,
        name: "modifiedby"
    })
    public modifiedby: number;


    @Column("text", {
        nullable: false,
        name: "forgot_token"
    })
    public forgotToken: string;


    @Column("text", {
        nullable: false,
        name: "verification_token"
    })
    public verificationToken: string;


    @Column("int", {
        nullable: false,
        name: "status"
    })
    public status: number;
    
    @OneToMany(type=>MycoidCustomerFamily, mycoid_customer_family=>mycoid_customer_family.mycoid_customer,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'customer_id' })
    public mycoidCustomerFamilys:MycoidCustomerFamily[];
}
