import "./styles.css";
import { useCallback, useEffect, useState } from "react";

// 1️⃣ Finish getProfile() function to check if profileInstance exists
// 2️⃣ Complete createProfile() function in ProfileCreation.js to create profile for a new profileInstance
// 3️⃣ Set the correct profileInstanceAddress and twitterInstanceAddress in Connect.js

import Tweets from "./components/Tweets";
import AddTweet from "./components/AddTweet";
import Connect from "./components/Connect";
import ProfileCreation from "./components/ProfileCreation";

export default function App() {
  const [account, setAccount] = useState(null);
  const [profileExists, setProfileExists] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [twitterInstance, setTwitterInstance] = useState(null);
  const [profileInstance, setProfileInstance] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  const getTweets = useCallback(async function() {
    if (!web3 || !twitterInstance) {
      console.error("Web3 or twitterInstance not initialized.");
      return;
    }

    const tempTweets = await twitterInstance.methods.getAllTweets(account).call();
    // we do this so we can sort the tweets by timestamp
    const tweets = [...tempTweets];
    // tweets.sort((a, b) => b.timestamp - a.timestamp);
    setTweets(tweets);
    setLoading(false);
  }, [account, twitterInstance, web3])

  useEffect(() => {
    if (profileInstance) {
      getProfile()
    }
  }, [profileInstance])

  async function getProfile() {
    if (!web3 || !profileInstance || !account) {
      console.error(
        "Web3 or profileInstance not initialized or account not connected."
      );
      return;
    }
    const profile = await profileInstance.methods.getProfile(account).call();
    setLoading(false);
    return profile.displayName;
  }

  const checkProfile = useCallback(async function checkProfile() {
    const profileName = await getProfile(account);
    setProfileExists(profileName);
  }, [account, getProfile])

  useEffect(() => {
    if (twitterInstance && account) {
      if (profileExists) {
        getTweets();
      } else {
        checkProfile();
      }
    }
  }, [twitterInstance, account, profileExists, getTweets, checkProfile]);

  function shortAddress(address, startLength = 6, endLength = 4) {
    if (address === account && profileExists) {
      return profileExists;
    } else if (address) {
      return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
    }
  }

  return (
    <div className="container">
      <h1>Twitter DAPP</h1>
      <Connect
        web3={web3}
        setWeb3={setWeb3}
        account={account}
        setAccount={setAccount}
        setTwitterInstance={setTwitterInstance}
        shortAddress={shortAddress}
        setProfileInstance={setProfileInstance}
      />
      {!loading && account && profileExists ? (
        <>
          <AddTweet
            twitterInstance={twitterInstance}
            account={account}
            getTweets={getTweets}
          />
          <Tweets tweets={tweets} shortAddress={shortAddress} />
        </>
      ) : (
        account &&
        !loading && (
          <ProfileCreation
            account={account}
            profileInstance={profileInstance}
            checkProfile={checkProfile}
          />
        )
      )}
    </div>
  );
}
