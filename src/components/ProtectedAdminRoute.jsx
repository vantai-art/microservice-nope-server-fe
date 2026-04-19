// src/components/ProtectedAdminRoute.jsx
// ✅ Dùng AppContext để check role — BE không trả JWT, trả object user trực tiếp
import { Navigate, useLocation } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'

function ProtectedAdminRoute({ children }) {
    const location = useLocation()
    const { user } = useApp()

    if (!user) {
        return <Navigate to="/admin/login" replace state={{ from: location }} />
    }

    if (user.role !== 'ROLE_ADMIN') {
        return <Navigate to="/admin/login" replace />
    }

    return children
}

export default ProtectedAdminRoute