import { memo } from 'react';

import { Daiictid202301272 } from '../utils/DAIICTids/202301272.tsx';

function Daiict() {

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Contributors Cards</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Daiictid202301272 />
            </div>
        </div>
    )
}

export default memo(Daiict);