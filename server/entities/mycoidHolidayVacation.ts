import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";


@Entity("mycoid_holiday_vacation",{schema:"mycoid" } )
//@Index("branch_id",["branch",])
//@Index("branch_id_2",["branch",])
export class MycoidHolidayVacation extends BaseEntity {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"holiday_vacation_id"
        })
    public holidayVacationId:number;
        

   
    // @ManyToOne(type=>MycoidHolidayVacation, mycoid_holiday_vacation=>mycoid_holiday_vacation.mycoidHolidayVacations,{  nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    // @JoinColumn({ name:'branch_id'})
    // public branch:MycoidHolidayVacation | null;

    @Column("int",{ 
        nullable:false,
        name:"branch_id"
        })
    public branchId:number;

    @Column("int",{ 
        nullable:false,
        name:"type"
        })
    public type:number;
        

    @Column("date",{ 
        nullable:false,
        name:"date"
        })
    public date:string;

    @Column("date",{ 
        nullable:true,
        name:"to_date"
        })
    public toDate:string;

    @Column("varchar",{ 
        nullable:false,
        name:"reason"
        })
    public reason:string;
        

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
        

   
    // @OneToMany(type=>MycoidHolidayVacation, mycoid_holiday_vacation=>mycoid_holiday_vacation.branch,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    // public mycoidHolidayVacations:MycoidHolidayVacation[];
    
}
