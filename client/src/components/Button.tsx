import React from 'react';
import styles from './Button.module.css';

type ButtonProps = {
    onSubmit: () => void,
    loading: boolean,
}

export default function Button({ onSubmit, loading }: ButtonProps) {
    const onClick = () => {
        if (!loading) {
            onSubmit();
        }
    }

    return (
        <div onClick={onClick} className={styles.button}>
            {loading ? <div className={styles.spinner} /> : 'Generate'}
        </div>
    )
}
