import React, { createContext, useState, useCallback } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Function to update user data
    const updateUser = useCallback((userData) => {
        setUser(userData);
    }, []);

    // Function to clear user data (on logout)
    const clearUser = useCallback(() => {
        setUser(null);
    }, []);

    return (
        <UserContext.Provider
            value={{
                user,
                updateUser,
                clearUser,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;