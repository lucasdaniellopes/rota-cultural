import styles from './Select.module.css';

export interface SelectProps {
  value?: string;
  onChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

export default function Select({
  value,
  onChange,
  children,
  className = '',
  disabled = false,
  placeholder
}: SelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      className={`${styles.select} ${className}`}
      disabled={disabled}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {children}
    </select>
  );
}