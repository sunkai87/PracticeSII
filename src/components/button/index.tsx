import styles from './Button.module.css';
interface ButtonProps {
 label: string;
 onClick: () => void;
 color?: 'blue' | 'red';
 size?: 'small' | 'medium' | 'large';
}
export const Button = ({ label, onClick, color = 'blue', size = 'medium' }: 
    ButtonProps) => {
 return (
 <button
 className={`${styles.btn} ${styles[`btn-${color}`]}
${styles[`btn-${size}`]}`}
 onClick={onClick}
 >
 {label}
 </button>
 );
};
