import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {MycoidUsers} from "./mycoidUsers";


@Entity("mycoid_companytype",{schema:"mycoid" } )
export class MycoidCompanytype extends BaseEntity {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"company_type_id"
        })
    public companyTypeId:number;
        

    @Column("varchar",{ 
        nullable:false,
        name:"compny_type"
        })
    public compnyType:string;
        

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
        

   
    @OneToMany(type=>MycoidUsers, mycoid_users=>mycoid_users.companyType,{ onDelete: 'RESTRICT' ,onUpdate: 'RESTRICT' })
    public mycoidUserss:MycoidUsers[];
    
}
