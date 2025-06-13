import React, { useEffect, useRef, useState } from "react";
import { deleteRecordWithChild, fetchAllRecordsapi, getmoneyapi, getRecord, getRecordList, recordTree } from '../api/RecordAPI.ts'
import { expenseCategoryItem, recordListColumn } from '../Components/Enum.ts'
import { useNavigate } from 'react-router-dom';
import { parse } from 'date-fns';
import { useAuth } from '../Components/AuthContext.tsx';
import { searchFilter, sortByValue, toggleSort } from "./Utils.ts";

export default function TreeList() {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const { user,  resetMoney } = useAuth();

  const navigate = useNavigate();
  const [records, setRecords] = useState<getRecord[]>([]);
  const [recordtree, setRecordTree] = useState<getRecordList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(true);

  //get data from api and add balanced 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllRecordsapi(user!);
        console.log("✅ Fetched data:", data);
        setRecords(data);

        const treedata = recordTree(data);
        console.log(treedata)
        const recordList = treedata.map(item => ({
          ...item,
          balanced: item.children.length > 0 ? item.children.reduce((sum, child) => sum + (child.amount * child.calculation), 0) + (item.amount * item.calculation) : item.amount,
        }));

        console.log(recordList)
        setRecordTree(recordList);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refresh]);

  //right click dropdown menu function for details and delete
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [selectedRecord, setSelectedRecord] = useState<getRecord | null>(null);
  const timerRef = useRef<number | null>(null);
  const longPressTriggeredRef = useRef(false);
  const handleMouseDown = (e: React.MouseEvent, record: getRecord) => {
    const { clientX, clientY } = e;

    longPressTriggeredRef.current = false; // reset flag on each press
    console.log("Dropdown position", dropdownPosition.x, dropdownPosition.y);
    timerRef.current = window.setTimeout(() => {
      longPressTriggeredRef.current = true;
      setSelectedRecord(record);
      setDropdownPosition({ x: clientX, y: clientY });
      setDropdownVisible(true);
      console.log("Dropdown position1", dropdownPosition.x, dropdownPosition.y);
    }, 600);
  };

  const handleMouseUp = (e: React.MouseEvent, record: getRecord) => {
    console.log(longPressTriggeredRef.current)
    console.log(record.id)
    console.log(dropdownVisible)
    if (!longPressTriggeredRef.current) {
      toggleExpand(record.id);
      handleClose();
    }
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleClose = () => {
    setDropdownVisible(false);
    setSelectedRecord(null);
  };

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        handleClose(); // click outside = close
      }
    };


    if (dropdownVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownVisible]);
  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  //sort funct 
  const [sortBy, setSortBy] = useState<keyof getRecordList>('createdDate');
  const [sortAsc, setSortAsc] = useState(true);
  const [search, setSearch] = useState('');

  const filteredData = searchFilter(recordtree, search, ['name', 'categoryCode'], (item, key, value, search) => {
    if (key === 'categoryCode') {
      const category = expenseCategoryItem.find(x => x.categoryCode === value)?.category;
      return category?.toLowerCase().includes(search.toLowerCase()) ?? false;
    }
    return value?.toString().toLowerCase().includes(search.toLowerCase());
  });

  const sortedData = [...filteredData].sort((a, b) => sortByValue(a, b, sortBy, sortAsc));

  const onToggleSort = (column: keyof getRecordList) => {
    const result = toggleSort(sortBy, sortAsc, column);
    setSortBy(result.sortBy);
    setSortAsc(result.sortAsc);
  };

  const handleDelete = async (id: string, createdDate: string, records: getRecord[]) => {
    await deleteRecordWithChild(id, createdDate, records, user!);
    setRefresh(prev => !prev);
    const newMoney = await getmoneyapi(user!);
    resetMoney(newMoney)
  }


  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Search"
          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>
      <div ref={dropdownRef} className="overflow-x-auto p-4">
        <div className="w-full border border-gray-300 rounded overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-6 bg-gray-100 text-left text-sm font-medium border-b">
            <div className="px-4 py-2 border-r" onClick={() => onToggleSort('createdDate')}>Date{sortBy === 'createdDate' && (sortAsc ? ' ▼' : ' ▲')}</div>
            <div className="px-4 py-2 border-r" onClick={() => onToggleSort('name')}>Name{sortBy === 'name' && (sortAsc ? ' ▼' : ' ▲')}</div>
            <div className="px-4 py-2 border-r" onClick={() => onToggleSort('description')}>Description{sortBy === 'description' && (sortAsc ? ' ▼' : ' ▲')}</div>
            <div className="px-4 py-2 border-r" onClick={() => onToggleSort('categoryCode')}>Category{sortBy === 'categoryCode' && (sortAsc ? ' ▼' : ' ▲')}</div>
            <div className="px-4 py-2 border-r" onClick={() => onToggleSort('amount')}>Amount{sortBy === 'amount' && (sortAsc ? ' ▼' : ' ▲')}</div>
            <div className="px-4 py-2 border-r" onClick={() => onToggleSort('balanced')}>Balanced{sortBy === 'balanced' && (sortAsc ? ' ▼' : ' ▲')}</div>
          </div>

          {/* Data rows */}
          {sortedData.map((record) => (
            <React.Fragment key={record.id}>
              <div
                className="grid grid-cols-6 items-start bg-gray-50 hover:bg-gray-200 text-sm font-semibold cursor-pointer border-b transition-colors"
                onMouseDown={(e) => handleMouseDown(e, record)}
                onMouseUp={(e) => handleMouseUp(e, record)}
              >
                <div className="px-4 py-2 border-r">{record.createdDate} {!expandedIds.includes(record.id) && record.children.length > 0 && "▸"}{expandedIds.includes(record.id) && record.children.length > 0 && '▼'}</div>
                <div className="px-4 py-2 border-r">{record.name} </div>
                <div className="px-4 py-2 border-r">{record.description}</div>
                <div className="px-4 py-2 border-r">
                  {expenseCategoryItem.find(x => x.categoryCode === record.categoryCode)?.category}
                </div>
                <div className="px-4 py-2 border-r">
                  {record.amount * record.calculation}
                </div>
                <div className="px-4 py-2">
                  {record.children.length > 0 && record.balanced ? record.balanced : ''}
                  {record.balanced}
                </div>
              </div>

              {/* Children rows (if expanded) */}
              {expandedIds.includes(record.id) &&
                record.children?.map((child) => (
                  <div
                    key={child.id}
                    className="grid grid-cols-6 items-start text-sm hover:bg-gray-100 border-b"
                    onMouseDown={(e) => handleMouseDown(e, child)}
                    onMouseUp={(e) => handleMouseUp(e, child)}
                  >
                    <div className="px-4 py-2 pl-8 border-r text-gray-700">↳ {child.createdDate}</div>
                    <div className="px-4 py-2 pl-8 border-r text-gray-700"> {child.name}</div>
                    <div className="px-4 py-2 border-r">{child.description}</div>
                    <div className="px-4 py-2 border-r">
                      {expenseCategoryItem.find(x => x.categoryCode === child.categoryCode)?.category}
                    </div>
                    <div className="px-4 py-2 border-r">
                      {child.amount * child.calculation}
                    </div>
                    <div className="px-4 py-2"></div>
                  </div>
                ))}
            </React.Fragment>
          ))}

          {dropdownVisible && selectedRecord && (
            <div
              className="fixed bg-white border rounded shadow-lg text-sm z-50 p-2 min-w-[120px]"
              style={{
                top: `${dropdownPosition.y}px`,
                left: `${dropdownPosition.x}px`,
              }}
              onClick={handleClose}
            >
              <p onClick={() => navigate(`/createrecord?id=${selectedRecord.id}`)} className="cursor-pointer hover:bg-gray-100" >Details</p>
              <p onClick={() => handleDelete(selectedRecord.id, selectedRecord.createdDate, records)} className="cursor-pointer hover:bg-gray-100" >Delete</p>
            </div>
          )}

        </div>

      </div>

    </div>

  );
}
function resetMoney(newMoney: number) {
  throw new Error("Function not implemented.");
}

