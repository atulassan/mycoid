import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {MycoidCompanytype} from "./mycoidCompanytype";
import {MycoidBranch} from "./mycoidBranch";


@Entity("mycoid_users",{schema:"mycoid" } )
@Index("company_type_id",["companyType",])
@Index("company_type_id_2",["companyType",])
export class MycoidUsers extends BaseEntity {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"user_id"
        })
    public userId:number;
        

    @Column("int",{ 
        nullable:false,
        name:"user_role"
        })
    public userRole:number;
        
 @ManyToOne(type=>MycoidCompanytype, mycoid_companytype=>mycoid_companytype.mycoidUserss,{  nullable:false,onDelete: 'RESTRICT',onUpdate: 'RESTRICT' })
    @JoinColumn({ name:'company_type_id'})
    public companyType:MycoidCompanytype | null;


    @Column("varchar",{ 
        nullable:false,
        name:"company_name"
        })
    public companyName:string;
        

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
        name:"contactperson"
        })
    public contactperson:string;
        

    @Column("varchar",{ 
        nullable:false,
        name:"website"
        })
    public website:string;
        

    @Column("text",{ 
        nullable:false,
        name:"extra_info"
        })
    public extraInfo:string;
        

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
        

    @Column("text",{ 
        nullable:false,
        name:"forgot_token"
        })
    public forgotToken:string;
        

    @Column("text",{ 
        nullable:false,
        name:"verification_token"
        })
    public verificationToken:string;
        

    @Column("int",{ 
        nullable:false,
        name:"status"
        })
    public status:number;
        

   
    @OneToMany(type=>MycoidBranch, mycoid_branch=>mycoid_branch.user,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    public mycoidBranchs:MycoidBranch[];
    

   
    @OneToMany(type=>MycoidUsers, mycoid_users=>mycoid_users.companyType,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    public mycoidUserss:MycoidUsers[];
    
}
