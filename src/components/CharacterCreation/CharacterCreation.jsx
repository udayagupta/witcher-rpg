import React, { useState } from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';

const witcherSchools = {
  wolf: {
    id: "wolf", name: "School of the Wolf", emoji: "🐺",
    desc: "Balanced combatants, excelling in both swordsmanship and basic signs. The classic path of the professional.",
    bonus: "Balanced Stats (+5% All)"
  },
  cat: {
    id: "cat", name: "School of the Cat", emoji: "😾",
    desc: "Fast, agile, and deadly. Prefers light armor and lethal critical strikes over raw defense.",
    bonus: "+15% Critical Chance, -10% Defense"
  },
  griffin: {
    id: "griffin", name: "School of the Griffin", emoji: "🦅",
    desc: "Masters of Witcher Signs. Focuses on magical intensity, stamina regeneration, and medium armor.",
    bonus: "+20% Sign Intensity"
  },
  bear: {
    id: "bear", name: "School of the Bear", emoji: "🐻",
    desc: "Heavy hitters wrapped in thick armor. Slow, but capable of absorbing massive damage without flinching.",
    bonus: "+30% Defense, +20% Vitality"
  }
};

export const CharacterCreation = () => {
  const [name, setName] = useState("Geralt");
  const [selectedSchool, setSelectedSchool] = useState("wolf");
  const creatCharacter = usePlayerStore((state) => state.createCharacter);

  const activeSchool = witcherSchools[selectedSchool];

  const handleSubmit = (e) => {
    e.preventDefault();
    creatCharacter(name, selectedSchool);
  };

  return (
    <div className='flex flex-col min-h-screen bg-gradient-to-b items-center from-neutral-900 to-neutral-800 text-white px-4'>
      <div className="text-center p-2 pt-4">
        <h1 className="text-2xl sm:text-4xl witcher-font text-neutral-100">The Witcher: Text-Based RPG</h1>
      </div>

      {/*
        Layout logic:
        - Mobile (< md): column, school card on top, form below
        - Desktop (≥ md): side-by-side row, form left, card right
        We use `order` utilities so the DOM order stays as-is for semantics,
        but visually the card comes first on mobile.
      */}
      <div className='w-full max-w-5xl bg-neutral-900/90 border border-neutral-700 mt-6 md:mt-10 p-5 shadow-2xl rounded-lg overflow-hidden flex flex-col md:flex-row'>

        {/* Left Panel — form; visually second on mobile (order-2) */}
        <div className='w-full md:w-[50%] order-2 md:order-1 mt-6 md:mt-0'>
          <div>
            <h2 className="text-3xl sm:text-5xl witcher-font text-amber-300 mb-2">The Path Awaits</h2>
            <p className="text-neutral-400 text-sm mb-6 md:mb-8 uppercase tracking-widest">Forge your Witcher</p>
          </div>

          <form onSubmit={handleSubmit} className='witcher-font rounded-md flex flex-col gap-3 mt-4 md:mt-10'>

            {/* Name Input */}
            <div className='flex flex-col gap-2'>
              <label htmlFor="name" className='text-amber-500 font-semibold uppercase tracking-wider text-base sm:text-lg'>
                Witcher's Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className='bg-neutral-950 border border-neutral-700 rounded-md p-3 text-base sm:text-lg focus:outline-none focus:border-amber-500 transition-colors text-white'
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>

            {/* Witcher School */}
            <div className='flex flex-col gap-2'>
              <label className='text-amber-500 font-semibold uppercase tracking-wider text-base sm:text-lg'>
                Witcher School
              </label>
              <div className='grid grid-cols-2 gap-2'>
                {Object.values(witcherSchools).map((school) => (
                  <button
                    type='button'
                    key={school.id}
                    onClick={() => setSelectedSchool(school.id)}
                    className={`p-3 cursor-pointer rounded-md border text-sm font-bold transition-all 
                      ${selectedSchool === school.id
                        ? "border-amber-500 bg-amber-500/10 text-amber-400"
                        : "border-neutral-700 bg-neutral-950 hover:border-amber-500/50 hover:text-amber-200 text-neutral-400"
                      }`}
                  >
                    {school.name}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className='bg-neutral-800 border border-amber-300 hover:bg-amber-300 hover:text-neutral-800 transition-all duration-200 p-3 rounded-md cursor-pointer mt-4'
              >
                Begin Journey
              </button>
            </div>
          </form>
        </div>

        {/* Divider — horizontal on mobile, vertical on desktop */}
        <div className="order-3 md:order-2 w-full h-px md:w-px md:h-auto bg-neutral-700/60 my-4 md:my-0 md:mx-5"></div>

        {/* Right Panel — school card; visually first on mobile (order-1) */}
        <div className='w-full md:w-[50%] order-1 md:order-3 flex flex-col gap-3 items-center'>
          <h3 className='text-center text-2xl sm:text-3xl witcher-font text-amber-300'>School of Witcher</h3>
          <div className='bg-neutral-700 mt-4 md:mt-6 shadow-[0_0_15px_rgba(217,119,6,0.2)] rounded-[50%] h-[80px] w-[80px] sm:h-[100px] sm:w-[100px] flex items-center justify-center text-4xl sm:text-5xl p-5'>
            <p>{activeSchool.emoji}</p>
          </div>
          <div className='witcher-font text-xl sm:text-2xl'>
            <p>{activeSchool.name}</p>
          </div>
          <div className='text-base sm:text-lg text-center text-amber-400'>
            <p className='text-neutral-300 leading-relaxed mb-4 md:mb-8 italic'>"{activeSchool.desc}"</p>
          </div>
          <div className='text-center flex gap-4 text-base sm:text-lg font-bold'>
            <p>Starting Trait:</p>
            <p className='text-green-400'>{activeSchool.bonus}</p>
          </div>
        </div>

      </div>
    </div>
  );
};