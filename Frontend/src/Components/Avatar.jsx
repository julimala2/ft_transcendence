import styles from '../Styling/Avatar.module.css';

export function Avatar({ src, username, size = 40 }) {
    const initial = username?.[0]?.toUpperCase() ?? '?';

    if (src) {
        return (
            <img
                src={src}
                alt={username}
                className={styles.avatar}
                style={{ width: size, height: size }}
            />
        );
    }

    return (
        <div
            className={styles.fallback}
            style={{ width: size, height: size, fontSize: size * 0.45 }}
        >
            {initial}
        </div>
    );
}