import React, { useState, useEffect } from 'react';

const ImageComponent = ({ ipfsLink, size = 'small' }) => {
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        const fetchImage = async () => {
            try {
                // Remove "ipfs://" prefix
                const ipfsPath = ipfsLink.substring(7);

                // Create the IPFS URL
                const ipfsUrl = `https://ipfs.io/ipfs/${ipfsPath}`;

                setImageUrl(ipfsUrl);
            } catch (err) {
                console.error(err);
            }
        };

        fetchImage();
    }, [ipfsLink]);

    return (
        <div>
            {imageUrl && (
                <img
                    src={imageUrl}
                    alt=""
                    style={size === 'large' ? { width: '300px', height: '300px' } : { width: '100px', height: '100px' }}
                />
            )}
        </div>
    );
};

export default ImageComponent;
