import React from 'react';

const Rank=({name,entries})=>{
    return(
        <div>
            <div className="red f3">
                {`${name}, your current Rank is ...`}
            </div>
            <div className='brown f1'>
                {entries}
            </div>
        </div>
    );
}

export default Rank;