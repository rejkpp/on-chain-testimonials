import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/shakaPortal.json";


const App = () => {
  const contractABI = abi.abi;
  const [allShakas, setAllShakas] = useState([]);
  const [currentAccount, setCurrentAccount] = useState("");
  const contractAddress = "0x2ffAce216BDdFb0A1e7Bdab5E5deC2a5467fce77";
  const [tweetValue, setTweetValue] = useState("")


  const findMetaMaskAccount = async () => {
  try {
    const { ethereum } = window;

    if (!ethereum) {
      console.error("put on metamask!");
      return null;
    } else {
      console.log("We have the Ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("found an authorized account:", account);
      setCurrentAccount(account);

    } else {
      console.error("no authorized account found");
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("get metamask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts"});

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const shaka = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const shakaPortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        let count = await shakaPortalContract.getTotalShakas();
        console.log("retrieved total shaka count...", count.toNumber());
        /*
        * Execute the actual shaka from your smart contract
        */
        const shakaTxn = await shakaPortalContract.shaka(tweetValue,{gasLimit:300000});
        console.log("mining...", shakaTxn.hash);
        await shakaTxn.wait();
        console.log("mined -- ", shakaTxn.hash);
        count = await shakaPortalContract.getTotalShakas();
        console.log("retrieved total shaka count...", count.toNumber());
      } else {
        console.log("ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
}

  const getAllShakas = async () => {
    const { ethereum } = window;
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const shakaPortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        const shakas = await shakaPortalContract.getAllShakas();

        const shakasCleaned = shakas.map((shaka) => {
          return {
            address: shaka.user,
            timestamp: new Date(shaka.timestamp * 1000),
            message: shaka.message,
          };
        });

        setAllShakas(shakasCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    findMetaMaskAccount();
  }, []);

  useEffect(() => {
      let shakaPortalContract;

      const onNewShaka = (from, timestamp, message) => {
          console.log("newShaka", from, timestamp, message);
          setAllWaves((prevState) => [
              ...prevState,
              {
                  address: from,
                  timestamp: new Date(timestamp * 1000),
                  message: message,
              },
          ]);
      };

      if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();

          shakaPortalContract = new ethers.Contract(contractAddress, contractABI, signer);
          shakaPortalContract.on("newShaka", onNewShaka);
      }

      return () => {
          if (shakaPortalContract) {
              shakaPortalContract.off("newShaka", onNewShaka);
          }
      };
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">🤙🏼 shaka!</div>

        <div className="bio">
          leave a message on the blocks. there is a 20% chance you will receive 0.0001 eth after leaving a message. and there is a 5 min cool down. don't spam, you'll pay gas and the message won't go through (transaction will fail)
        </div>

        {
         currentAccount ? (<textarea name="tweetArea"
           placeholder="type your message"
           type="text"
           id="tweet"
           value={tweetValue}
           onChange={e => setTweetValue(e.target.value)} />) : null
         }

        {currentAccount && (
          <button className="waveButton" onClick={shaka}>
            send message
          </button>
        )}


        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            connect wallet
          </button>
        )}

        {allShakas.map((shaka, index) => {
         return (
           <div key={index} style={{ backgroundColor: "grey", marginTop: "16px", padding: "8px" }}>
             <div>Address: {shaka.address}</div>
             <div>Time: {shaka.timestamp.toString()}</div>
             <div>Message: {shaka.message}</div>
           </div>)
         })}
      </div>
    </div>
  );
};

export default App;
