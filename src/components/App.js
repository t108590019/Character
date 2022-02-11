import React, { useState } from 'react';
import Web3 from 'web3'
import './App.css';
import {Navbar, Container, Button, Alert, Row, Col, Card} from 'react-bootstrap'; 
import Character from './../abis/Character.json';
import 'bootstrap/dist/css/bootstrap.min.css'; 

const App = () => {
  const [account, setAccount] = useState('null');
  const [Quantity, setQuantity] = useState(0);
  const cardArray = [
    {
      name: 'zero',
      img: '/images/zero.png'
    },
    {
      name: 'one',
      img: '/images/one.png'
    },
    {
      name: 'two',
      img: '/images/two.png'
    }
  ]
  
  const { ethereum } = window;

  const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  const connectAccount = async () => {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0])
    console.log("connectAccount" + accounts[0])
    window.web3 = new Web3(window.ethereum)
    const web3 = window.web3
    const networkId = await web3.eth.net.getId();
    const networkData = Character.networks[networkId]

    if(networkData){
      const abi = Character.abi
      const address = networkData.address
      const token = new web3.eth.Contract(abi, address)

      //mint attr
      /*await token.methods.mint(0, "Hat", "equip", window.location.origin + '/images/zero.png').send({from: accounts[0]})
      .then(console.log)*/
 
      //attach Hat to tokenId=0
      await token.methods.name(0).call().then(console.log)
      /*const temp = await token.methods.balanceOf(0, 0).call()
      console.log(temp)

      setQuantity(async () => await token.methods.balanceOf(0, 0).call())*/
  }
}

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
    console.log("isConnect" + account)
    if(account != 'null'){
      return(<p variant='light'>{account}</p>)
    }
    else{
      return(
        <Button 
          className="d-flex" 
          variant='outline-light' 
          onClick={connectAccount}>
        Connect Wallect
        </Button>
      )
    }
  }

  const imageGenerator = () =>{
    return window.location.origin + '/images/zero.png'
  }
  

  const render = () =>{
    
    if(isMetaMaskInstalled()){
      return(
        <div>
          {nav()}
          <Container>
            <Row>
              <Col  md="auto" >
                  <img
                  src={imageGenerator()}/>
              </Col>
              <Col><Button variant='outline-success'>組合</Button></Col>
              <Col><Button variant='outline-danger'>拆分</Button></Col>
              <Col>{Quantity}</Col>
            </Row>
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
