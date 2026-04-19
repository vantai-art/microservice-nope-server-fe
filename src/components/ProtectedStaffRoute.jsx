// src/components/ProtectedStaffRoute.jsx
// ✅ Dùng AppContext — BE không trả JWT, trả object user trực tiếp
import { Navigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'

function ProtectedStaffRoute({ children }) {
    const { user } = useApp()

    if (!user) {
        return <Navigate to="/staff/login" replace />
    }

    const role = user.role || ''
    if (role !== 'ROLE_STAFF' && role !== 'ROLE_ADMIN') {
        return <Navigate to="/staff/login" replace />
    }

    return children
}

export default ProtectedStaffRoute