// components/PieChartCard.tsx
import  { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchAllRecordsapi, getRecord,  } from '../api/RecordAPI';
import { useAuth } from './AuthContext';
import { expenseCategoryItem, pieData } from './Enum';

const data = [
    { name: 'Food', value: 400 },
    { name: 'Rent', value: 300 },
    { name: 'Transport', value: 200 },
    { name: 'Utilities', value: 100 },
];

function getRandomColor(): string {
  return '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
}
const PieChartCard = () => {
    const { user } = useAuth();
    const [records, setRecords] = useState<getRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchAllRecordsapi(user!);
                console.log("✅ Fetched data:", data);
                setRecords(data);



            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const recordList = records.map(item => {
        const matchedCategory = expenseCategoryItem.find(cat => cat.categoryCode === item.categoryCode);
        console.log('is match : ', matchedCategory)
        console.log('item : ', item)
        return {
            ...item,
            category: matchedCategory?.category ?? '', // Category name like "Salary"
        };
    });


    const groupedTotals = recordList.reduce<Record<string, number>>((acc, item) => {
        acc[item.categoryCode] = (acc[item.categoryCode] ?? 0) + item.amount;
        console.log('geoup :', acc)

        return acc;
    }, {});


    const [isIncome, setIsIncome] = useState<boolean>(true);
    const [filterData, setFilterData] = useState<pieData[]>([]);
    const handleType = (isIncome: boolean) => {
        setIsIncome(isIncome);
        const pieData = Object.entries(groupedTotals)
            .map(([categoryCode, total]) => {
                const categoryObj = expenseCategoryItem.find(cat => cat.categoryCode === categoryCode);
                return {
                    name: categoryObj?.category ?? "Unknown",
                    value: total,
                    categoryCode,
                    calculation: categoryObj?.calculation ?? 0,
                    color: getRandomColor()
                };
            })
            .filter(item => isIncome ? item.calculation === 1 : item.calculation === -1);
        setFilterData(pieData)
    }
    const [hasFiltered, setHasFiltered] = useState(false);

    useEffect(() => {
        if (
            !hasFiltered &&
            groupedTotals &&
            Object.keys(groupedTotals).length > 0 &&
            expenseCategoryItem.length > 0
        ) {
            handleType(true);
            setHasFiltered(true);
        }
    }, [groupedTotals, expenseCategoryItem, hasFiltered]);//only run on page load for loading data
    
    return (
        <div className="max-w-md mx-auto p-4 bg-white rounded-2xl shadow-lg">
            <div className="flex border-b border-gray-300 mb-4">
                <button
                    className={`flex-1 p-2 font-semibold ${isIncome
                        ? "border-b-2 border-blue-500 text-blue-500"
                        : "text-gray-500"
                        }`}
                    onClick={() => handleType(true)}
                >
                    Income
                </button>
                <button
                    className={`flex-1 p-2 font-semibold ${!isIncome
                        ? "border-b-2 border-red-500 text-red-500"
                        : "text-gray-500"
                        }`}
                    onClick={() => handleType(false)}
                >
                    Expenses
                </button>
            </div>
            <div className="w-full h-64">
               {filterData.length ===0 && (
                <label className="block text-xl font-medium text-gray-700">No Records Found </label>
               )}
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={filterData}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={80}
                            fill="#8884d8"
                           label={({ percent }) => `${(percent * 100).toFixed(2)}%`}

                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getRandomColor()} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>

        
                </ResponsiveContainer>
           
            </div>
              {filterData.map((record) => (

                         <div
                             key={record.categoryCode}
                           className="grid grid-cols-2 items-start bg-gray-50 hover:bg-gray-200 text-sm font-semibold cursor-pointer border-b transition-colors"
                         >
                           <div className="px-4 py-2 border-r">{record.name}</div>
                           <div className="px-4 py-2 border-r">{record.value * (record.calculation ?? 1)} </div>                   
                         </div>
                     ))}
        </div>
    );
};

export default PieChartCard;
