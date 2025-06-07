
import React, { useState } from "react";
import { expenseCategoryItem, expenseCategory } from '../Components/Enum.ts'

export default function categoryList() {
    const categoryFilterList = expenseCategoryItem;
    const [sortBy, setSortBy] = useState<keyof expenseCategory>('categoryCode');
    const [sortAsc, setSortAsc] = useState<boolean>(true);

    const [search, setSearch] = useState<string>('');

    const sortedData = [...categoryFilterList].filter((item) =>
        Object.values(item).some((value) =>
            value.toString().toLowerCase().includes(search.toLowerCase())
        )
    ).sort((a, b) => {
        const valA = a[sortBy];
        const valB = b[sortBy];
        if (typeof valA === 'number' && typeof valB === 'number') {
            return sortAsc ? valA - valB : valB - valA;
        }
        return sortAsc
            ? String(valA).localeCompare(String(valB))
            : String(valB).localeCompare(String(valA));
    });

    const toggleSort = (column: keyof expenseCategory) => {
        if (sortBy === column) {
            setSortAsc(!sortAsc); // reverse sort
        } else {
            setSortBy(column);
            setSortAsc(true); // default to ascending
        }
    };



    return (
        <>
            <div className="flex items-center gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
              
            </div>
            <div className="overflow-x-auto p-4">
                <div className="w-full border border-gray-300 rounded overflow-hidden">
                    {/* Header row */}
                    <div className="grid grid-cols-3 bg-gray-100 text-left text-sm font-medium border-b">
                        <div className="px-4 py-2 border-r" onClick={() => toggleSort('categoryCode')}>Category Code{sortBy === 'categoryCode' && (sortAsc ? ' ▼' : ' ▲')}</div>
                        <div className="px-4 py-2 border-r" onClick={() => toggleSort('category')}>  Name  {sortBy === 'category' && (sortAsc ? ' ▼' : ' ▲')}</div>
                        <div className="px-4 py-2 border-r" onClick={() => toggleSort('calculation')}>Calculation{sortBy === 'calculation' && (sortAsc ? ' ▼' : ' ▲')}</div>
                    </div>

                    {
                        sortedData.map((cat) => (
                            <React.Fragment key={cat.categoryCode}>
                                <div className="grid grid-cols-3 items-start bg-gray-50 hover:bg-gray-200 text-sm font-semibold cursor-pointer border-b transition-colors">
                                    <div className="px-4 py-2 border-r">{cat.categoryCode}</div>
                                    <div className="px-4 py-2 border-r">{cat.category}</div>
                                    <div className="px-4 py-2 border-r flex justify-end">{cat.calculation === 1 ? '+' : '-'}</div>
                                </div>
                            </React.Fragment>
                        ))
                    }
                </div>
            </div></>
    );
}