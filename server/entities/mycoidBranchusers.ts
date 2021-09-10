import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {MycoidBranch} from "./mycoidBranch";
import {MycoidVisitor} from "./mycoidVisitor";

@Entity("mycoid_branchusers",{schema:"mycoid" } )
//@Index("branch_id",["branch",])
//@Index("branch_id_2",["branch",])
//@Index("user_id",["user",])
export class MycoidBranchusers extends BaseEntity {

    @PrimaryGeneratedColumn({
        type:"int", 
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
        name:"user_id"
        })
    public userId:number;

    @Column("int",{ 
        nullable:false,
        name:"branch_user_role"
        })
    public branchUserRole:number;
    
    @Column("varchar",{ 
        nullable:false,
        name:"first_name"
        })
    public firstName:string;
        

    @Column("varchar",{ 
        nullable:false,
        name:"last_name"
        })
    public lastName:string;
        

    @Column("varchar",{ 
        nullable:false,
        length:25,
        name:"telephone"
        })
    public telephone:string;
        

    @Column("varchar",{ 
        nullable:false,
        name:"email"
        })
    public email:string;
        

    @Column("varchar",{ 
        nullable:false,
        name:"website"
        })
    public website:string;
        

    @Column("varchar",{ 
        nullable:false,
        name:"user_position"
        })
    public userPosition:string;
        

    @Column("text",{ 
        nullable:false,
        name:"password"
        })
    public password:string;
        

    @Column("varchar",{ 
        nullable:false,
        length:25,
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

    
    @OneToOne(() => MycoidBranch, mycoid_branch => mycoid_branch.branchId, {primary: false,nullable:true,}) // onDelete: 'CASCADE', onUpdate: 'CASCADE' 
    @JoinColumn({ name: 'branch_id' })
    public mycoidBranch: MycoidBranch;

    @ManyToOne(() => MycoidVisitor, mycoid_visitor => mycoid_visitor.branchId,{primary:false,nullable:true})
    @JoinColumn({ name:'branch_id',referencedColumnName: 'branchId'})
    mycoid_visitor: MycoidVisitor;
 
    
}
