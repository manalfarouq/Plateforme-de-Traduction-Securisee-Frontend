"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiService } from "@/lib/apiService";
import "@/styles/terminal.css";

interface User {
  id: number;
  username: string;
  role: string;
  created_at: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est admin
    const checkAdminAccess = async () => {
      try {
        const session = localStorage.getItem("user_session");
        if (!session) {
          router.push("/login");
          return;
        }

        const user = JSON.parse(session);
        if (user.role !== "admin") {
          router.push("/translator");
          return;
        }

        setUserRole(user.role);

        // Récupérer tous les users
        const allUsers = await apiService.getAllUsers();
        setUsers(allUsers);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Erreur lors du chargement";
        setError(errorMsg);
        console.error("Erreur:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAccess();
  }, [router]);

  if (isLoading) {
    return (
      <div className="terminal-form">
        <div className="terminal-line">{">>> CHARGEMENT DES UTILISATEURS..."}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="terminal-form">
        <div className="terminal-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="terminal-form">
      <div className="terminal-line">{">>> HISTORIQUE DES UTILISATEURS INSCRITS"}</div>

      <div style={{ marginTop: "20px" }}>
        <div className="terminal-line">
          {">>> Total:"} {users.length} utilisateur(s)
        </div>

        <div style={{ marginTop: "15px", marginBottom: "15px", borderTop: "1px solid #00ff00", paddingTop: "10px" }}>
          {users.length === 0 ? (
            <div className="terminal-line">{">>> Aucun utilisateur trouvé"}</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #00ff00" }}>
                  <th style={{ textAlign: "left", padding: "8px", color: "#00ff00" }}>ID</th>
                  <th style={{ textAlign: "left", padding: "8px", color: "#00ff00" }}>Username</th>
                  <th style={{ textAlign: "left", padding: "8px", color: "#00ff00" }}>Rôle</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={{ borderBottom: "1px solid #333333" }}>
                    <td style={{ padding: "8px" }}>{user.id}</td>
                    <td style={{ padding: "8px" }}>{user.username}</td>
                    <td style={{ padding: "8px", color: user.role === "admin" ? "#ff00ff" : "#00ff00" }}>
                      {user.role.toUpperCase()}
                    </td>
                    <td style={{ padding: "8px", fontSize: "12px" }}>
                      {new Date(user.created_at).toLocaleString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ marginTop: "20px" }}>
          <a
            href="/translator"
            style={{
              color: "var(--color-primary)",
              textDecoration: "underline",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            ← Retour au traducteur
          </a>
        </div>
      </div>
    </div>
  );
}