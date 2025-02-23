import { useTheme } from '../../ThemeContext.tsx';

const Spinner : React.FC = () => {
    const { theme } = useTheme();
    return <div className={`spinner ${theme}`} data-testid="spinner"></div>;
}

export default Spinner;
