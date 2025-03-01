// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ValidatorPerformance } from './useCommitteePerformance.js';

import React, { useMemo, useState } from 'react';

import { styled } from '@polkadot/react-components';

import ActionsBanner from './ActionsBanner.js';
import BlockProductionCommitteeList from './BlockProductionCommitteeList.js';
import Summary from './Summary.js';
import useSessionCommitteePerformance from './useCommitteePerformance.js';

interface Props {
  session: number,
  era: number,
}

export interface EraValidatorPerformance {
  validatorPerformance: ValidatorPerformance;
  isCommittee: boolean;
}

function HistoricPerformance ({ session }: Props): React.ReactElement<Props> {
  const sessionCommitteePerformance = useSessionCommitteePerformance([session]);
  const [expectedBlockCountInSessions, setExpectedBlockCountInSessions] = useState<number | undefined>(undefined);

  const eraValidatorPerformances: EraValidatorPerformance[] = useMemo(() => {
    if (sessionCommitteePerformance && sessionCommitteePerformance.length > 0) {
      setExpectedBlockCountInSessions(sessionCommitteePerformance[0].expectedBlockCount);
      const validatorPerformancesCommittee = sessionCommitteePerformance[0].performance.map((committeePerformance) => {
        return {
          isCommittee: true,
          validatorPerformance: committeePerformance
        };
      }
      );

      return validatorPerformancesCommittee;
    }

    return [];
  },
  [sessionCommitteePerformance]

  );

  return (
    <div className='staking--Performance'>
      <Summary
        eraValidatorPerformances={eraValidatorPerformances}
        expectedBlockCount={expectedBlockCountInSessions}
      />
      <ActionsBanner />
      <StyledBlockProductionCommitteeList
        eraValidatorPerformances={eraValidatorPerformances}
        expectedBlockCount={expectedBlockCountInSessions}
      />
    </div>
  );
}

const StyledBlockProductionCommitteeList = styled(BlockProductionCommitteeList)`
  margin-bottom: 64px;
`;

export default React.memo(HistoricPerformance);
