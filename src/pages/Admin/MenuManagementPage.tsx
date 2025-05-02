// src/pages/Admin/MenuManagementPage.tsx (Frontend)
import React, {
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
  FormEvent,
} from "react";
import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  CreateMenuItemPayload,
  UpdateMenuItemPayload,
} from "../../api/menuApi";
import { MenuItem, MenuItemCategory } from "../../types";
import styles from "../styles/ManagementPage.module.css";

const MenuManagementPage: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]); // Inisialisasi array kosong
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<UpdateMenuItemPayload>({
    name: "",
    description: "",
    price: 0,
    category: MenuItemCategory.OTHER,
    is_available: true,
    image_url: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // FIX: Gunakan limit yang valid (misal 100) atau jangan kirim jika belum perlu pagination
      const response = await getMenuItems({ limit: 100 });
      // FIX: Cek respons sebelum akses .data
      if (response && response.data) {
        setItems(response.data);
      } else {
        setItems([]); // Set array kosong jika data tidak valid
        setError("Received invalid data structure for menu items.");
      }
    } catch (err: any) {
      // Tangkap error spesifik jika perlu
      console.error("Fetch menu items error:", err);
      setError(
        `Failed to load menu items: ${
          err.response?.data?.message || err.message || "Unknown error"
        }`
      );
      setItems([]); // Set array kosong jika fetch gagal
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    let processedValue: string | number | boolean = value;
    if (type === "number") {
      processedValue = value === "" ? "" : parseFloat(value);
    } else if (type === "checkbox") {
      processedValue = (e.target as HTMLInputElement).checked;
    }
    setFormData((prev) => ({ ...prev, [name]: processedValue }));
  };

  const resetAndHideForm = () => {
    setIsFormVisible(false);
    setCurrentItem(null);
    setFormData({
      name: "",
      description: "",
      price: 0,
      category: MenuItemCategory.OTHER,
      is_available: true,
      image_url: "",
    });
    setError(null); // Bersihkan error form
  };

  const handleAddNew = () => {
    resetAndHideForm();
    setIsFormVisible(true);
  };

  const handleEdit = (item: MenuItem) => {
    setCurrentItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      price: item.price,
      category: item.category,
      is_available: item.is_available,
      image_url: item.image_url || "",
    });
    setIsFormVisible(true);
    setError(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      try {
        await deleteMenuItem(id);
        fetchItems();
        alert("Item deleted successfully.");
      } catch (err: any) {
        console.error("Delete menu item error:", err);
        alert(
          `Failed to delete item: ${err.response?.data?.message || err.message}`
        );
      }
    }
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      formData.price == null ||
      formData.price <= 0 ||
      !formData.category
    ) {
      setError("Name, positive Price, and Category are required."); // Set error state
      return;
    }

    setIsSubmitting(true);
    const payload = { ...formData };

    try {
      let message = "";
      if (currentItem) {
        await updateMenuItem(currentItem.id, payload);
        message = "Menu item updated successfully.";
      } else {
        await createMenuItem(payload as CreateMenuItemPayload);
        message = "Menu item created successfully.";
      }
      fetchItems();
      resetAndHideForm();
      alert(message);
    } catch (err: any) {
      console.error("Save menu item error:", err);
      setError(err.response?.data?.message || "Failed to save menu item."); // Set error state
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- JSX ---
  return (
    <div>
      <h2>Manage Menu Items</h2>
      {!isFormVisible && (
        <button
          onClick={handleAddNew}
          className="button button-primary"
          style={{ marginBottom: "1rem" }}
        >
          Add New Item
        </button>
      )}

      {isFormVisible && (
        <div className={styles.formContainer}>
          <h3>{currentItem ? "Edit" : "Add New"} Menu Item</h3>
          {/* Tampilkan error state di sini */}
          {error && <p className="alert alert-danger">{error}</p>}
          <form onSubmit={handleFormSubmit}>
            {/* ... input fields (name, description, price, category, image_url, is_available) ... */}
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="form-control"
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-control"
                rows={3}
                disabled={isSubmitting}
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="price">Price *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                step="0.01"
                min="0.01"
                className="form-control"
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="form-control"
                disabled={isSubmitting}
              >
                {/* Default option ditambahkan */}
                <option value={MenuItemCategory.OTHER}>Other</option>
                <option value={MenuItemCategory.HOT}>Hot</option>
                <option value={MenuItemCategory.COLD}>Cold</option>
                <option value={MenuItemCategory.FOOD}>Food</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="image_url">Image URL</label>
              <input
                type="url"
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                className="form-control"
                disabled={isSubmitting}
              />
            </div>
            <div
              className="form-group"
              style={{ display: "flex", alignItems: "center" }}
            >
              <input
                type="checkbox"
                id="is_available"
                name="is_available"
                checked={formData.is_available ?? true}
                onChange={handleInputChange}
                style={{ marginRight: "0.5rem", width: "auto" }}
                disabled={isSubmitting}
              />
              <label htmlFor="is_available" style={{ marginBottom: 0 }}>
                Available
              </label>
            </div>
            <div className={styles.formActions}>
              <button
                type="submit"
                className="button button-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Item"}
              </button>
              <button
                type="button"
                onClick={resetAndHideForm}
                className="button button-secondary"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tampilkan error fetch utama di sini */}
      {loading && <p>Loading menu...</p>}
      {!loading && error && !isFormVisible && (
        <p className="alert alert-danger">{error}</p>
      )}
      {!loading && !error && items.length === 0 && !isFormVisible && (
        <p>No menu items found. Click 'Add New Item' to start.</p>
      )}

      {!loading && items.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table className={styles.dataTable}>
            {/* ... thead dan tbody tabel ... */}
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Available</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>${Number(item.price).toFixed(2)}</td>
                  <td>{item.category}</td>
                  <td>{item.is_available ? "Yes" : "No"}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(item)}
                      className={`${styles.actionButton} ${styles.editButton}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MenuManagementPage;
