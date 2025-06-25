const Notification = ({ message, type }) => {
    if (!message) return null;

    const notificationStyle = {
        color: type === 'error' ? 'red' : 'green',
        background: 'lightgray',
        fontSize: 16,
        border: `2px solid ${type === 'error' ? 'red' : 'green'}`,
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    };

    return (
        <div style={notificationStyle} className="notification">
            {message}
        </div>
    );
};

export default Notification;