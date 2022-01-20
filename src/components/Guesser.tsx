import { FormEvent, useState } from "react";
import { Country } from "../lib/country";
import { polygonDistance } from "../util/distance";
import { answerName } from "../util/answer";
import { Message } from "./Message";
const countryData: Country[] = require("../country_data.json").features;

type Props = {
  guesses: Country[];
  setGuesses: React.Dispatch<React.SetStateAction<Country[]>>;
  win: boolean;
  setWin: React.Dispatch<React.SetStateAction<boolean>>;
};

export function Guesser({ guesses, setGuesses, win, setWin }: Props) {
  const [guessName, setGuessName] = useState("");
  const [error, setError] = useState("");

  function findCountry(countryName: string) {
    let country = countryData.find((country) => {
      const { NAME, NAME_LONG, ABBREV, ADMIN } = country.properties;
      return (
        NAME.toLowerCase() === countryName.toLowerCase() ||
        NAME_LONG.toLowerCase() === countryName.toLowerCase() ||
        ADMIN.toLowerCase() === countryName.toLowerCase() ||
        ABBREV.toLowerCase() === countryName.toLowerCase() ||
        ABBREV.replaceAll(".", "").toLowerCase() === countryName.toLowerCase()
      );
    });
    return country;
  }

  function runChecks() {
    const guessCountry = findCountry(guessName);
    if (
      guesses.find((c) => {
        return c.properties.NAME.toLowerCase() === guessName.toLowerCase();
      })
    ) {
      setError("Country already guessed");
      return;
    }
    if (!guessCountry) {
      setError("Invalid country name");
      return;
    }
    if (guessCountry.properties.NAME === answerName()) {
      setWin(true);
    }
    return guessCountry;
  }

  function addProximity(guessCountry: Country) {
    // TODO it may not be wise to have proximity in the state in case the
    // user can see it.
    const answerCountry = findCountry(answerName());
    if (!answerCountry) throw "Answer not found;";
    const distance = polygonDistance(guessCountry, answerCountry);
    const maxDistance = 40_075_000 / 2; // Half of circumference of Earth
    const proximity = distance / maxDistance;
    guessCountry["proximity"] = proximity;
    return guessCountry;
  }

  function addGuess(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    let guessCountry = runChecks();
    if (guessCountry) {
      guessCountry = addProximity(guessCountry);
      setGuessName("");
      setGuesses([...guesses, guessCountry]);
    }
  }

  return (
    <form
      onSubmit={addGuess}
      className="space-y-3 space-x-2 my-6 mx-auto block text-center"
    >
      {/* <label className="block text-lg" htmlFor="guesser">
        Guess the Mystery Country
      </label> */}
      <input
        className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="text"
        name="guesser"
        id="guesser"
        value={guessName}
        onChange={(e) => setGuessName(e.currentTarget.value)}
      />
      <button
        className="bg-blue-700 hover:bg-blue-900  text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-green-800 disabled:text-gray-300 "
        type="submit"
        disabled={win}
      >
        Enter
      </button>
      <Message win={win} error={error} />
    </form>
  );
}
