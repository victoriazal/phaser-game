import Phaser from 'phaser';

export default class BasicScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BasicScene' });
    }

    preload() {
        // No assets to load
    }

    create() {
        this.cameras.main.setBackgroundColor('#FFFF00'); // Set background color to yellow
        this.cameras.main.setBounds(0, 0, 2000, 2000); // Set camera bounds larger than the screen
        this.cameras.main.setScroll(1000, 1000); // Start the camera at the center of the bounds
    }

    update() {
        // Allow arrow keys to move the camera
        const cursors = this.input.keyboard?.createCursorKeys();
        if (cursors?.left.isDown) {
            this.cameras.main.scrollX -= 10;
        } else if (cursors?.right.isDown) {
            this.cameras.main.scrollX += 10;
        }

        if (cursors?.up.isDown) {
            this.cameras.main.scrollY -= 10;
        } else if (cursors?.down.isDown) {
            this.cameras.main.scrollY += 10;
        }
    }
}