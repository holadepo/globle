import { Country } from "../lib/country";

type Props = {
  guesses: Country[];
};

export function List({ guesses }: Props) {
  const orderedGuesses = [...guesses].sort((a, b) => {
    return a.proximity - b.proximity;
  });

  return (
    <div className="ml-10 my-8">
      {orderedGuesses && (
        <h3 className="font-bold text-xl mb-2">Your guesses (closest first)</h3>
      )}
      <ul className="grid grid-cols-4 gap-3">
        {orderedGuesses.map((guess, idx) => {
          const { NAME_LEN, ABBREV, NAME, WB_A2, ISO_A2 } = guess.properties;
          const name = NAME_LEN > 10 ? ABBREV : NAME;
          const flag =
            ISO_A2.length === 2 ? ISO_A2.toLowerCase() : WB_A2.toLowerCase();
          return (
            <li key={idx} className="flex items-center">
              <img
                src={`https://flagcdn.com/h20/${flag}.png`}
                // width="16"
                // height="12"
                alt={name}
                className=""
              />
              <span className="mx-1 text-md">{name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
