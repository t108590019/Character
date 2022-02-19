import React, { useEffect, useState } from 'react';
import Web3 from 'web3'
import './App.css';
import {Navbar, Container, Button, Alert, Row, Col, Card} from 'react-bootstrap'; 
import Character from './../abis/Character.json';
import 'bootstrap/dist/css/bootstrap.min.css'; 

const App = () => {
  const { ethereum } = window;

  const [account, setAccount] = useState(null)
  const [token, setToken] = useState(null)
  const [attrQuantity, setQuantity] = useState(3);
  const [cardArray, set_cardArray] = useState([])

  useEffect(() =>{
    const init = async () =>{
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      setAccount(prev => accounts[0])
      window.web3 = new Web3(window.ethereum)
      const web3 = window.web3
      const networkId = await web3.eth.net.getId();
      const networkData = Character.networks[networkId]

      if(networkData){
        const abi = Character.abi
        const address = networkData.address
        const Token = new web3.eth.Contract(abi, address)
        setToken(prev => Token)

        const count = await Token.methods.getQuantity().call()
        setQuantity((prev) => count)
      }
    }
    init();
  }, [])

  useEffect(() =>{
    const add = async (attrQuantity) => {
      if(token != null) {
        for (let i = 0 ; i < attrQuantity ; i++){
          const _name = await token.methods.get_attrName(i).call()
          const _img = await token.methods.attrURI(i).call()
          set_cardArray((prev) =>[
            ...prev,
            {
              id: i,
              name: _name,
              img: _img,
            },
          ]);
        }
      }
    }
    add(attrQuantity);
  }, [attrQuantity])

    
  
  

  const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  
  const nav = () =>{
    return (
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">GameNFT Workshop</Navbar.Brand>
          <Navbar.Brand>{isConnect()}</Navbar.Brand>
        </Container>        
      </Navbar>
    )
  }

  const isConnect = () => {
    if(account != null){
      return(<p variant='light'>{account}</p>)
    }
    else{
      return(
        <Button 
          className="d-flex" 
          variant='outline-light' >
        Connect Wallect
        </Button>
      )
    }
  }

  const attribute = cardArray.map((data) =>{
    console.log(cardArray)
    return(
    <Col md="auto" >
        <Button 
        variant='outline-primary'
        id={data.id}
        onClick={(e) => {
          const _id = e.target.getAttribute('id')
          const attach = async (_id) =>{
            await token.methods.attach(0, _id, 1).send({from: account})
          }
          attach(_id)
        }}>
        {data.name}
        </Button>
    </Col>
    )
  })

  const render = () =>{
    if(isMetaMaskInstalled()){
      return(
        <div>
          {nav()}
          <Container>
            <Row>
              {attribute}
            </Row>
            <br/>
          </Container>
        </div>
      )
    }
    else{
      return(
      <div>
        <Alert variant='danger'>You not install Metamask </Alert>
      </div>
      )
    }
  }


  return (
      <div>
        {render()}
      </div>
  );
}

export default App;
