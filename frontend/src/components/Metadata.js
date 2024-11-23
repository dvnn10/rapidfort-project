import React, { useEffect, useState } from 'react';

function Metadata({ filename }) {
    const [metadata, setMetadata] = useState(null);

    useEffect(() => {
        const fetchMetadata = async () => {
            const response = await fetch(`/metadata/${filename}`);
            const data = await response.json();
            setMetadata(data);
        };
        fetchMetadata();
    }, [filename]);

    return (
        <div>
            <h2>File Metadata</h2>
            {metadata ? (
                <pre>{JSON.stringify(metadata, null, 2)}</pre>
            ) : (
                <p>Loading metadata...</p>
            )}
        </div>
    );
}

export default Metadata;
