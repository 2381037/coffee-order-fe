import React, { useState, useEffect } from "react";
import { getMenuItems } from "../api/menuApi";
import { MenuItem, MenuItemCategory } from "../types";
import MenuItemCard from "../components/MenuItemCard/MenuItemCard";
import styles from "./styles/MenuPage.module.css";

const MenuPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>(""); // '' untuk semua

  // TODO: Implement pagination state (currentPage, totalPages, limit)

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      setError(null);
      try {
        const params: { category?: string } = {};
        if (categoryFilter) {
          params.category = categoryFilter;
        }
        // Tambahkan params pagination di sini jika diimplementasikan
        const response = await getMenuItems(params);
        setMenuItems(response.data);
        // Set state pagination di sini
      } catch (err) {
        console.error("Failed to fetch menu items:", err);
        setError("Could not load menu items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [categoryFilter]); // Fetch ulang jika filter berubah

  return (
    <div className="container">
      <h1 className={styles.title}>Our Menu</h1>

      <div className={styles.filters}>
        <label htmlFor="category">Filter by Category: </label>
        <select
          id="category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All</option>
          {Object.values(MenuItemCategory).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading menu...</p>}
      {error && <p className="alert alert-danger">{error}</p>}

      {!loading && !error && (
        <>
          {menuItems.length === 0 ? (
            <p>
              No menu items found{" "}
              {categoryFilter ? `for category "${categoryFilter}"` : ""}.
            </p>
          ) : (
            <div className={styles.menuGrid}>
              {menuItems.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
          {/* TODO: Tambahkan komponen Pagination di sini */}
        </>
      )}
    </div>
  );
};

export default MenuPage;
