import { GroupIdType, JoinType, RegStatus, RegSource } from './define';

export declare class JoinCorpInfo{
    name:string;
    groupIdType: GroupIdType;
    groupId: string;
    level: number;
}

export declare class JoinCorp{
    property: JoinType;
    outsideTeamFile: string;
    outLevel: boolean;
    outLevelFile:string;
    code:number;
    contacts:string;
    tel:string;
    info:JoinCorpInfo;
    reg?: ProjectCorpReg;
}

export declare class JoinCorpRegSummary{
    property: JoinType;
    code: number;
    name: string;
    idType: GroupIdType;
    id: string;
}

export declare class ProjectCorpReg{
    corpSummary: JoinCorpRegSummary[];
    id: number;
    regTime: Date;
    corps: JoinCorp[];

    project?:Project;
}

export declare class ProjectInfo{
    name:string;
    address:string;
    type: string; //projectType
    typeClass: number;
    floorType: string;
    property: string;
    area: number;
    landArea: number;
    groundCount:number;
    underCount: number;
    beginDate: Date;
    completeDate:Date;
    tender:string;
    structure: string;
    costs:number;
    importantLevel:string;
    importantFile:string;
    memo:string;
    height:number;
}

export declare class ProjectInfoReg{

    id:number;
    info: ProjectInfo;
    regTime: Date;
}

export declare class Project{
    code: number;
    enable: boolean;
    info: ProjectInfoReg;
    corp: ProjectCorpReg;
    developer: JoinCorp;
}

export declare class ProjectReg{
    id: number;
    status: RegStatus;
    code: number;
    applyTime: Date;
    regTime: Date;
    source:RegSource;
    corp: ProjectCorpReg;
    info: ProjectInfoReg;
    corpMaster: boolean;
    infoMaster: boolean;

}