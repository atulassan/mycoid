import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { MycoidCustomer } from './mycoidCustomer'
import { MycoidBranch } from './mycoidBranch'
import { MycoidBranchusers } from './mycoidBranchusers'

@Entity("mycoid_visitor", { schema: "mycoid" })
// @Index("user_id",["user",])
// @Index("user_id_2",["user",])
// @Index("branch_id",["branch",])
// @Index("branch_id_2",["branch",])
// @Index("customer_id",["customer",])
// @Index("customer_id_2",["customer",])
export class MycoidVisitor extends BaseEntity {

    @PrimaryGeneratedColumn({
        type: "int",
        name: "visitor_id"
    })
    public visitorId: number;

    @Column("int", {
        nullable: false,
        name: "branchuser_id"
    })
    public userId: number;


    @Column("int", {
        nullable: false,
        name: "branch_id"
    })
    public branchId: number;

    @Column("int", {
        nullable: false,
        name: "customer_id"
    })
    public customerId: number;



    // @ManyToOne(type=>MycoidVisitor, mycoid_visitor=>mycoid_visitor.mycoidVisitors2,{  nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    // @JoinColumn({ name:'customer_id'})
    // public customer:MycoidVisitor | null;



    // @ManyToOne(type=>MycoidVisitor, mycoid_visitor=>mycoid_visitor.mycoidVisitors,{  nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    // @JoinColumn({ name:'branch_id'})
    // public branch:MycoidVisitor | null;



    // @ManyToOne(type=>MycoidVisitor, mycoid_visitor=>mycoid_visitor.mycoidVisitors3,{  nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    // @JoinColumn({ name:'user_id'})
    // public user:MycoidVisitor | null;


    @Column("time", {
        nullable: false,
        name: "checkin_time"
    })
    public checkinTime: string;


    @Column("time", {
        nullable: false,
        name: "checkout_time"
    })
    public checkoutTime: string;


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


    @Column("int", {
        nullable: false,
        name: "status"
    })
    public status: number;



    @OneToOne(() => MycoidBranch, mycoid_branch => mycoid_branch.branchId, {primary: false,nullable:true,}) // onDelete: 'CASCADE', onUpdate: 'CASCADE' 
    @JoinColumn({ name: 'branch_id' })
    public mycoidBranch: MycoidBranch;

    @OneToOne(() => MycoidBranchusers, mycoid_branch_user => mycoid_branch_user.branchId, {primary: false,nullable:true,}) // onDelete: 'CASCADE', onUpdate: 'CASCADE' 
    @JoinColumn({ name: 'branch_id',referencedColumnName: 'branchId' })
    public mycoidBranchUser: MycoidBranchusers;



    @OneToOne(() => MycoidCustomer, mycoid_customer => mycoid_customer.customerId, { primary: false,nullable:true, }) //onDelete: 'CASCADE', onUpdate: 'CASCADE'
    @JoinColumn({ name: 'customer_id' })
    public mycoidCustomer: MycoidCustomer;


    
    @OneToMany(() => MycoidBranchusers, mycoid_branchuser => mycoid_branchuser.mycoid_visitor, { }) // primary: true, eager: true, cascade: true
    @JoinColumn({ name:'branch_id', referencedColumnName: 'branchId'})
    public mycoidBranchusers: MycoidBranchusers[];

}
