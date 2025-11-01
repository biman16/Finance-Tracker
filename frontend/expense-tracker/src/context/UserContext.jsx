import React, { createContext, useState } from "react";

export const UserContext = createContext();

const [user, setUser] useState(null);

//Function to update user data
const updateUser = (userData) => {
    setUser(userData);
};

//Function to clear user data (on logout)
const clearUser = () => {
    setUser(null);
}