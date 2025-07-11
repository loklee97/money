import axios from "axios";
import { deleteRecordBody } from "../Components/Enum";


const live ="api"
const local ="http://localhost:3001/api"
const api = axios.create({
    baseURL: live, 
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

export async function deleteRecordWithChild(id: string, createdDate: string, records: getRecord[],userName :string) {
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
    return deleteRecordapi(data);;
    
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


export const deleteRecordapi = async (data: deleteRecordBody[]): Promise<{message: string}> => {
   const res = await api.delete("/deleteRecord", {
    data: data,
  });
    return res.data;
};

export const updateRecordapi = async (data: updateRecord): Promise<{message: string}> => {
    const res = await api.patch("/updateRecord", data);
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

export const recalculateapi = async (userName: string): Promise<number> => {
    console.log('recalculate par :',{userName}  )
    const res = await api.post("/calculateTotal", {userName});
    console.log(res)
    return res.data;
};


export const getmoneyapi = async (userName: string): Promise<number> => {
    console.log('get money par :',{userName}  )
    const res = await api.get("/getMoneyByUser?userName="+userName);
    console.log(res)
    return res.data;
};


