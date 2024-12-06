import { AUTO, Game } from 'phaser';
import CharacterSelectionScene from './scenes/CharacterSelectionScene';
import GameScene from './scenes/GameScene';
import RocksScene from './scenes/RocksScene';

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: '100%',
    height: '100%',
    parent: 'game-container',
    backgroundColor: '#2488b7',
    scene: [
        CharacterSelectionScene,
        GameScene,
        RocksScene,
    ],
    physics: {
        default: "matter",
    },
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
}

export default StartGame;