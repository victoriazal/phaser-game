import React, { useEffect, useRef } from 'react';
import StartGame from './main';

const PhaserGame: React.FC = () => {
    const gameContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const game = StartGame(gameContainerRef.current?.id || 'game-container');

        return () => {
            game.destroy(true);
        };
    }, []);

    return <div id="game-container" style={{ width: '100%', height: '100%', margin:'0 auto' }} />;
};

export default PhaserGame;