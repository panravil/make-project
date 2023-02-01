import React from 'react';
import styles from './MatchMeModal.module.scss';

export default function MatchMeModal() {
    return (
        <div className={styles.matchMeContainer}>
            <img src='https://images.ctfassets.net/qqlj6g4ee76j/blog-image-13845/61107356d9d238bec260889da91210e7/file.png' alt='Matchme logo' className={styles.image} />
            <div className={styles.title}>Can't find the right partner?</div>
            <div className={styles.content}>Create and automate complex workflows.</div>
            <button className={styles.matchmeButton}>Match me</button>
        </div>
    )
}