import React from 'react';

const Rank=({name,entries})=>{
    return(
        <div>
            <div className="red f3">
                {`${name}, your current entries are ...`}
            </div>
            <div className='brown f1'>
                {entries}
            </div>
        </div>
    );
}

export default Rank;