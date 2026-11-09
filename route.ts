import { NextResponse } from 'next/server';

export async function GET() {
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Australia/Melbourne' });
  
  // Seeded pseudo-random number generator based on today's date string (YYYYMMDD)
  const seed = parseInt(today.replace(/-/g, ''), 10);
  let s = seed % 2147483647;
  const random = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };

  // Comprehensive Master Pool from which daily selections & permutations are generated
  const masterPool = [
    { q: "Which 1971 studio album by David Bowie featured 'Life on Mars?'", options: ["Hunky Dory", "Aladdin Sane", "The Man Who Sold the World", "Space Oddity"], correct: 0, exp: "Hunky Dory established Bowie's signature piano-art-pop style." },
    { q: "Which 1968 Stanley Kubrick film featured the Blue Danube waltz in space?", options: ["2001: A Space Odyssey", "Solaris", "Silent Running", "A Clockwork Orange"], correct: 0, exp: "Kubrick famously paired classical waltzes with orbital mechanics." },
    { q: "What is the primary function of a first-flush diverter in rainwater systems?", options: ["Isolates initial dirty roof runoff", "Boosts low water pressure", "Chlorinates tank water", "Removes dissolved calcium"], correct: 0, exp: "It washes away dust, leaves, and bird droppings before clean water enters storage." },
    { q: "Which New Zealand town hosts Detective Mike Shepherd in The Brokenwood Mysteries?", options: ["Brokenwood", "Queenstown", "Greendale", "Waipukurau"], correct: 0, exp: "Brokenwood is a fictional rural township known for its high murder rate." },
    { q: "What traditional Japanese technique preserves timber by charring it?", options: ["Shou Sugi Ban", "Kintsugi", "Tatami", "Kumiko"], correct: 0, exp: "Charring exterior timber makes it rot-proof and weather-resistant." },
    { q: "Which Fleetwood Mac album was created amidst intense intra-band turbulence?", options: ["Rumours", "Tusk", "Mirage", "Tango in the Night"], correct: 0, exp: "Released in 1977, Rumours became one of history's best-selling albums." },
    { q: "What capability does an electric vehicle's 'V2L' system provide?", options: ["Powers external appliances from the car battery", "Doubles fast-charging speeds", "Auto-parks in tight garages", "Monitors tire tread depth"], correct: 0, exp: "Vehicle-to-Load turns the EV into a portable 230V power generator." },
    { q: "Which historic Melbourne roasting company was established on Shield Street in 1938?", options: ["Quists Coffee", "Seven Seeds", "St Ali", "Proud Mary"], correct: 0, exp: "Quists pioneered fresh bean roasting and Italian espresso culture in Melbourne." },
    { q: "Directed by Ridley Scott in 1982, which sci-fi noir masterpiece stars Harrison Ford?", options: ["Blade Runner", "Total Recall", "The Running Man", "Dark City"], correct: 0, exp: "Blade Runner defined the aesthetic of cyberpunk cinema." },
    { q: "Which Australian pop icon topped charts worldwide in 2001 with 'Can't Get You Out of My Head'?", options: ["Kylie Minogue", "Tina Arena", "Delta Goodrem", "Natalie Imbruglia"], correct: 0, exp: "The iconic track became a defining anthem of early 2000s pop." },
    { q: "Which Agatha Christie novel begins with a body found in the library of Gossington Hall?", options: ["The Body in the Library", "The Murder at the Vicarage", "A Murder is Announced", "4.50 from Paddington"], correct: 0, exp: "Miss Marple investigates the mystery alongside Colonel and Mrs. Bantry." },
    { q: "Which electronic group released the legendary 12-inch single 'Blue Monday' in 1983?", options: ["New Order", "Depeche Mode", "Pet Shop Boys", "The Human League"], correct: 0, exp: "It became the best-selling 12-inch single of all time." },
    { q: "Which mountain range in NSW houses the Siding Spring Observatory?", options: ["The Warrumbungles", "The Blue Mountains", "The Snowy Mountains", "The MacDonnell Ranges"], correct: 0, exp: "The Warrumbungle dark sky region provides ideal stargazing conditions." },
    { q: "Which director helmed the 1994 non-linear crime masterpiece Pulp Fiction?", options: ["Quentin Tarantino", "Martin Scorsese", "Guy Ritchie", "David Fincher"], correct: 0, exp: "Tarantino's film earned the Palme d'Or at Cannes." },
    { q: "What was the northern coastal terminus of Australia's historic Overland Telegraph Line?", options: ["Port Darwin", "Broome", "Cooktown", "Derby"], correct: 0, exp: "Completed in 1872, it connected southern Australia to global telegraph cables." }
    // Additional algorithmic variations can be added or dynamically expanded here
  ];

  // Shuffle and pick 15 items deterministically using the daily seed
  const shuffled = [...masterPool].sort(() => random() - 0.5);
  const dailyQuestions = shuffled.slice(0, 15).map((item, idx) => {
    // Shuffle options for this specific day
    const originalCorrectText = item.options[item.correct];
    const shuffledOpts = [...item.options].sort(() => random() - 0.5);
    return {
      id: idx + 1,
      question: item.q,
      options: shuffledOpts,
      correctAnswer: shuffledOpts.indexOf(originalCorrectText),
      explanation: item.exp
    };
  });

  return NextResponse.json({ date: today, questions: dailyQuestions });
}
