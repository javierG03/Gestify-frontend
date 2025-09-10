"use client"

import { createContext, useState, useEffect } from "react"
import axiosInstance from "./AxiosInstance"

// Crear el contexto de autenticación
export const AuthContext = createContext()

// Componente proveedor de autenticación
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("access_token"))
  const [userId, setUserId] = useState(null)
  const [email, setEmail] = useState(null)
  const [permissions, setPermissions] = useState([])
  const [role, setRole] = useState(null)
  const [name, setName] = useState(null)
  const [lastName, setLastName] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authInitialized, setAuthInitialized] = useState(false)
  const [error, setError] = useState(null)

  // Función para decodificar el JWT
  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1]
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error("Error parsing JWT:", error)
      return null
    }
  }

  // Función para inicializar la autenticación
  const checkBackendStatus = async () => {
    try {
      const response = await axiosInstance.get("/") // Ruta de salud del backend
      return response.status === 200
    } catch (error) {
      console.error("Error al verificar el estado del backend:", error)
      return false
    }
  }

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true)
      const backendReady = await checkBackendStatus()

      if (!backendReady) {
        setError("El backend no está disponible. Por favor, inténtelo más tarde.")
        setLoading(false)
        return
      }

      // Obtén el token del localStorage
      const token = localStorage.getItem("access_token")
      if (token) {
        const decodedToken = parseJwt(token)
        console.log("Token decodificado:", decodedToken)

        // Verifica si el token es válido y no ha expirado
        if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
          setUserId(decodedToken.id_user)
          setEmail(decodedToken.email || "")
          setRole(decodedToken.id_role)
          setName(decodedToken.name || "")
          setLastName(decodedToken.last_name || "")
          console.log("ID de usuario establecido:", decodedToken.id_user)
        } else {
          console.warn("El token es inválido o ha expirado")
          localStorage.removeItem("access_token")
          setIsAuthenticated(false)
          setRole(null)
          setName(null)
          setLastName(null)
        }
      } else {
        setIsAuthenticated(false)
        setRole(null)
        setName(null)
        setLastName(null)
      }
      setLoading(false)
      setAuthInitialized(true)
    }

    initializeAuth()
  }, [])

  // Función para manejar el login
  const login = async (token) => {
    try {
      localStorage.setItem("access_token", token)
      setIsAuthenticated(true)
      const decodedToken = parseJwt(token)
      console.log("Login - Token decodificado:", decodedToken)

      if (decodedToken) {
        setUserId(decodedToken.id_user)
        setRole(decodedToken.id_role)
        setName(decodedToken.name || "")
        setLastName(decodedToken.last_name || "")
        console.log("Login - ID de usuario establecido:", decodedToken.id_user)
      }
    } catch (error) {
      console.error("Error durante el login:", error)
      setError("Error durante el login. Por favor, inténtelo de nuevo.")
    }
  }

  // Función para manejar el logout
  const logout = () => {
    try {
      localStorage.removeItem("access_token")
      setIsAuthenticated(false)
      setUserId(null)
      setEmail(null)
      setRole(null)
      setPermissions([])
      setName(null)
      setLastName(null)
      setError(null)
    } catch (error) {
      console.error("Error durante el logout:", error)
      setError("Error durante el logout. Por favor, inténtelo de nuevo.")
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userId,
        email,
        permissions,
        role,
        name,
        lastName,
        loading,
        authInitialized,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}