
import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Link from 'next/link';

import Image from 'next/image';

function Header() {
  return (
    <Navbar bg="primary" variant="dark">
        <Container >
            <Link href="/">
                <Navbar.Brand className='d-flex'>
                    <Image
                        alt="Logo"
                        src="/logos/white.png" 
                        width={90}
                        height={50}                    
                        className="d-inline-block align-top"
                    />
                </Navbar.Brand>
            </Link>
            <Navbar.Collapse id="basic-navbar-nav" className='links'>
                <Nav className="me-auto d-none d-md-flex">
                    <Nav.Link as={Link} href='/'>Home</Nav.Link>
                    <Nav.Link as={Link} href='/blocks'>Blocks</Nav.Link>
                    <Nav.Link as={Link} href='/txs'>Transactions</Nav.Link>
                    <Nav.Link as={Link} href='/blast'>Blast</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>
  )
}

export default Header