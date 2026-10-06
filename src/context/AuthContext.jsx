import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

const USERS_STORAGE_KEY = 'cpts_registered_users';
const CURRENT_USER_KEY = 'cpts_current_user';

// Initial default user for quick demo testing
const DEFAULT_USER = {
  id: 'usr_admin',
  name: 'Admin Dispatcher',
  email: 'admin@cpts.io',
  password: 'Password123!',
  role: 'admin',
  createdAt: new Date().toISOString()
};

export const AuthProvider = ({ children }) => {
  // All registered users persisted in LocalStorage
  const [users, setUsers] = useState(() => {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([DEFAULT_USER]));
      return [DEFAULT_USER];
    } catch (e) {
      return [DEFAULT_USER];
    }
  });

  // Current authenticated user session persisted in LocalStorage
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  // Keep LocalStorage in sync when users list updates
  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Error saving users to localStorage:', e);
    }
  }, [users]);

  // Keep LocalStorage in sync when current user changes
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    } catch (e) {
      console.error('Error saving current user to localStorage:', e);
    }
  }, [currentUser]);

  // Login action
  const loginUser = (email, password) => {
    const trimmedEmail = email.trim().toLowerCase();
    const user = users.find(
      (u) => u.email.toLowerCase() === trimmedEmail && u.password === password
    );

    if (!user) {
      toast.error('Invalid email or password. Please try again.');
      return { success: false, message: 'Invalid credentials' };
    }

    setCurrentUser(user);
    toast.success(`Welcome back, ${user.name}!`);
    return { success: true, user };
  };

  // Register action
  const registerUser = ({ name, email, password, role = 'user' }) => {
    const trimmedEmail = email.trim().toLowerCase();
    const exists = users.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (exists) {
      toast.error('An account with this email address already exists!');
      return { success: false, message: 'Email already registered' };
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: trimmedEmail,
      password,
      role,
      createdAt: new Date().toISOString()
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser); // Auto-login upon registration
    toast.success(`Welcome to DropPoint, ${newUser.name}!`);
    return { success: true, user: newUser };
  };

  // Reset password action
  const resetPassword = (email, newPassword) => {
    const trimmedEmail = email.trim().toLowerCase();
    const index = users.findIndex((u) => u.email.toLowerCase() === trimmedEmail);

    if (index === -1) {
      toast.error('No account found with this email address.');
      return { success: false, message: 'Account not found' };
    }

    setUsers((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], password: newPassword };
      return copy;
    });

    toast.success('Password successfully reset! You can now log in.');
    return { success: true };
  };

  // Logout action
  const logoutUser = () => {
    setCurrentUser(null);
    toast.info('You have been logged out.');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        users,
        loginUser,
        registerUser,
        resetPassword,
        logoutUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
