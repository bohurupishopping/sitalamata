import React, { createContext, useEffect, useState } from "react";
    import { auth } from "../firebase";

    export const AuthContext = createContext();

    export function AuthProvider({ children }) {
      const [currentUser, setCurrentUser] = useState(null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          setCurrentUser(user);
          setLoading(false);
        });

        return unsubscribe;
      }, []);

      const value = {
        currentUser,
      };

      return (
        <AuthContext.Provider value={value}>
          {!loading && children}
        </AuthContext.Provider>
      );
    }

    export function useAuth() {
      return React.useContext(AuthContext);
    }
