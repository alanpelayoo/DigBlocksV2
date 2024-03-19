import React from 'react'
import { OverlayTrigger, Tooltip} from 'react-bootstrap';

function Info({ children, tooltipMessage} ) {
    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            {tooltipMessage}
        </Tooltip>
    );
  return (
    <OverlayTrigger
      placement="right"
      delay={{ show: 250, hide: 400 }}
      overlay={renderTooltip}
    >
        {children}
    </OverlayTrigger>
  )
}

export default Info