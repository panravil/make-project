import React from 'react';
import styles from './MatchMeModal.module.scss';

export default function MatchMeModal() {
    return (
        <div className={styles.matchMeContainer}>
            <img src='/en/logos/image.png' alt='Matchme logo' className={styles.image} />
            <div className={styles.title}>Can't find the right partner?</div>
            <div className={styles.content}>Create and automate complex workflows.</div>
            <button className={styles.matchmeButton}>Match me</button>
        </div>
    )
}