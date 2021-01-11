import React from 'react'

export default function Notifications ({ notifications }) {
    return (
        <div className="fixed bottom-0 right-0 z-50 p-6">
            {notifications.map(n => (
                <div key={n.id} className={`px-6 py-2 mt-4 text-white ${n.type === 'success' ? 'bg-green-500' : 'bg-red-500'} rounded-xl`}>{n.text}</div>
            ))}
      </div>
    )
}
