import { useBank } from '@/context/BankContext';
import { LoginForm } from '@/components/LoginForm';
import { Dashboard } from '@/components/Dashboard';

const Index = () => {
  const { currentUser } = useBank();

  if (!currentUser) {
    return <LoginForm />;
  }

  return <Dashboard />;
};

export default Index;
