import { useTheme } from '../../hooks/useTheme.ts';

const Spinner : React.FC = () => {
    const { theme } = useTheme();
    return <div className={`spinner ${theme}`} data-testid="spinner"></div>;
}

export default Spinner;
