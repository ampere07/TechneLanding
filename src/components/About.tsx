import React from 'react';
import { ClosingCTA } from './ClosingCTA';
import { JourneyTimeline } from './JourneyTimeline';
import { AfterIntro } from './AfterIntro';
import { useJourneyIntro } from './journeyIntro';

export const About: React.FC = () => {
  const { ready, started } = useJourneyIntro();
  return (
    <>
      <JourneyTimeline ready={ready} started={started} />
      <AfterIntro ready={ready}>
        <ClosingCTA />
      </AfterIntro>
    </>
  );
};
