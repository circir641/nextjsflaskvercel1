import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") : ""}`,
  },
});

interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
}

const ItemDetailPage: React.FC = () => {
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      axiosInstance
        .get(`/api/items/${id}`)
        .then((response) => {
          setItem(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching item:", error);
          setError("Failed to fetch item.");
          setLoading(false);
        });
    }
  }, [id]);

  const handleDelete = () => {
    if (id) {
      axiosInstance
        .delete(`/api/items/${id}`)
        .then(() => {
          router.push("/");
        })
        .catch((error) => {
          console.error("Error deleting item:", error);
          setError("Failed to delete item.");
        });
    }
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

  if (!item) {
    return <div>Item not found</div>;
  }

  return (
    <div>
      <h1>Item Details</h1>
      <p>ID: {item.id}</p>
      <p>Name: {item.name}</p>
      <p>Description: {item.description}</p>
      <p>Price: {item.price}</p>
      <button onClick={handleDelete}>Delete</button>
      <Link href={`/item/${item.id}/edit`}>Edit</Link>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default ItemDetailPage;
