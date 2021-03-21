import { createContext, useContext, useState } from "react"

const NotificationContext = createContext()

function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationsProvider')
    }
    return context;
}

function NotificationsProvider({children}) {
    const [notifications, setNotifications] = useState([])

    const notify = (text, type = 'success') => {
        const notification =  { id: Math.ceil(Math.random() * 1000000), text, type}
        setNotifications([...notifications, notification])
        setTimeout(() => setNotifications(notifications => notifications.filter(nft => nft.id !== notification.id)), 1000)
    }

    return <NotificationContext.Provider value={[notifications, notify]}>{children}</NotificationContext.Provider>
}

export {
    useNotifications,
    NotificationsProvider
}
