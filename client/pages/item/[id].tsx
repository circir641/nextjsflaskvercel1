import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";

interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Authorization: typeof window !== "undefined" ? `Bearer ${localStorage.getItem("token")}` : "",
  },
});

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const ItemDetail: React.FC = () => {
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0); 
  const [warning, setWarning] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      axiosInstance
        .get(`/api/items/${id}`)
        .then((response) => {
          const data = response.data;
          setItem(data);
          setName(data.name);
          setDescription(data.description);
          setPrice(data.price);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching item:", error);
          setError("Failed to fetch item details.");
          setLoading(false);
        });
    }

    const interval = setInterval(() => {
      setBgColor(getRandomColor());
    }, 5000);

    return () => clearInterval(interval);
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
          setError("Failed to delete item. Please try again.");
        });
    }
  };

  const handleUpdate = (event: React.FormEvent) => {
    event.preventDefault();

    if (price <= 0) {
      setWarning("Price should not be equal to or less than zero");
      return;
    }

    setWarning(null); // Clear any previous warnings

    const updatedItem = {
      name,
      description,
      price, // Ensure price is a number
    };

    axiosInstance
      .put(`/api/items/${id}`, updatedItem)
      .then((response) => {
        setEditMode(false);
        setItem((prev) => (prev ? { ...prev, ...updatedItem } : null));
      })
      .catch((error) => {
        console.error("Error updating item:", error);
        setError("Failed to update item. Please try again.");
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ backgroundColor: bgColor, minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center", background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)", maxWidth: "600px", width: "100%" }}>
        <h1>Item Details</h1>
        {item && (
          <div>
            {editMode ? (
              <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <div>
                  <label>Name:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                  />
                </div>
                <div>
                  <label>Description:</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                  />
                </div>
                <div>
                  <label>Price:</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    required
                    style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                  />
                  {warning && <p style={{ color: "red" }}>{warning}</p>}
                </div>
                <button type="submit" style={{ padding: "10px", borderRadius: "4px", border: "none", backgroundColor: "#4CAF50", color: "#fff", cursor: "pointer" }}>Update Item</button>
                <button type="button" onClick={() => setEditMode(false)} style={{ padding: "10px", borderRadius: "4px", border: "none", backgroundColor: "#f44336", color: "#fff", cursor: "pointer" }}>Cancel</button>
              </form>
            ) : (
              <div>
                <p>ID: {item.id}</p>
                <p>Name: {item.name}</p>
                <p>Description: {item.description}</p>
                <p>Price: {item.price}</p>
                <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "10px" }}>
                  <button onClick={() => setEditMode(true)} style={{ padding: "10px", borderRadius: "4px", border: "none", backgroundColor: "#007bff", color: "#fff", cursor: "pointer" }}>Edit Item</button>
                  <button onClick={handleDelete} style={{ padding: "10px", borderRadius: "4px", border: "none", backgroundColor: "#dc3545", color: "#fff", cursor: "pointer" }}>Delete Item</button>
                </div>
              </div>
            )}
          </div>
        )}
        <Link href="/" passHref style={{ display: "block", marginTop: "20px", color: "#007bff", textDecoration: "underline" }}>Back to Home</Link>
      </div>
    </div>
  );
};

export default ItemDetail;
