import React, { useState } from "react";
import "./App.css";

function App() {
  const [curWord, setCurWord] = useState(null);
  const [wordObj, setWordObj] = useState(null);
  const word = wordObj?.word;
  const phonetics = wordObj?.phonetic;
  const source = wordObj?.sourceUrls[0];
  const [errorHandle, setErrorHandle] = useState(false);
  const [curFont, setCurFont] = useState("lora");
  const [curDarkMode, setcurDarkMode] = useState(false);
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

  function handleCurWord(word) {
    setCurWord(word);
  }

  function handleGetRespond(word) {
    getRespond(word);
  }

  function handleFontChange(e) {
    setCurFont(e.target.value);
  }

  function handleDisplayChange() {
    setcurDarkMode((curDarkMode) => !curDarkMode);
  }

  console.log(wordObj);
  return (
    <div className={`container ${curDarkMode ? "container-dark" : ""}`}>
      <div
        style={{ fontFamily: `${curFont}, serif` }}
        className="main-container"
      >
        <Brand
          onDisplayChange={handleDisplayChange}
          curDarkMode={curDarkMode}
          curFont={curFont}
          onFontChange={handleFontChange}
        />
        <Input
          onCurWord={handleCurWord}
          curWord={curWord}
          curDarkMode={curDarkMode}
          curFont={curFont}
          onGetRespond={handleGetRespond}
        />
        {wordObj && <Output word={word} phonetics={phonetics} />}

        {wordObj?.meanings.map((meaning) => (
          <Results
            curDarkMode={curDarkMode}
            meaning={meaning}
            key={crypto.randomUUID()}
          />
        ))}
        {wordObj && (
          <div
            className={`footer-container ${
              curDarkMode ? "footer-container-dark" : ""
            }`}
          >
            <span>Source</span>{" "}
            <a
              className={`source-text ${curDarkMode ? "source-text-dark" : ""}`}
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
    </div>
  );
}

function Brand({ curFont, onFontChange, onDisplayChange, curDarkMode }) {
  return (
    <div className="brand-container">
      <img src="assets/images/logo.svg" alt="logo" />
      <div className="select-container">
        <div
          className={`select-font-style-container ${
            curDarkMode ? "select-font-style-container-dark" : ""
          }`}
        >
          <select
            onChange={onFontChange}
            style={{ fontFamily: `${curFont}, serif` }}
            value={curFont}
            className={`select-font-style ${
              curDarkMode ? "select-font-style-dark" : ""
            }`}
          >
            <option value="lora">Lora</option>
            <option value="inter">Inter</option>
            <option value="inconsolata">Inconsolata</option>
          </select>
        </div>
        <div className="select-display">
          <input
            defaultChecked={curDarkMode}
            value={curDarkMode}
            onChange={() => onDisplayChange()}
            className="display-input"
            id="check"
            type="checkbox"
          />
          <label htmlFor="check" className="switch-btn"></label>
          <svg
            className={`select-display-img ${
              curDarkMode ? "select-display-img-dark" : ""
            }`}
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 22 22"
          >
            <path
              fill="none"
              stroke="#838383"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M1 10.449a10.544 10.544 0 0 0 19.993 4.686C11.544 15.135 6.858 10.448 6.858 1A10.545 10.545 0 0 0 1 10.449Z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Input({ onCurWord, curWord, onGetRespond, curFont, curDarkMode }) {
  const [word, setWord] = useState("");

  function handleSetWord(e) {
    setWord(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!word) return;
    if (word === curWord) return;
    onCurWord(word);
    onGetRespond(word);
  }
  return (
    <form onSubmit={handleSubmit} className="form-container">
      <input
        style={{ fontFamily: `${curFont}, serif` }}
        value={word}
        className={`form-input ${curDarkMode ? "form-input-dark" : ""}`}
        type="text"
        onChange={handleSetWord}
      />
      <button className="form-input-btn">
        <svg
          className="form-input-btn-img"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
        >
          <path
            fill="none"
            stroke="#A445ED"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="m12.663 12.663 3.887 3.887M1 7.664a6.665 6.665 0 1 0 13.33 0 6.665 6.665 0 0 0-13.33 0Z"
          />
        </svg>
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

function Results({ meaning, curDarkMode }) {
  return (
    <div className="result-container">
      <h4 className="result-header">{meaning.partOfSpeech}</h4>
      <div>
        <h6
          className={`result-sub-header ${
            curDarkMode ? "result-sub-header-dark" : ""
          }`}
        >
          Meaning
        </h6>
        <ul className="result-list">
          {meaning.definitions.map((item) => (
            <ResultListItem item={item} key={crypto.randomUUID()} />
          ))}
        </ul>
      </div>
      <div className="synonym-container">
        <h6
          className={`result-sub-header ${
            curDarkMode ? "result-sub-header-dark" : ""
          }`}
        >
          Synonyms
        </h6>
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
  return <li className="result-list-item-synonym">{item}</li>;
}

function Error() {
  return <div className="error">No word found. Please try again.</div>;
}

function Welcome() {
  return <div className="welcome">Welcome! Type to search a word.</div>;
}
export default App;
