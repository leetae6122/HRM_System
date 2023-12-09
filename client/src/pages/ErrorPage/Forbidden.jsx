import { useNavigate } from 'react-router-dom';
import { Button, Card, Result } from 'antd';
import 'assets/styles/authPage.scss';

const Forbidden = () => {
  const navigate = useNavigate();
  const handleBackHome = () => {
    navigate('/');
  };
  return (
    <div className="body-auth">
      <Card style={{ width: '100vh' }}>
        <Result
          status="403"
          title="403"
          subTitle="Sorry, you are not authorized to access this page."
          extra={
            <Button type="primary" onClick={handleBackHome}>
              Back Home
            </Button>
          }
        />
      </Card>
    </div>
  );
};

export default Forbidden;
