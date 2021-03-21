import cx from 'classnames';
import { useNotifications } from '../../context/notifications-context';

export default function Notifications () {
    const [ notifications ] = useNotifications();

    const ntfClass = (type) => {
        return cx({
            'bg-green-500': type === 'success',
            'bg-red-500': type === 'error'
        });
    }

    if (notifications.length !== 0) {
        return (
            <div className="fixed bottom-0 right-0 z-50 p-6">
                {notifications.map(n => (
                    <div key={n.id} className={cx('px-6 py-2 mt-4 text-white rounded-xl', ntfClass(n.type))}>{n.text}</div>
                ))}
            </div>
        );
    } else {
        return <></>
    }
}
