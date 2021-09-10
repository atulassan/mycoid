import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {MycoidUsers} from "./mycoidUsers";
import {MycoidBranchusers} from "./mycoidBranchusers";


@Entity("mycoid_branch",{schema:"mycoid" } )
@Index("user_id",["user",])
export class MycoidBranch extends BaseEntity {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"branch_id"
        })
    public branchId:number;
        

   
    @ManyToOne(type=>MycoidUsers, mycoid_users=>mycoid_users.mycoidBranchs,{  nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'user_id'})
    public user:MycoidUsers | null;


    @Column("varchar",{ 
        nullable:false,
        name:"branch_name"
        })
    public branchName:string;
        

    @Column("varchar",{ 
        nullable:false,
        name:"telephone"
        })
    public telephone:string;
        

    @Column("varchar",{ 
        nullable:false,
        name:"email"
        })
    public email:string;
        

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
        

    @Column("varchar",{ 
        nullable:false,
        name:"website"
        })
    public website:string;
        

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
    public modifiedby:string;
        

    @Column("int",{ 
        nullable:false,
        name:"status"
        })
    public status:number;
    @Column("int",{ 
        nullable:false,
        name:"guestno"
        })
    public guestno:number;
        

    
}
