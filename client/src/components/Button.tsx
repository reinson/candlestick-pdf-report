import React from 'react';
import styles from './Button.module.css';

type ButtonProps = {
    onClick: () => void,
    loading: boolean,
}

export default function Button({ onClick, loading }: ButtonProps) {
    return (
        <div onClick={onClick} className={styles.button}>
            {loading ? <div className={styles.spinner} /> : 'Generate'}
        </div>
    )
}
