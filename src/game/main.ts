import { AUTO, Game } from 'phaser';
import CharacterSelectionScene from './scenes/CharacterSelectionScene';
import GameScene from './scenes/GameScene';

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: '100%',
    height: '100%',
    parent: 'game-container',
    backgroundColor: '#172b18',
    scene: [
        CharacterSelectionScene,
        GameScene
    ],
    physics: {
        default: "matter",
    },
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
}

export default StartGame;