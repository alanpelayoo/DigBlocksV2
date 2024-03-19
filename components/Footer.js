import React from 'react'
// Import the FontAwesomeIcon component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// import the icons you need
import { faXTwitter, faGithub } from "@fortawesome/free-brands-svg-icons";

function Footer() {
  return (
    <footer className='bg-primary' >
        <div>
            <a href='https://twitter.com/realapcodes' target="_blank"><FontAwesomeIcon className="me-3 fs-3" icon={faXTwitter} /></a>
            <a href='https://github.com/alanpelayoo' target="_blank"><FontAwesomeIcon className="fs-3" icon={faGithub} /></a>
        </div>
        <hr></hr>
        <p>Build by <a href='https://www.apcodes.xyz/' target="_blank"  className='ap-link'>apcodes.</a></p>
    </footer>
  )
}

export default Footer