export default class RocksScene extends Phaser.Scene {
    private selectedCharacter: string | null = null;
    private player: Phaser.Physics.Matter.Sprite | null = null;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
    private rocks: Phaser.Physics.Matter.Image
    constructor() {
        super({ key: "RocksScene" });
    }

    preload() {
        for (let i = 1; i <= 3; i++) {
            this.load.spritesheet(
                `character${i}`,
                `/assets/characters/character${i}.png`,
                {
                    frameWidth: 64,
                    frameHeight: 64,
                }
            );
        }
        this.load.image("sky", "/assets/skyBg.png");
        this.load.image("rock", "/assets/rock.png");
    }

    create(): void {
        // Retrieve the selected character from the registry
        this.selectedCharacter = this.registry.get('selectedCharacter');
        if (!this.selectedCharacter) {
            console.error('No character selected');
            return;
        }

        // Add the sky background and make it fill the whole screen
        const sky = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, "sky");
        sky.setOrigin(0, 0); // Set origin to the top-left corner
        sky.setDisplaySize(this.scale.width, this.scale.height); // Scale to fit the screen

        // Create animations for walking left and right
        this.anims.create({
            key: "walk-left",
            frames: this.anims.generateFrameNumbers(this.selectedCharacter, {
                start: 4,
                end: 7,
            }), // Frames 4, 5, 6, 7
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "walk-right",
            frames: this.anims.generateFrameNumbers(this.selectedCharacter, {
                start: 8,
                end: 11,
            }), // Frames 8, 9, 10, 11
            frameRate: 10,
            repeat: -1,
        });
        this.rocks = this.matter.add
        .image(200, 200, "rock")
        .setOrigin(0, 0);
        // Add the player character using Matter.js
        this.player = this.matter.add.sprite(this.scale.width / 2, this.scale.height - 64, this.selectedCharacter);
        this.player.setScale(2); 
        this.player.setFixedRotation(); 
        // Set up keyboard controls
        this.cursors = this.input?.keyboard?.createCursorKeys() || null;

        // Set world bounds to match the screen size
        this.matter.world.setBounds(0, 0, this.scale.width, this.scale.height);
    }

    update(time: number, delta: number): void {
        if (!this.player) {
            return;
        }

        const speed = 5;
        let moving = false;

        if(this.rocks.y > this.scale.height){
            this.rocks.setY(0);
            this.rocks.setX(Math.random() * 480);
        }
        // Reset player velocity
        this.player.setVelocity(0);

        // Move player left and right with arrow keys
        if (this.cursors?.left.isDown) {
            this.player.setVelocityX(-speed);
            this.player.anims.play('walk-left', true);
            moving = true;
        } else if (this.cursors?.right.isDown) {
            this.player.setVelocityX(speed);
            this.player.anims.play('walk-right', true);
            moving = true;
        }

        // Stop animation if not moving
        if (!moving) {
            this.player.anims.stop();
        }

        // Prevent the player from going outside the bounds
        if (this.player.x < 0) {
            this.player.setPosition(0, this.player.y);
        } else if (this.player.x > this.scale.width) {
            this.player.setPosition(this.scale.width, this.player.y);
        }
    }
}