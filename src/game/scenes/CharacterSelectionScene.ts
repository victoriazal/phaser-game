import Phaser from 'phaser';

export default class CharacterSelectionScene extends Phaser.Scene {
    private selectedCharacter: string | null = null;
    private playButton: Phaser.GameObjects.Text | null = null;

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
        this.load.image("forest", "/assets/forestBg.png");
    }

    create() {
        const sky = this.add.image(
            0,
            0,
            "forest"
        );
        sky.setOrigin(0, 0); // Set origin to the top-left corner
        sky.setDisplaySize(this.scale.width, this.scale.height);
        this.add.text(this.scale.width / 2, this.scale.height / 2 - 200, 'Please select the character', { fontSize: '34px', color: '#162f1a' })
            .setOrigin(0.5);
        
        const characters = [
            { key: 'character1', x: this.scale.width / 4, y: this.scale.height / 2 },
            { key: 'character2', x: this.scale.width / 2, y: this.scale.height / 2 },
            { key: 'character3', x: (this.scale.width / 4) * 3, y: this.scale.height / 2 },
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
                characters.forEach(c => {
                    const img = this.children.getByName(c.key) as Phaser.GameObjects.Sprite;
                    if (c.key === character.key) {
                        img.setTint(0x44ff44);
                    } else {
                        img.clearTint();
                    }
                });

                // Enable play button
                if (this.playButton) {
                    this.playButton.setInteractive({ cursor: 'pointer' });
                    this.playButton.setVisible(true);
                }
            });

            charImage.setName(character.key); // Set name for the image
        });

        // Create play button but make it non-interactive and invisible initially
        this.playButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 120, 'Play', { fontSize: '32px', color: '#162f1a' })
            .setOrigin(0.5) // Set origin to the center of the text
            .setInteractive({ cursor: 'pointer' })
            .setVisible(false)
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