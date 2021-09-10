import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";


@Entity("mycoid_opening_hours",{schema:"mycoid" } )
// @Index("branch_id",["branch",])
// @Index("branch_id_2",["branch",])
export class MycoidOpeningHours extends BaseEntity {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"opening_hours_id"
        })
    public openingHoursId:number;


    @Column("int",{ 
        nullable:false,
        name:"branch_id"
        })
    public branchId:number;
        

   
    // @ManyToOne(type=>MycoidOpeningHours, mycoid_opening_hours=>mycoid_opening_hours.mycoidOpeningHourss,{  nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    // @JoinColumn({ name:'branch_id'})
    // public branch:MycoidOpeningHours | null;


    @Column("varchar",{ 
        nullable:false,
        name:"opening_hours"
        })
    public openingHours:string;

    @Column("varchar",{ 
        nullable:false,
        name:"days"
        })
    public days:string;
        

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
        

   
    // @OneToMany(type=>MycoidOpeningHours, mycoid_opening_hours=>mycoid_opening_hours.branch,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    // public mycoidOpeningHourss:MycoidOpeningHours[];
    
}
