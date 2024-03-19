import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

function AlertDismissibleExample() {
  const [show, setShow] = useState(true);

  if (show) {
    return (
      <Alert variant="primary text-start " onClose={() => setShow(false)} dismissible>
        <Alert.Heading className='alert-heading'>Congrats! 🎉</Alert.Heading>
        <p className='text-start alert-text'>
          You deposited eth in the launch week of blast, you are a blast pioneer!
        </p>
      </Alert>
    );
  }
  return null
}

export default AlertDismissibleExample;