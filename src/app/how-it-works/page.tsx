import { Footer } from '@/components/Footer';
import React from 'react';

export default function HowItWorks() {
  return (
    <>
      <div className="flex flex-col items-center p-5 text-center overflow-auto h-full">
        <h2 className="text-2xl font-semibold mb-5">How It Works</h2>
        <div className="w-3/4 px-5 py-5 border rounded shadow-xl mb-5">
          <h3 className="text-xl font-bold mb-3">Sign Up</h3>
          <p>Create a personal account to access <span className='text-primary-500 text-semibold'>Speak Catly.</span></p>
        </div>
        <div className="w-3/4 px-5 py-5 border rounded shadow-xl mb-5">
          <h3 className="text-xl font-bold mb-3">Create Sets</h3>
          <p>Create a set, navigate to the <span className='text-primary-500 font-semibold'>My Sets</span> section and click on <span className='text-primary-500 font-semibold'>Create New</span>.</p>
        </div>
        <div className="w-3/4 px-5 py-5 border rounded shadow-xl mb-5">
          <h3 className="text-xl font-bold mb-3">Add Words/Phrases</h3>
          <p>You can add words and phrases to your set in the main section of the page. Click on the <span className='text-primary-500 font-semibold'>Add Word/Phrase</span>, type the phrase and create</p>
        </div>
        <div className="w-3/4 px-5 py-5 border rounded shadow-xl mb-5">
          <h3 className="text-xl font-bold mb-3">Record your Pronunciation</h3>
          <p>This is where the practical aspect comes in. Have your microphone ready, click on <span className='text-primary-500 font-semibold'>Record Now</span>, and say the word or phrase. </p>
        </div>
        <div className="w-3/4 px-5 py-5 border rounded shadow-xl mb-5">
          <h3 className="text-xl font-bold mb-3">Evaluation</h3>
          <p><span className='text-primary-500 font-semibold'>Speak Catly</span> will judge your pronunciation in comparison to the standard/native pronunciation of the word/phrase, providing you with a score and <span className='text-primary-500 font-semibold'>Insights</span>.</p>
        </div>
        <div className="w-3/4 px-5 py-5 border rounded shadow-xl mb-5">
          <h3 className="text-xl font-bold mb-3">Trying Again</h3>
          <p>You can <span className='text-primary-500 font-semibold'>Try again</span> selecting the 3 dots on the corner of the card.</p>
        </div>
        <Footer />
      </div>
    </>
  );
};