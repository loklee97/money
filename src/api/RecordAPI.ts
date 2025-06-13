import axios from "axios";
import { deleteRecordBody } from "../Components/Enum";

// 设定 baseURL，方便之后统一管理

const live ="https://moneyapi-lj06.onrender.com/api"
const local ="http://localhost:3001/api"
const api = axios.create({
    baseURL: live, // 改成你后端实际地址
    headers: {
        "Content-Type": "application/json",
    },
}); 

export interface getRecord {
    calculation: number;
    amount: number;
    name: string;
    description: string;
    id: string;
    categoryCode: string;
    updatedDate: string; // format "DD-MM-YYYY HH:mm"
    type: string;
    parentId: string;
    userName: string;
    createdDate: string; // format "DD-MM-YYYY HH:mm"
}

export interface getRecordList {
    calculation: number;
    amount: number;
    name: string;
    description: string;
    id: string;
    categoryCode: string;
    updatedDate: string; // format "DD-MM-YYYY HH:mm"
    type: string;
    parentId: string;
    children: getRecord[]
    createdDate: string; // format "DD-MM-YYYY HH:mm"
    balanced: number; // format "DD-MM-YYYY HH:mm"
    userName: string;
}


export interface getRecordTree {
    calculation: number;
    amount: number;
    name: string;
    description: string;
    id: string;
    categoryCode: string;
    updatedDate: string;
    createdDate: string;
    type: string;
    parentId: string;
    children: getRecord[]
    userName: string;
}

export interface createRecord {
    name: string;
    categoryCode: string;
    description: string;
    amount: number;
    calculation: number;
    parentId: string;
    userName: string;
}

export interface updateRecord {
    name: string;
    categoryCode: string;
    description: string;
    amount: number;
    calculation: number;
    parentId: string;
    createdDate: string;
    id: string;
    userName: string;
}

export interface login {
    userName: string;
    password:string;
}

export interface returnLogin {
    userName: string;
    money:number;
}

export function deleteRecordWithChild(id: string, createdDate: string, records: getRecord[],userName :string) {
    const data: deleteRecordBody[] = [];
    console.log("id:" + id)
    console.log("createdDate:" + createdDate)
    console.log("records:" + records)
    records.filter(x => x.parentId === id || x.id === id).forEach((child) =>
        data.push({
            id: child.id,
            createdDate: child.createdDate,
            userName : userName,
            amount : child.amount * child.calculation,
        })
    )
    console.log(data)
    deleteRecordapi(data);
    
}


export function recordTree(record: getRecord[]): getRecordTree[] {
    const parents = record.filter((r) => r.parentId === "");

    const data: getRecordTree[] = parents.map((parent) => {
        // Find children whose parentId matches current parent id
        const children = record.filter((r) => r.parentId === parent.id);

        return {
            calculation: parent.calculation,
            amount: parent.amount,
            name: parent.name,
            description: parent.description,
            id: parent.id,
            parentId: '',
            categoryCode: parent.categoryCode,
            updatedDate: parent.updatedDate,
            createdDate: parent.createdDate,
            type: parent.type,
            children: children, // assign children here
            userName: parent.userName,
        };
    });
    return data;
}
// 获取所有数据
export const fetchAllRecordsapi = async (userName:string): Promise<getRecord[]> => {
    const res = await api.get("/getAllRecordUser?type=Record&userName="+userName);
    return res.data;
};


// 新增数据
export const createRecordapi = async (data: createRecord): Promise<createRecord> => {
    const res = await api.post("/createRecord", data);
    return res.data;
};


export const deleteRecordapi = async (data: deleteRecordBody[]): Promise<string> => {
    const res = await api.post("/deleteRecord", data);
    return res.data;
};

export const updateRecordapi = async (data: updateRecord): Promise<string> => {
    const res = await api.post("/updateRecord", data);
    return res.data;
};

export const loginapi = async (data: login): Promise<returnLogin> => {
    const res = await api.post("/login", data);
    return res.data;
};

export const createUserapi = async (data: login): Promise<any> => {
    const res = await api.post("/createUser", data);
    return res.data;
};

export const recalculateapi = async (userName: string): Promise<any> => {
    console.log('recalculate par :',{userName}  )
    const res = await api.post("/calculateTotal", {userName});
    console.log(res)
    return res.data;
};



