import { useState } from "react";
import "./App.css";

function App() {
  const [wordObj, setWordObj] = useState(null);
  const word = wordObj?.word;
  const phonetics = wordObj?.phonetic;
  const source = wordObj?.sourceUrls[0];
  const [errorHandle, setErrorHandle] = useState(false);
  const getRespond = async function (word) {
    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      if (!res.ok) throw Error(res.status);
      const data = await res.json();
      setWordObj(...data);
      setErrorHandle(false);
    } catch (err) {
      setWordObj(null);
      setErrorHandle(true);
    }
  };

  function handleGetRespond(word) {
    getRespond(word);
  }

  console.log(wordObj);
  return (
    <div className="main-container">
      <Brand />
      <Input onGetRespond={handleGetRespond} />
      {wordObj && <Output word={word} phonetics={phonetics} />}

      {wordObj?.meanings.map((meaning) => (
        <Results meaning={meaning} key={crypto.randomUUID()} />
      ))}
      {wordObj && (
        <div className="footer-container">
          <span>Source</span>{" "}
          <a
            className="source-text"
            rel="noreferrer"
            target="_blank"
            href={source}
          >
            {source}{" "}
            <img
              className="source-icon"
              src="assets/images/icon-new-window.svg"
              alt="new window icon"
            />
          </a>
        </div>
      )}
      {errorHandle && <Error />}
      {!wordObj && !errorHandle && <Welcome />}
    </div>
  );
}

function Brand() {
  return (
    <div className="brand-container">
      <img src="assets/images/logo.svg" alt="logo" />
      <div className="select-container">
        <div className="select-font-style-container">
          <select className="select-font-style">
            <option>Inter</option>
            <option>Lora</option>
            <option>Inconsolata</option>
          </select>
        </div>
        <div className="select-display">
          <input className="display-input" id="check" type="checkbox" />
          <label htmlFor="check" className="switch-btn"></label>
          <img src="assets/images/icon-moon.svg" alt="moon" />
        </div>
      </div>
    </div>
  );
}

function Input({ onGetRespond }) {
  const [word, setWord] = useState("");

  function handleSetWord(e) {
    setWord(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!word) return;
    onGetRespond(word);
  }
  return (
    <form onSubmit={handleSubmit} className="form-container">
      <input
        value={word}
        className="form-input"
        type="text"
        onChange={handleSetWord}
      />
      <button className="form-input-btn">
        <img src="assets/images/icon-search.svg" alt="form input button" />
      </button>
    </form>
  );
}

function Output({ word, phonetics }) {
  return (
    <div className="output-container">
      <div>
        <h2 className="output-text">{word}</h2>
        <p className="output-sub-text">{phonetics}</p>
      </div>

      <button className="output-play-btn">
        <img src="assets/images/icon-play.svg" alt="play button" />
      </button>
    </div>
  );
}

function Results({ meaning }) {
  return (
    <div className="result-container">
      <h4 className="result-header">{meaning.partOfSpeech}</h4>
      <div>
        <h6 className="result-sub-header">Meaning</h6>
        <ul className="result-list">
          {meaning.definitions.map((item) => (
            <ResultListItem item={item} key={crypto.randomUUID()} />
          ))}
        </ul>
      </div>
      <div className="synonym-container">
        <h6 className="result-sub-header">Synonyms</h6>
        <ul className="result-list-synonym">
          {meaning.synonyms.map((item) => (
            <ResultSynonymsItem item={item} key={crypto.randomUUID()} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function ResultListItem({ item }) {
  return <li className="result-list-item">{item.definition}</li>;
}

function ResultSynonymsItem({ item }) {
  return <li className="result-list-item-synonym">{item},</li>;
}

function Error() {
  return <div className="error">No word found. Please try again.</div>;
}

function Welcome() {
  return <div className="welcome">Welcome! Type to search a word.</div>;
}
export default App;
