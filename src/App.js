import './App.css';
import React from 'react';
import Die from './components/Die'
import Confetti from 'react-confetti'
function App() {
  const [dice, setDice] = React.useState(allNewDice())
  const [tenzies, setTenzies] = React.useState(false)
  const [count, setCount] = React.useState(0)
  const [seconds, setSeconds] = React.useState(0)
  const [interval, setStateInterval] = React.useState()
  const [bestTime, setBestTime] = React.useState(JSON.parse(localStorage.getItem("tenzies")) || "")
  React.useEffect(() => {
    /* let allHeld = true
    for (const die of dice)
      if (!die.isHeld) {
        allHeld = false
        break
      }
    let allSame = true
    if (allHeld)
      for (const die of dice)
        if (die.value !== dice[0].value) {
          allSame = false
          break
        } */
    const allHeld = dice.every(die => die.isHeld) //array.every(): Determines whether all the members of an array satisfy the specified test.
    const firstValue = dice[0].value
    const allSame = dice.every(die => die.value === firstValue)
    //le 3 righe qui sopra sono equivalenti al codice commentato in alto
    if (allHeld && allSame) {
      setTenzies(true)
    }
  }, [dice])
  React.useEffect(() => {
    if (!tenzies) {
      setSeconds(0)
      setStateInterval(setInterval(() => {
        setSeconds(oldSeconds => oldSeconds + 1)
      }, 1000))
    } else {
      clearInterval(interval)
      setStateInterval(undefined)
      const bestTime = JSON.parse(localStorage.getItem("tenzies"))
      if (bestTime) {
        if (seconds < bestTime) {
          localStorage.setItem("tenzies", JSON.stringify(seconds))
          setBestTime(seconds)
        }
      } else {
        localStorage.setItem("tenzies", JSON.stringify(seconds))
        setBestTime(seconds)
      }
    }
    return () => {
      clearInterval(interval)
    }
  }, [tenzies]);
  function allNewDice() {
    const dice = []
    for (let i = 0; i < 10; i++) {
      dice.push({
        value: Math.floor(Math.random() * 6) + 1,
        isHeld: false,
        id: i
      })
    }
    return dice
  }

  const diceElements = dice.map(dice =>
    <Die
      key={dice.id}
      {...dice}
      holdDice={() => holdDice(dice.id)}
    />
  )

  function reRoll() {
    if (!tenzies) {
      setDice(prevDice => prevDice.map(dice =>
        dice.isHeld ? dice : { ...dice, value: Math.floor(Math.random() * 6) + 1 }
      ))
      setCount(prevCount => prevCount + 1)
    } else {
      setTenzies(false)
      setDice(allNewDice())
      setCount(0)
    }
  }

  function holdDice(diceId) {
    setDice(prevDice => prevDice.map(dice =>
      dice.id === diceId ? { ...dice, isHeld: !dice.isHeld } : dice
    ))
  }

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze
        it at its current value between rolls.
      </p>
      <span>best time: {new Date(bestTime * 1000).toISOString().slice(14, 19)}</span>
      <span>rolls: {count}</span>
      <span>timer: {new Date(seconds * 1000).toISOString().slice(14, 19)}</span>
      <div className="container">
        {diceElements}
      </div>
      <button className='roll-dice' onClick={reRoll}>{tenzies ? "New Game" : "Roll"}</button>
    </main>
  );
}

export default App;
