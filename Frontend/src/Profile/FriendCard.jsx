import { Avatar } from '../Components/Avatar';
import styles from '../Styling/FriendCard.module.css';

export function FriendCard({ friend, onClick }) {
    return (
        <li
            className={styles.card}
            onClick={() => onClick(friend)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick(friend);
                }
            }}
        >
            <Avatar src={friend.avatar_url} username={friend.username} size={40} />
            <div className={styles.info}>
                <span className={styles.username}>{friend.username}</span>
                {friend.display_name && friend.display_name !== friend.username && (
                    <span className={styles.displayName}>{friend.display_name}</span>
                )}
            </div>
        </li>
    );
}