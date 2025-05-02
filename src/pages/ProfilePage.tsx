import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { getProfile } from "../api/userApi"; // Asumsi API ini ada
import styles from "./styles/ProfilePage.module.css";
import { User } from "../types";
import { format } from 'date-fns';

const ProfilePage: React.FC = () => {
  const { user: authUser, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      // Jika user dari context sudah ada, gunakan itu, jika tidak, fetch ulang
      if (authUser) {
        setProfile(authUser);
        setLoading(false);
      } else if (!authLoading) {
        // Hanya fetch jika auth tidak loading dan user null
        setLoading(true);
        setError(null);
        try {
          const data = await getProfile();
          setProfile(data);
        } catch (err) {
          console.error("Failed to fetch profile:", err);
          setError("Could not load your profile.");
        } finally {
          setLoading(false);
        }
      }
    };

    // Tunggu sampai status autentikasi selesai loading
    if (!authLoading) {
      fetchProfile();
    }
  }, [authUser, authLoading]); // Re-run jika user atau status loading auth berubah

  if (loading || authLoading) {
    return (
      <div className="container">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <p className="alert alert-danger">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container">
        <p>Could not load profile data.</p>
      </div>
    );
  }

  return (
    <div className={`container ${styles.profileContainer}`}>
      <h1 className={styles.title}>Your Profile</h1>
      <div className={styles.profileCard}>
        <p>
          <strong>Name:</strong> {profile.name}
        </p>
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p>
          <strong>Role:</strong> {profile.role}
        </p>
        <p>
          <strong>Joined:</strong>{" "}
          {profile.created_at
            ? format(new Date(profile.created_at), "PPP")
            : "N/A"}
        </p>
        {/* Tambahkan tombol Edit Profile jika diperlukan */}
        {/* <Link to="/profile/edit" className="button button-secondary">Edit Profile</Link> */}
      </div>
    </div>
  );
};

export default ProfilePage;
