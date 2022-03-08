import React, { useEffect, useState } from 'react';
import { create } from 'ipfs-http-client';
import Web3 from 'web3'
import './App.css';
import {Navbar, Container, Button, Alert, Row, Col} from 'react-bootstrap'; 
import Character from './../abis/Character.json';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const { ethereum } = window;
  const baseHeader= "https://gateway.pinata.cloud/ipfs/";

  //Token array is mint option
  const tokenOptions= [{
      id: 0,
      name: 'belt',
      img: '/images/belt.jpeg',
    },
    {
      id: 1,
      name: 'cloth',
      img: '/images/cloth.jpeg',
    }
  ]

  const [account, setAccount] = useState(null)
  const [token, setToken] = useState(null)
  const [attrQuantity, setQuantity] = useState(3);          //The number of attribute mint by contract
  const [cardArray, set_cardArray] = useState([])           //Token mint option
  const [tokenOwnQuantity, setTokenOwnQuantity] = useState(0)               //The number of tokens owned by account
  const [tokenOwnArray, setTokenOwnArray] = useState([])    //The token data owned by account

  useEffect(() =>{
    const init = async () =>{
      //get account that connect site from metamask
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      setAccount(prev => accounts[0])

      window.web3 = new Web3(window.ethereum)
      const web3 = window.web3
      const networkId = await web3.eth.net.getId();
      const networkData = Character.networks[networkId]

      if(networkData){
        const abi = Character.abi
        const address = networkData.address 
        
        //deploy contract to front end
        const Token = new web3.eth.Contract(abi, address)
        setToken(prev => Token)

        const count = await Token.methods.getAttrQuantity().call()
        setQuantity(prev => count)

        const balanceOf = await Token.methods.balanceOf(accounts[0]).call()
        setTokenOwnQuantity(prev => balanceOf)
      }
    }
    init();
  }, [])

  //get attribute data
  useEffect(() =>{
    const add = async (attrQuantity) => {
      if(token != null) {
        for (let i = 0 ; i < attrQuantity ; i++){   //重複添加
          const _name = await token.methods.getAttrName(i).call()
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

  //set tokenOwnArray, the token owned by this account
  useEffect(() => {       
    const add = async (tokenOwnQuantity) => {
      if(token != null){
        for (let i = 0 ; i < tokenOwnQuantity ; i++){
          
          let _response = await getTokenImage(i);
          //console.log(_response)
          let _img = _response.image;
          let _name = _response.name;
          _img = _img.replace("ipfs://", baseHeader)
          setTokenOwnArray((prev) => [
            ...prev,
            {
              name: _name,
              img: _img
            }
          ])
        }
      }
    }
    add(tokenOwnQuantity)
  }, [tokenOwnQuantity])
    
  
  // Navbar
  const Nav = () =>{
    return (
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">GameNFT Workshop</Navbar.Brand>
          <Navbar.Brand>{isConnect()}</Navbar.Brand>
        </Container>        
      </Navbar>
    )
  }
  
  // If connection is successful, Navbar display the connect account
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

  const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  const attributeButton = cardArray.map((data) =>{
    return(
    <Col md="auto" >
        <Button 
        variant='outline-primary'
        id={data.id}
        onClick={(e) => {
          const _id = e.target.getAttribute('id')
          const attach = async (_id) =>{
            await token.methods.attach(0, _id, 1).send({from: account}) //attach to token0
          }
          attach(_id)
        }}>
        {data.name}
        </Button>
    </Col>
    )
  })

  const mintToken = async (tokenId)=>{
    await token.methods.mint(account, tokenId).send({from: account, value: Web3.utils.toWei('0.1')})
    setTokenOwnQuantity(prev => parseInt(prev) + 1)
  }

  const burnToken = async (tokenId) =>{
    await token.methods.burnToken(tokenId).send({from: account})
    setTokenOwnQuantity(prev => parseInt(prev) - 1)  
  }

  const getTokenImage = async(tokenId) =>{
  console.log("exe")
    try {
      let URI = await token.methods.tokenURI(tokenId).call()
      console.log(URI)
      console.log("exe")
      URI = URI.replace("ipfs://", baseHeader)
      let response = await fetch(URI);
      let responseJson = await response.json();
      return responseJson
     } catch(error) {
      console.error(error);
    }
  }

  const setReveal = async() => {
    await token.methods.setReveal(true).send({from: account})
  }

  const render = () =>{
    if(isMetaMaskInstalled()){
      return(
        <div>
          {Nav()}
          <Container>
            <Row>
              {attributeButton}
              <Button variant='outline-danger'
                onClick={(e) => {
                  burnToken(0)  // burn token 0
                }}
              >
              burn
              </Button>
              <Button variant='outline-danger'> Sales </Button>
              <Button variant='outline-danger' onClick={(e)=>{setReveal()}}> Reveal </Button> 
            </Row>
            <Row>
              {tokenOptions.map((data) => {
                //return all Token mint option
                return (
                  <div>
                    <img
                    id = {data.id}
                    src={window.location.origin + data.img}
                    width="180"
                    height="180"
                    onClick={(e) => {
                      const tokenId = e.target.getAttribute('id')
                      mintToken(tokenId)
                    }}/>
                    <h1>{data.name}</h1>
                  </div>
                )
              })
              }
            </Row>
            <Row>
              You have:
              {tokenOwnArray.map((data) => {
                return(
                  <div>
                    <img
                      src={data.img}
                      width="180"
                      height="180"
                    />
                    <h1>{data.name}</h1>
                  </div>
                )
              })} 
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
/* <img 
    src={"https://ipfs.io/ipfs/QmSys8vEnsL5hZ99HsYjJ62a1KJQrYwv7n7Qi2df3XbtHM/belt.jpeg"}
    width="180"
    height="180"
  /> */