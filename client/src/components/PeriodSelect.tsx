import React from 'react';
import Select from 'react-select';
import styles from './PeriodSelect.module.css';

export enum TimePeriod {
    DAY = 'DAY',
    WEEK = 'WEEK',
    MONTH = 'MONTH',
    QUARTER = 'QUARTER',
    YEAR = 'YEAR',
}

type PeriodSelectProps = {
    setSelectedPeriod: (period: TimePeriodOption | null) => void
}

export type TimePeriodOption = {
    key: TimePeriod, label: string
}

const timePeriodOptions: TimePeriodOption[] = [
    { key: TimePeriod.DAY, label: 'Day' },
    { key: TimePeriod.WEEK, label: 'Week' },
    { key: TimePeriod.MONTH, label: 'Month' },
    { key: TimePeriod.QUARTER, label: 'Quarter' },
    { key: TimePeriod.YEAR, label: 'Year' },
]

const formatOptionLabel = ({ label }: TimePeriodOption) => (
    <div className={styles.option}>
        <span>{label}</span>
    </div>
);

export default function PeriodSelect({ setSelectedPeriod }: PeriodSelectProps) {
    return (
        <div className={styles.periodSelect}>
            <span>Select period: </span>
            <Select<TimePeriodOption>
                className={styles.select}
                isSearchable={true}
                onChange={setSelectedPeriod}
                getOptionLabel={(option: TimePeriodOption) => option.label}
                getOptionValue={(option: TimePeriodOption) => option.key}
                options={timePeriodOptions}
                placeholder=''
                formatOptionLabel={formatOptionLabel}
            />
        </div>
    );
}
