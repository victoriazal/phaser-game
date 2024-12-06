import Phaser from 'phaser';

export default class CharacterSelectionScene extends Phaser.Scene {
    private selectedCharacter: string | null = null;

    constructor() {
        super({ key: 'CharacterSelectionScene' });
    }

    preload() {
        // Load character sprite sheets
        for (let i = 1; i <= 3; i++) {
            this.load.spritesheet(`character${i}`, `/assets/characters/character${i}.png`, {
                frameWidth: 64, // Width of each frame
                frameHeight: 64 // Height of each frame
            });
        }
    }

    create() {
        const characters = [
            { key: 'character1', x: 200, y: 300 },
            { key: 'character2', x: 600, y: 300 },
            { key: 'character3', x: 1000, y: 300 },
        ];

        // Create animations for each character
        characters.forEach((character, index) => {
            this.anims.create({
                key: `walk${index + 1}`,
                frames: this.anims.generateFrameNumbers(character.key, { start: 0, end: 3 }), // Assuming 12 frames (3 rows x 4 columns)
                frameRate: 10,
                repeat: -1
            });
        });

        characters.forEach(character => {
            const charImage = this.add.sprite(character.x, character.y, character.key)
                .setInteractive({ cursor: 'pointer' }) // Set cursor to pointer
                .setScale(2); // Scale down the character

            charImage.play(`walk${characters.indexOf(character) + 1}`);

            charImage.on('pointerdown', () => {
                this.selectedCharacter = character.key;
                console.log(`Selected character: ${this.selectedCharacter}`);
                characters.forEach(c => {
                    const img = this.children.getByName(c.key) as Phaser.GameObjects.Sprite;
                    if (c.key === character.key) {
                        img.setTint(0x44ff44);
                    } else {
                        img.clearTint();
                    }
                });
            });

            charImage.setName(character.key); // Set name for the image
        });

        // Play button
        const playButton = this.add.text(800, 800, 'Play', { fontSize: '32px', color: '#ffffff' })
            .setInteractive({ cursor: 'pointer' }) // Set cursor to pointer
            .on('pointerdown', () => {
                if (this.selectedCharacter) {
                    console.log(`Setting registry with character: ${this.selectedCharacter}`);
                    this.registry.set('selectedCharacter', this.selectedCharacter);
                    this.scene.start('GameScene'); // Switch to GameScene
                } else {
                    console.log('No character selected');
                }
            });
    }
}