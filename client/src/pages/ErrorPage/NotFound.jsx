import { useNavigate } from 'react-router-dom';
import { Button, Card, Result } from 'antd';
import 'assets/styles/authPage.scss';

const NotFound = () => {
  const navigate = useNavigate();
  const handleBackHome = () => {
    navigate('/');
  };
  return (
    <div className="body-auth">
      <Card style={{width: '100vh'}}>
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
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

export default NotFound;
