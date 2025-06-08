import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import moneyIn from '../assets/moneyin.png';
import moneyOut from '../assets/moneyout.png';
import category from '../assets/category.png';
import record from '../assets/record.png';
import dashboard from '../assets/dashboard.png';
interface CardItem {
  id: number;
  title: string;
  imageUrl: string;
  path:string;
}

const mainmenu: CardItem[] = [
  { id: 1, title: 'Money-In', imageUrl: moneyIn, path: '/createrecord?cal=income' },
  { id: 2, title: 'Money-Out', imageUrl: moneyOut, path: '/createrecord?cal=expenses' },
  { id: 3, title: 'Category', imageUrl: category, path: '/category' },
  { id: 4, title: 'Record', imageUrl: record, path: '/listrecord' },
  { id: 5, title: 'DashBoard', imageUrl: dashboard, path: '/dashboard' }
];

const CardGrid: React.FC<{ items: CardItem[] }> = ({ items }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {items.map(item => (
        <Link key={item.id} to={item.path} className="text-decoration-none">
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-3 text-center">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="mx-auto h-24 w-24 object-contain mb-2"
            />
            {/* <h5 className="text-sm font-medium">{item.title}</h5> */}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default function Home() {
  return (
       <CardGrid items={mainmenu} />
 
  );
}
