import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './HomePage.module.css'; 

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") : ""}`,
  },
});

interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
}

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const HomePage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const router = useRouter();

  const fetchItems = () => {
    axiosInstance
      .get("/api/items")
      .then((response) => {
        setItems(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
        setError("Failed to fetch items.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchItems(); 

    const fetchInterval = setInterval(() => {
      fetchItems(); 
      setBgColor(getRandomColor()); 
    }, 3000);

    return () => clearInterval(fetchInterval);
  }, []);

  const handleDelete = (id: number) => {
    axiosInstance
      .delete(`/api/items/${id}`)
      .then(() => {
        setItems(items.filter(item => item.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
        setError("Failed to delete item.");
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.container} style={{ backgroundColor: bgColor }}>
      <div className="container py-5">
        <h1 className="mb-4">Items List</h1>
        <div className="mb-4">
          <Link href="/create-item" legacyBehavior>
            <a className="btn btn-primary me-2">Create New Item</a>
          </Link>
          <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
        </div>
        {items.length === 0 ? (
          <p>No items found</p>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      <Link href={`/item/${item.id}`} legacyBehavior>
                        <a className="btn btn-info btn-sm">View</a>
                      </Link>
                      <button onClick={() => handleDelete(item.id)} className="btn btn-danger btn-sm">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default HomePage;
