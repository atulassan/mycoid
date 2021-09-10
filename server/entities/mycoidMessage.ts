import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import { MycoidBranch } from "./mycoidBranch";
import { MycoidBranchusers } from "./mycoidBranchusers";


@Entity("mycoid_message",{schema:"mycoid" } )
// @Index("user_id",["userId",])
// @Index("user_id_2",["userId",])
// @Index("branch_id",["branch",])
// @Index("branch_id_2",["branch",])
// @Index("user_id_3",["userId",])
// @Index("customer_id",["customer",])
// @Index("customer_id_2",["customer",])
// @Index("customer_id_3",["customer",])
export class MycoidMessage extends BaseEntity {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"message_id"
        })
    public messageId:number;
        

    @Column("int",{ 
        nullable:false,
        name:"user_id"
        })
    public userId:number;
        

    @Column("int",{ 
        nullable:false,
        name:"branchuser_id"
        })
    public branchuserId:number;


    @Column("int",{ 
        nullable:false,
        name:"branch_id"
        })
    public branchId:number;

    @Column("int",{ 
        nullable:false,
        name:"customer_id"
        })
    public customerId:number;
        

   
    // @ManyToOne(type=>MycoidMessage, mycoid_message=>mycoid_message.mycoidMessages,{  nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    // @JoinColumn({ name:'branch_id'})
    // public branch:MycoidMessage | null;


   
    // @ManyToOne(type=>MycoidMessage, mycoid_message=>mycoid_message.mycoidMessages2,{  nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    // @JoinColumn({ name:'customer_id'})
    // public customer:MycoidMessage | null;


    @Column("text",{ 
        nullable:false,
        name:"message"
        })
    public message:string;
        

    @Column("datetime",{ 
        nullable:false,
        name:"created_datetime"
        })
    public createdDatetime:Date;
        

    @Column("int",{ 
        nullable:false,
        name:"createdby"
        })
    public createdby:number;
        

    @Column("int",{ 
        nullable:false,
        name:"status"
        })
    public status:number;
        

   
    @OneToOne(()=>MycoidBranch, mycoid_branch=>mycoid_branch.branchId,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    @JoinColumn({ name:'branch_id'})
    public mycoidBranch:MycoidBranch;

    @OneToOne(()=>MycoidBranchusers, mycoid_branch_user=>mycoid_branch_user.branchuserId,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'branchuser_id' })
    public mycoidBranchUser:MycoidBranchusers;

   
    // @OneToMany(type=>MycoidMessage, mycoid_message=>mycoid_message.customer,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    // public mycoidMessages2:MycoidMessage[];
    
}
