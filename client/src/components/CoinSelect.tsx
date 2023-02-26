import React from 'react';
import Select from 'react-select';
import styles from './CoinSelect.module.css';

type CoinSelectProps = {
    setSelectedCoin: (coin: CoinOption | null) => void
}

export type CoinOption = {
    label: string;
    icon: string;
    value: string;
}

const options = [
    { value: 'BTC', label: 'Bitcoin', icon: 'https://s3.eu-central-1.amazonaws.com/bbxt-static-icons/type-id/png_32/4caf2b16a0174e26a3482cea69c34cba.png' },
    { value: 'ETH', label: 'Ethereum', icon: 'https://s3.eu-central-1.amazonaws.com/bbxt-static-icons/type-id/png_32/604ae4533d9f4ad09a489905cce617c2.png' },
    { value: 'TOR', label: 'TOR', icon: 'https://s3.eu-central-1.amazonaws.com/bbxt-static-icons/type-id/png_32/ebd3726585004a99926148fbc0689529.png' },
];

const formatOptionLabel = ({ label, icon }: CoinOption) => (
    <div className={styles.coinOption}>
        <img className={styles.icon} src={icon} alt={`${label}-icon`}></img>
        <span>{label}</span>
    </div>
);

export default function CoinSelect({ setSelectedCoin }: CoinSelectProps) {
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
