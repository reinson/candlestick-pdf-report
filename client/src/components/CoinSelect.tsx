import React from 'react';
import Select from 'react-select';

type CoinSelectProps = {
    selectedCoin: string | null;
    setSelectedCoin: (coin: string | null) => void
}

const options = [
    { value: 'BTC', label: 'Bitcoin', icon: 'https://s3.eu-central-1.amazonaws.com/bbxt-static-icons/type-id/png_32/4caf2b16a0174e26a3482cea69c34cba.png' },
    { value: 'ETH', label: 'Ethereum', icon: 'https://s3.eu-central-1.amazonaws.com/bbxt-static-icons/type-id/png_32/604ae4533d9f4ad09a489905cce617c2.png' },
    { value: 'TOR', label: 'TOR', icon: 'https://s3.eu-central-1.amazonaws.com/bbxt-static-icons/type-id/png_32/ebd3726585004a99926148fbc0689529.png' },
];

//@ts-ignore
const CustomOption = ({ innerProps, isDisabled, data }) =>
    !isDisabled ? (
        <div {...innerProps}>{
            <div>
                <span>
                    <img src={data.icon} alt={`${data.label}-icon`}></img>
                </span>
                <span>{data.label}</span>
            </div>
        }</div>
    ) : null;


export default function CoinSelect({ setSelectedCoin, selectedCoin }: CoinSelectProps) {


    return (
        <div className="Coin-select">
            <Select
                isSearchable={true}
                defaultValue={selectedCoin}
                onChange={setSelectedCoin}
                //@ts-ignore
                options={options}
                components={{ Option: CustomOption }}
            />
        </div>
    );
}
