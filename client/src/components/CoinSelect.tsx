import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import styles from './CoinSelect.module.css';

type CoinSelectProps = {
    setSelectedCoin: (coin: CoinOption | null) => void
}

export type CoinOption = {
    label: string;
    icon: string;
    key: string;
}

const iconURLBase = 'https://s3.eu-central-1.amazonaws.com/bbxt-static-icons/type-id/png_32/';

const formatOptionLabel = ({ label, icon }: CoinOption) => (
    <div className={styles.coinOption}>
        <img className={styles.icon} src={`${iconURLBase}${icon}`} alt={`${label}-icon`}></img>
        <span>{label}</span>
    </div>
);

export default function CoinSelect({ setSelectedCoin }: CoinSelectProps) {
    const [options, setOptions] = useState<CoinOption[]>([]);

    useEffect(() => {
        const fetchOptions = async () => {
            const result = await fetch('/options.json');
            const options = await result.json();

            setOptions(options);
        }

        fetchOptions().catch(console.error);
    }, [])

    return (
        <div className={styles.coinSelect}>
            <span>Select coin: </span>
            <Select
                className={styles.select}
                isSearchable={true}
                onChange={setSelectedCoin}
                options={options}
                formatOptionLabel={formatOptionLabel}
                placeholder=''
            />
        </div>
    );
}
