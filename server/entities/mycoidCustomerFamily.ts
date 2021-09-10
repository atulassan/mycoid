import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import { MycoidCustomer } from "./mycoidCustomer";


@Entity("mycoid_customer_family",{schema:"mycoid" } )
//@Index("customer_id",["customer",])
//@Index("customer_id_2",["customer",])
export class MycoidCustomerFamily extends BaseEntity {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"cust_family_id"
        })
    public custFamilyId:number;
        

    // @Column({ nullable: false })
    // customer_id: number

    // @ManyToOne(type=>MycoidCustomerFamily, mycoid_customer_family=>mycoid_customer_family.mycoidCustomerFamilys,{  nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    // @JoinColumn({  name:'customer_id'})
    //  customer:MycoidCustomerFamily | null;


    @Column("varchar",{ 
        nullable:false,
        name:"first_name"
        })
    public firstName:string;
        
    @Column("int",{ 
        nullable:false,
        name:"customer_id"
        })
    public customerId:number;

    @Column("varchar",{ 
        nullable:false,
        name:"last_name"
        })
    public lastName:string;


    @Column("varchar",{ 
        nullable:false,
        name:"relation"
        })
    public relation:string;
        

    @Column("varchar",{ 
        nullable:false,
        name:"email"
        })
    public email:string;
        

    @Column("varchar",{ 
        nullable:false,
        length:12,
        name:"mobile"
        })
    public mobile:string;
        

    @Column("text",{ 
        nullable:false,
        name:"address"
        })
    public address:string;
        

    @Column("varchar",{ 
        nullable:false,
        length:10,
        name:"postcode"
        })
    public postcode:string;
        

    @Column("varchar",{ 
        nullable:false,
        length:100,
        name:"city"
        })
    public city:string;
        

    @Column("varchar",{ 
        nullable:false,
        length:100,
        name:"place"
        })
    public place:string;
        

    @Column("varchar",{ 
        nullable:false,
        length:100,
        name:"country"
        })
    public country:string;
        

    @Column("text",{ 
        nullable:false,
        name:"image"
        })
    public image:string;
        

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
        

    @Column("datetime",{ 
        nullable:false,
        name:"modified_datetime"
        })
    public modifiedDatetime:Date;
        

    @Column("int",{ 
        nullable:false,
        name:"modifiedby"
        })
    public modifiedby:number;
        

    @Column("int",{ 
        nullable:false,
        name:"status"
        })
    public status:number;
        

    @ManyToOne(() => MycoidCustomer, mycoid_customer => mycoid_customer.customerId,{primary:false,nullable:true})
    @JoinColumn({ name:'customer_id',referencedColumnName: 'customerId'})
    mycoid_customer: MycoidCustomer;
    
    
}
