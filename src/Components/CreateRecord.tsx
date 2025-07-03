import { useEffect, useState } from "react";
import { expenseCategoryItem as expensesCategoryItem, expenseCategory } from './Enum.ts'
import { useNavigate, useSearchParams } from "react-router-dom";
import { createRecord, createRecordapi, getRecord, fetchAllRecordsapi, updateRecordapi, updateRecord, deleteRecordWithChild, getmoneyapi } from '../api/RecordAPI.ts'
import { useAuth } from '../Components/AuthContext.tsx';

export default function Moneyin() {
  const navigate = useNavigate();
  const { user, money, resetMoney } = useAuth();
  const [_, setSelected] = useState<expenseCategory | null>(null);
  const [categoryCode, setCategoryCode] = useState<string>("");
  const [searchParams] = useSearchParams();
  const calculation = searchParams.get("cal");
  const id = searchParams.get("id");
  const [category, setCategory] = useState<expenseCategory[]>([]);
  function resetData() {
    setName("");
    setAmount("");
    setCategoryCode("");
    setRecords([]);
    setDescription("");
    setParentId("");
    setSubmitted(!submitted);
  }

  function regetData() {
    if (!id || records.length === 0) return;
    const detail = records.find(x => x.id == id)
    if (detail) {
      setName(detail.name);
      setAmount(detail.amount);
      setCategory(expensesCategoryItem)
      setCategoryCode(detail.categoryCode);
      setDescription(detail.description);
      setParentId(detail.parentId);
      setIsDisable(!isEdit);
    }
  }

  const [records, setRecords] = useState<getRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [parentId, setParentId] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchAllRecordsapi(user!)
      .then(setRecords)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [submitted]);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cal = expensesCategoryItem.find(x => x.categoryCode === categoryCode)?.calculation
    const newRecord: createRecord = {
      name,
      categoryCode,
      description,
      amount: Number(amount),
      calculation: Number(cal),
      parentId: parentId,
      userName: user!
    };
    try {
      const res = await createRecordapi(newRecord);
      const newMoney = await getmoneyapi(user!);
      resetMoney(newMoney)
      alert("Record added: " + name);
      navigate(`/listrecord`);
      resetData();
    } catch (error) {
      console.error("Failed to add expense", error);
      alert("Failed to add expense");
    }
  };

  const [isDisable, setIsDisable] = useState(false);
  const [isEdit, setisEdit] = useState(false);
  useEffect(() => {
    const filteredCategory = expensesCategoryItem.filter((item) => {
      if (calculation === "income") return item.calculation === 1;
      if (calculation === "expenses") return item.calculation === -1;
    });
    setSelected(null)
    setCategory(filteredCategory);
    if (id) {
      regetData();
      if (id) {
        const category = filteredCategory.find(x => x.categoryCode === categoryCode)
        if (category) {
          setSelected(category)
        }
      }
    }

    console.log(isEdit)

  }, [id, records, isEdit, calculation]);

  const editButtonClick = async (isEdit: Boolean) => {
    if (isEdit) {
      if (!id || records.length === 0) return;
      const detail = records.find(x => x.id == id)
      if (detail) {
        const newRecord: updateRecord = {
          name,
          categoryCode,
          description,
          amount: Number(amount),
          calculation: Number(detail.calculation),
          parentId: parentId,
          id: detail.id!!,
          createdDate: detail.createdDate,
          userName: user!
        };
        try {
          const res = await updateRecordapi(newRecord);
          console.log('res ::', res)
          const newMoney = await getmoneyapi(user!);
          resetMoney(newMoney)
          alert("Record update: " + name);
          resetData();
        } catch (error) {
          console.error("Failed to update record", error);
          alert("Failed to update record");
        }
      }
    }
    resetData();
    setisEdit(!isEdit);
  }
  const deleteButtonClick = async (isEdit: Boolean) => {
    if (isEdit) {
      if (!id || records.length === 0) return;
      const detail = records.find(x => x.id == id)
      const cal = (detail?.calculation === 1 ? 'income' : 'expenses')

      if (detail) {
        try {
          const res = await deleteRecordWithChild(detail.id, detail.createdDate, records, user!);
          const newMoney = await getmoneyapi(user!);
          resetMoney(newMoney)
          console.log('brand new moeny :', money)
          resetData();
          alert("Record deleted: " + detail.name);
          navigate(`/createrecord?cal=${cal}`);
        } catch (error) {
          console.error("Failed to delete record", error);
          alert("Failed to delete record");
        }
      }
      navigate(`/createrecord?cal=${cal}`);
    } else {
      setisEdit(isEdit => !isEdit);
    }
    resetData();
  }
  return (

    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 space-y-4">
      <div>
     <label className="block text-xl font-medium text-gray-700">{calculation === 'income' ? 'Income (+)' : 'Expenses (-)'}</label>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category:</label>
        <select
          id="categorySelect"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          value={categoryCode}
          onChange={(e) => setCategoryCode(e.target.value)}
          disabled={!id ? false : true}
          required
        >
          <option value="">-- Select --</option>
          {category.map((item) => (
            <option key={item.categoryCode} value={item.categoryCode}>
              {item.category}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="nameinput" className="block text-sm font-medium text-gray-700">Name:</label>
        <input
          type="text"
          id="nameinput"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          placeholder="Enter name"
          value={name}
          disabled={isDisable}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="amountinput" className="block text-sm font-medium text-gray-700">Amount:</label>
        <input
          type="number"
          id="amountinput"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          placeholder="0.0"
          value={amount}
          required
          disabled={isDisable}
          min={0}
          onChange={e => setAmount(Number(e.target.value))}
        />
      </div>

      <div>
        <label htmlFor="descriptioninput" className="block text-sm font-medium text-gray-700">Description:</label>
        <input
          type="text"
          id="descriptioninput"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          placeholder="Enter description"
          value={description}
          disabled={isDisable}
          required
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="parentId" className="block text-sm font-medium text-gray-700">Parent:</label>
        <select
          id="recordSelect"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          value={parentId}
          disabled={isDisable}
          onChange={(e) => setParentId(e.target.value)}
        >
          <option value="">-- Select --</option>
          {records.filter(x => x.parentId === '' && x.id !== id).map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      {id === null && (
        <button
          disabled={isDisable}
          type="submit"
          className="w-full bg-blue-600 text-black py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Submit
        </button>
      )}
      {id !== null && (
        <><button
          onClick={() => editButtonClick(isEdit)}
          type="button"
          className="w-full bg-blue-600 text-black py-2 px-4 rounded-md hover:bg-blue-700"
        >
          {isEdit ? 'Save' : 'Edit'}
        </button>
          <button
            onClick={() => deleteButtonClick(!isEdit)}
            type="button"
            className="w-full bg-blue-600 text-black py-2 px-4 rounded-md hover:bg-blue-700"
          >
            {isEdit ? 'Cancel' : 'Delete'}
          </button></>
      )}
    </form>
  );



}
